const { db } = require("../configs/firebase.config");
const ErrorHandler = require("../middlewares/error.handler");
class TransactionService {
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
  static deleteTransaction = async (transactionId) => {
    return await db.collection("transactions").doc(transactionId).delete();
  };

  static getTransactionsByDateRange = async (
    startDate,
    endDate,
    customerId
  ) => {
    const transactions = [];
    const querySnap = await db
      .collection("transactions")
      .where("customer_id", "==", customerId)
      .where("createdAt", ">=", new Date(startDate))
      .where("createdAt", "<=", new Date(endDate))
      .get();
    querySnap.forEach((doc) => {
      transactions.push({ ...doc.data(), _id: doc.id });
    });

    return transactions;
  };
  static getTransactionsByWallet = async (walletId, customerId) => {
    const wallets = [];
    const querySnap = await db
      .collection("transactions")
      .where("customer_id", "==", customerId)
      .where("wallet_id", "==", walletId)
      .get();

    querySnap.forEach((docSnap) =>
      wallets.push({ ...docSnap.data(), _id: docSnap.id })
    );
    return wallets;
  };
  static getTransactionByType = async (type, customerId) => {
    const types = [];
    const querySnap = await db
      .collection("transactions")
      .where("customer_id", "==", customerId)
      .where("transaction_type", "==", type)
      .get();

    querySnap.forEach((docSnap) =>
      types.push({ ...docSnap.data(), _id: docSnap.id })
    );
    return types;
  };
  static getStatistics = async (customerId) => {};

  static createTransactionWithWalletUpdate = async ({
    amount,
    customer_id,
    transaction_type,
    wallet_id,
    category_id,
    note,
  }) => {
    const transactionRef = db.collection("transactions").doc();
    const walletRef = db.collection("wallets").doc(wallet_id);

    await db.runTransaction(async (t) => {
      const walletDoc = await t.get(walletRef);
      if (!walletDoc) {
        throw new ErrorHandler("Wallet does not exist", 404);
      }
      const walletData = walletDoc.data();
      let newBalance;
      if (transaction_type === "expense") {
        newBalance = Number(walletData.amount) - Number(amount);
      } else if (transaction_type === "income") {
        newBalance = Number(walletData.amount) + Number(amount);
      } else {
        throw new ErrorHandler("Invalid transaction type", 400);
      }
      t.update(walletRef, { amount: newBalance, updatedAt: new Date() });

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
      t.set(transactionRef, transactionData);
    });
    return {
      ...(await this.getTransactionById(transactionRef.id)),
      _id: transactionRef.id,
    };
  };
  static updateTransactionWithWalletAdjustment = async (
    transactionId,
    newData
  ) => {
    const transactionRef = db.collection("transactions").doc(transactionId);

    await db.runTransaction(async (t) => {
      const transactionDoc = await t.get(transactionRef);
      if (!transactionDoc.exists) {
        throw new ErrorHandler("Transaction does not exist", 404);
      }
      const oldTransaction = transactionDoc.data();

      const walletRef = db.collection("wallets").doc(oldTransaction.wallet_id);
      const walletDoc = await t.get(walletRef);
      if (!walletDoc.exists) {
        throw new ErrorHandler("Wallet does not exist", 404);
      }
      const walletData = walletDoc.data();

      const amountDiff = Number(newData.amount) - Number(oldTransaction.amount);
      let newWalletAmount;
      if (oldTransaction.transaction_type === "expense") {
        newWalletAmount = Number(walletData.amount) - amountDiff;
      } else if (oldTransaction.transaction_type === "income") {
        newWalletAmount = Number(walletData.amount) + amountDiff;
      } else {
        throw new ErrorHandler("Invalid transaction type", 400);
      }

      t.update(walletRef, { amount: newWalletAmount, updatedAt: new Date() });
      t.update(transactionRef, { ...newData, updatedAt: new Date() });
    });

    return await this.getTransactionById(transactionId);
  };
}

module.exports = TransactionService;
