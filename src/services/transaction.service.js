const { db } = require("../configs/firebase.config");
class TransactionService {
  static createTransaction = async ({
    amount,
    customer_id,
    transaction_type,
    wallet_id,
    category_id,
    note,
  }) => {
    const transactionRef = db.collection("transactions").doc().id;
    const transactionData = {
      amount: amount || 0,
      customer_id: customer_id,
      transaction_type: transaction_type,
      wallet_id: wallet_id,
      category_id: category_id,
      note: note || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db
      .collection("transactions")
      .doc(transactionRef)
      .set(transactionData);
    return { ...transactionData, _id: transactionRef };
  };
  static getTransactionById = async (transactionId) => {
    const docSnap = await db
      .collection("transactions")
      .doc(transactionId)
      .get();
    if (docSnap.exists) {
      return { ...docSnap.data(), _id: docSnap.id };
    }
    return null;
  };
  static getTransactions = async (customerId) => {
    const transactions = [];
    const querySnap = await db
      .collection("transactions")
      .where("customer_id", "==", customerId)
      .get();
    querySnap.forEach((docSnap) =>
      transactions.push({ ...docSnap.data(), _id: docSnap.id })
    );
    return transactions;
  };
  static updateTransaction = async (transactionId, data) => {
    const transactionData = {
      ...data,
      updatedAt: new Date(),
    };
    await db
      .collection("transactions")
      .doc(transactionId)
      .update(transactionData);
    const updatedTransaction = await this.getTransactionById(transactionId);
    return updatedTransaction;
  };
  static deleteTransaction = async (transactionId) => {
    return await db.collection("transactions").doc(transactionId).delete();
  };

  static getTransactionsByDateRange = async (
    startDate,
    endDate,
    customerId
  ) => {};
  static getTransactionsByWallet = async (walletId, customerId) => {};
  static getTransactionByType = async (type, customerId) => {};
  static getStatistics = async (customerId) => {};

  static createTransactionWithWalletUpdate = async (data) => {};
  static updateTransactionWithWalletAdjustment = async () => {};
}

module.exports = TransactionService;
