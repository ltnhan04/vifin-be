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
    return { ...docSnap.data(), _id: budgetId };
  };
  static createBudget = async ({
    category_id,
    wallet_id,
    startDate,
    dueDate,
    amount,
    is_completed,
  }) => {
    const budgetRef = db.collection("budgets").doc().id;
    const budgetData = {
      category_id: category_id,
      wallet_id: wallet_id,
      startDate: startDate,
      dueDate: dueDate,
      amount: amount || 0,
      is_completed: is_completed || false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.collection("budgets").doc(budgetRef).set(budgetData);

    return { ...budgetData, _id: budgetRef };
  };
  static updatedBudget = async (budgetId, data) => {
    await db.collection("budgets").doc(budgetId).update(data);
    return { ...data, _id: budgetId };
  };
  static deletedBudget = async (budgetId) => {
    return await db.collection("budgets").doc(budgetId).delete();
  };

  static checkBudgetCompletion = async () => {};
  static notifyBudgetOverlimit = async () => {};

  static handleRepeatBudget = async () => {};
  static autoRenewBudget = async () => {};
}

module.exports = BudgetService;
