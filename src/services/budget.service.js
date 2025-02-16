const { db } = require("../configs/firebase.config");
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
    const docSnap = await db.collection("budgets").doc(budgetId).get();
    if (docSnap.exists) {
      return { ...docSnap.data(), _id: budgetId };
    }
    return null;
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
      startDate: startDate,
      dueDate: dueDate,
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
    const budgetData = {
      ...data,
      updatedAt: new Date(),
    };
    await db.collection("budgets").doc(budgetId).update(budgetData);
    return { ...budgetData, _id: budgetId };
  };
  static deleteBudget = async (budgetId) => {
    await db.collection("budgets").doc(budgetId).delete();
    return { success: true };
  };

  static getBudgetUsage = async (budgetId) => {
    const budgetSnap = await db.collection("budgets").doc(budgetId).get();
    return budgetSnap.data().usage;
  };

  static checkBudgetCompletion = async (budget) => {
    const now = new Date();
    const usage = await this.getBudgetUsage(budget._id);
    const dueDate = new Date(budget.dueDate);
    if (now > dueDate || usage >= budget.amount || budget.is_completed) {
      if (!budget.is_completed) {
        await this.updateBudget(budget._id, { is_completed: true });
      }
      return true;
    }
    return false;
  };
  static notifyBudgetOverLimit = async () => {};
  static handleRepeatBudget = async (budget) => {
    const currentDate = new Date();
    const dueDate = new Date(budget.dueDate);
    if (budget.is_repeated && currentDate >= budget.dueDate) {
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
      return await this.createBudget(newBudgetData);
    }
    return null;
  };
  static autoRenewBudget = (repeat_type, startDate, dueDate) => {
    const startCustomDate = new Date(startDate).getDate();
    const newDueDate = new Date(dueDate);
    switch (repeat_type) {
      case "weekly": {
        return newDueDate.setDate(newDueDate.getDate + 7);
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
