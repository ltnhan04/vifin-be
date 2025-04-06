const { db, Timestamp } = require("../configs/firebase.config");
const ErrorHandler = require("../middlewares/error.handler");
const CategoryService = require("../services/category.service");
const WalletService = require("../services/wallet.service");
const NotificationService = require("./notification.service");
const CustomerService = require("./customer.service");

class BudgetService {
  static getBudgets = async () => {
    const budgets = [];
    const querySnap = await db.collection("budgets").get();
    querySnap.forEach((docSnap) =>
      budgets.push({ ...docSnap.data(), _id: docSnap.id })
    );
    return budgets;
  };
  static getBudgetById = async (budgetId) => {
    const budgetDoc = await db.collection("budgets").doc(budgetId).get();
    if (!budgetDoc.exists) {
      throw new ErrorHandler("Budget not found", 404);
    }
    return { ...budgetDoc.data(), _id: budgetId };
  };
  static getBudgetByRepeatType = async (walletId, repeat_type) => {
    const budgetDocs = await db
      .collection("budgets")
      .where("wallet_id", "==", walletId)
      .where("repeat_type", "==", repeat_type)
      .get();

    const budgetPromises = budgetDocs.docs.map(async (doc) => {
      const budgetData = { ...doc.data(), _id: doc.id };
      const [category, wallet] = await Promise.all([
        CategoryService.getCategory(budgetData.category_id),
        WalletService.getWallet(budgetData.wallet_id),
      ]);
      const { category_id, wallet_id, ...budgetWithoutIds } = budgetData;
      return {
        ...budgetWithoutIds,
        category,
        wallet,
      };
    });

    return await Promise.all(budgetPromises);
  };
  static createBudget = async ({
    category_id,
    wallet_id,
    startDate,
    dueDate,
    amount,
    repeat_type,
    is_repeated,
    is_completed,
  }) => {
    const budgetRef = db.collection("budgets").doc().id;
    const budgetData = {
      category_id: category_id,
      wallet_id: wallet_id,
      startDate: new Date(startDate),
      dueDate: new Date(dueDate),
      amount: amount || 0,
      usage: 0,
      repeat_type: repeat_type,
      is_repeated: is_repeated,
      is_completed: is_completed || false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await db.collection("budgets").doc(budgetRef).set(budgetData);
    return { ...budgetData, _id: budgetRef };
  };
  static updateBudget = async (budgetId, data) => {
    const existingBudget = await this.getBudgetById(budgetId);
    if (!existingBudget) {
      throw new ErrorHandler("Budget not found", 404);
    }
    if (data.startDate) {
      data.startDate = Timestamp.fromDate(new Date(data.startDate));
    }
    if (data.dueDate) {
      data.dueDate = Timestamp.fromDate(new Date(data.dueDate));
    }
    const budgetData = {
      ...data,
      updatedAt: Timestamp.now(),
    };
    await db.collection("budgets").doc(budgetId).update(budgetData);
    const updatedBudget = await this.getBudgetById(budgetId);
    return { ...updatedBudget, _id: budgetId };
  };
  static deleteBudget = async (budgetId) => {
    const budgetData = await this.getBudgetById(budgetId);
    await db.collection("budgets").doc(budgetId).delete();
    return { ...budgetData, _id: budgetId };
  };

  static getBudgetUsage = async (budgetId) => {
    const budgetDoc = await db.collection("budgets").doc(budgetId).get();
    return budgetDoc.data().usage;
  };
  static checkBudgetCompletion = async (budget) => {
    const now = new Date();
    const usage = await this.getBudgetUsage(budget._id);
    const dueDate =
      budget.dueDate && budget.dueDate.toDate
        ? budget.dueDate.toDate()
        : new Date(budget.dueDate);

    if (now > dueDate || usage >= budget.amount || budget.is_completed) {
      if (!budget.is_completed) {
        await this.updateBudget(budget._id, { is_completed: true });
      }
      return true;
    }
    return false;
  };
  static notifyBudgetOverLimit = async (budget) => {
    try {
      const customer = await CustomerService.getCustomer(budget.customer_id);
      const category = await CategoryService.getCategory(budget.category_id);

      if (customer.push_token) {
        const title = "Oops! Budget Limit Reached";
        const body = `You've gone over your budget for "${category.name}". You've spent ${budget.usage} out of ${budget.amount}. Let's get back on track!`;

        await NotificationService.sendPushNotification(
          [customer.push_token],
          title,
          body,
          {
            type: "budget_over_limit",
            budget_id: budget._id,
            category_id: budget.category_id,
            wallet_id: budget.wallet_id,
          }
        );
      }
    } catch (error) {
      console.error("Error sending budget notification:", error);
    }
  };
  static handleRepeatBudget = async (budget) => {
    const currentDate = new Date();
    const dueDate =
      budget.dueDate && budget.dueDate.toDate
        ? budget.dueDate.toDate()
        : new Date(budget.dueDate);
    const usage = await this.getBudgetUsage(budget._id);
    const isCompleted = usage >= budget.amount;
    if (budget.is_repeated && (currentDate >= dueDate || isCompleted)) {
      const newDueDate = this.autoRenewBudget(
        budget.repeat_type,
        budget.startDate,
        dueDate
      );
      const newBudgetData = {
        category_id: budget.category_id,
        wallet_id: budget.wallet_id,
        startDate: currentDate,
        dueDate: newDueDate,
        amount: budget.amount,
        repeat_type: budget.repeat_type,
        is_repeated: budget.is_repeated,
        is_completed: false,
      };
      await this.createBudget(newBudgetData);
    }
    return null;
  };
  static autoRenewBudget = (repeat_type, startDate, dueDate) => {
    const startCustomDate =
      startDate && startDate.toDate
        ? startDate.toDate().getDate()
        : new Date(startDate).getDate();
    const newDueDate =
      dueDate && dueDate.toDate
        ? new Date(dueDate.toDate())
        : new Date(dueDate);

    switch (repeat_type) {
      case "weekly": {
        return newDueDate.setDate(newDueDate.getDate() + 7);
      }
      case "monthly": {
        return newDueDate.setMonth(newDueDate.getMonth() + 1);
      }
      case "yearly": {
        return newDueDate.setFullYear(newDueDate.getFullYear() + 1);
      }
      case "custom": {
        const diff = newDueDate.getDate() - startCustomDate;
        return newDueDate.setDate(newDueDate.getDate() + diff);
      }
      default:
        break;
    }
    return newDueDate;
  };
}

module.exports = BudgetService;
