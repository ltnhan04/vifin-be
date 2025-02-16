const { db } = require("../configs/firebase.config");
const BudgetService = require("../services/budget.service");

class WalletService {
  static getWallets = async () => {
    const walletData = [];
    const querySnap = await db.collection("wallets").get();
    querySnap.forEach((docSnap) =>
      walletData.push({ ...docSnap.data(), _id: docSnap.id })
    );
    return walletData;
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
    budget.forEach(
      async (docSnap) => await db.collection("budgets").doc(docSnap.id).delete()
    );
    return;
  };
}

module.exports = WalletService;
