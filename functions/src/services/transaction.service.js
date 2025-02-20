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
    const budgetRef = await this.handleUpdateBudgetAmount(
      wallet_id,
      category_id
    );

    await db.runTransaction(async (t) => {
      const walletDoc = await t.get(walletRef);
      if (!walletDoc.exists) {
        throw new ErrorHandler("Wallet does not exist", 404);
      }
      let budgetDoc = null;
      if (budgetRef && transaction_type === "expense") {
        budgetDoc = await t.get(budgetRef);
      }

      const walletData = walletDoc.data();
      const newBalance = await this.calculateBalance(
        transaction_type,
        walletData.amount,
        amount
      );

      let newUsage;
      if (budgetDoc && budgetDoc.exists) {
        const budgetData = budgetDoc.data();
        newUsage = Number(budgetData.usage || 0) + Number(amount);
      }

      t.update(walletRef, { amount: newBalance, updatedAt: new Date() });
      if (
        budgetRef &&
        transaction_type === "expense" &&
        budgetDoc &&
        budgetDoc.exists
      ) {
        t.update(budgetRef, { usage: newUsage, updatedAt: new Date() });
      }
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
      let budgetDoc = null;
      const budgetQuery = await t.get(
        db
          .collection("budgets")
          .where("wallet_id", "==", oldTransaction.wallet_id)
          .where("category_id", "==", oldTransaction.category_id)
      );
      if (!budgetQuery.empty) {
        const bRef = db.collection("budgets").doc(budgetQuery.docs[0].id);
        budgetDoc = await t.get(bRef);
      }

      const walletData = walletDoc.data();
      const newWalletAmount = await this.handleUpdatedWalletAmount(
        oldTransaction.transaction_type,
        newData.amount,
        walletData.amount,
        oldTransaction.amount
      );

      let newUsage;
      if (budgetDoc && budgetDoc.exists) {
        let { usage = 0 } = budgetDoc.data();
        if (oldTransaction.transaction_type === "expense") {
          usage -= Number(oldTransaction.amount);
        }
        if (newData.transaction_type === "expense") {
          usage += Number(newData.amount);
        }
        newUsage = usage;
      }

      t.update(walletRef, { amount: newWalletAmount, updatedAt: new Date() });
      if (budgetDoc && budgetDoc.exists) {
        const budgetRef = db.collection("budgets").doc(budgetQuery.docs[0].id);
        t.update(budgetRef, { usage: newUsage, updatedAt: new Date() });
      }
      t.update(transactionRef, { ...newData, updatedAt: new Date() });
    });

    return await this.getTransactionById(transactionId);
  };

  static calculateBalance = async (type, walletAmount, transactionAmount) => {
    let newBalance;
    if (type === "expense") {
      newBalance = Number(walletAmount) - Number(transactionAmount);
    } else if (type === "income") {
      newBalance = Number(walletAmount) + Number(transactionAmount);
    } else {
      throw new ErrorHandler("Invalid transaction type", 400);
    }
    return newBalance;
  };
  static handleUpdatedWalletAmount = async (
    type,
    newAmount,
    walletAmount,
    transactionAmount
  ) => {
    const amountDiff = Number(newAmount) - Number(transactionAmount);
    let newWalletAmount;
    if (type === "expense") {
      newWalletAmount = Number(walletAmount) - amountDiff;
    } else if (type === "income") {
      newWalletAmount = Number(walletAmount) + amountDiff;
    } else {
      throw new ErrorHandler("Invalid transaction type", 400);
    }
    return newWalletAmount;
  };
  static handleUpdateBudgetAmount = async (walletId, categoryId) => {
    const budgetsDoc = await db
      .collection("budgets")
      .where("wallet_id", "==", walletId)
      .where("category_id", "==", categoryId)
      .get();
    return budgetsDoc.empty
      ? null
      : db.collection("budgets").doc(budgetsDoc.docs[0].id);
  };
}

module.exports = TransactionService;
