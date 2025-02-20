const { db } = require("../configs/firebase.config");
const CategoryService = require("../services/category.service");

class WalletService {
  static getWallets = async () => {
    const walletData = [];
    const querySnap = await db.collection("wallets").get();
    querySnap.forEach((docSnap) =>
      walletData.push({ ...docSnap.data(), _id: docSnap.id })
    );
    return walletData;
  };
  static getBudgetInWallet = async (walletId) => {
    const budgetDocs = await db
      .collection("budgets")
      .where("wallet_id", "==", walletId)
      .get();

    const budgets = Promise.all(
      budgetDocs.docs.map(async (doc) => {
        const budgetData = { ...doc.data(), _id: doc.id };
        const category = await CategoryService.getCategory(
          budgetData.category_id
        );
        return { ...budgetData, category };
      })
    );
    return budgets;
  };
  static createWallet = async ({
    symbol,
    wallet_name,
    customer_id,
    currency_unit = "VND",
    amount,
  }) => {
    const walletRef = db.collection("wallets").doc();
    const walletData = {
      symbol: symbol || null,
      wallet_name: wallet_name || null,
      customer_id: customer_id,
      currency_unit: currency_unit,
      amount: amount || 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await db.collection("wallets").doc(walletRef.id).set(walletData);
    return { ...walletData, _id: walletRef.id };
  };
  static updateWallet = async (id, data) => {
    const updateData = { ...data, updatedAt: new Date() };
    await db.collection("wallets").doc(id).update(updateData);
    return { ...updateData, _id: id };
  };
  static deleteWallet = async (id) => {
    await db.collection("wallets").doc(id).delete();
    const budget = await db
      .collection("budgets")
      .where("wallet_id", "==", id)
      .get();
    await Promise.all(
      budget.forEach(
        async (docSnap) =>
          await db.collection("budgets").doc(docSnap.id).delete()
      )
    );

    const transaction = await db
      .collection("transactions")
      .where("wallet_id", "==", id)
      .get();
    await Promise.all(
      transaction.forEach(
        async (docSnap) =>
          await db.collection("transactions").doc(docSnap.id).delete()
      )
    );

    return;
  };
}

module.exports = WalletService;
