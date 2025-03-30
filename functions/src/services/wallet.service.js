const { db } = require("../configs/firebase.config");
const ErrorHandler = require("../middlewares/error.handler");
const { createImageUrl, deleteImageFromStorage } = require("../utils/upload");
const { getDateRange, formattedTransactionDate } = require("../utils/date");

class WalletService {
  static getWallets = async (customerId) => {
    console.log(customerId);
    const walletData = [];
    const querySnap = await db
      .collection("wallets")
      .where("customer_id", "==", customerId)
      .get();
    querySnap.forEach((docSnap) =>
      walletData.push({ ...docSnap.data(), _id: docSnap.id })
    );
    return walletData;
  };
  static getWallet = async (id) => {
    const walletDoc = await db.collection("wallets").doc(id).get();
    if (!walletDoc.exists) {
      throw new ErrorHandler("Wallet not found", 404);
    }
    return walletDoc.data();
  };
  static createWallet = async ({
    symbol,
    wallet_name,
    customer_id,
    currency_unit = "VND",
    amount,
  }) => {
    let imageUrl = null;
    if (symbol) {
      imageUrl = await createImageUrl(symbol);
    }

    const walletRef = db.collection("wallets").doc();
    const walletData = {
      symbol: imageUrl,
      wallet_name: wallet_name || null,
      customer_id: customer_id,
      currency_unit: currency_unit,
      amount: amount || 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await walletRef.set(walletData);
    return { ...walletData, _id: walletRef.id };
  };
  static updateWallet = async (id, data) => {
    const walletRef = db.collection("wallets").doc(id);
    const walletData = await this.getWallet(id);
    if (!walletData) {
      throw new ErrorHandler("Wallet not found", 404);
    }
    let imageUrl = walletData.symbol;
    if (data.symbol) {
      imageUrl = await createImageUrl(data.symbol);
      if (walletData.symbol) {
        await deleteImageFromStorage(walletData.symbol);
      }
    }
    const { wallet_name, currency_unit, amount } = data;
    const updateData = {
      ...(wallet_name && { wallet_name }),
      ...(currency_unit && { currency_unit }),
      ...(amount !== undefined && { amount }),
      symbol: imageUrl,
      updatedAt: new Date(),
    };

    await walletRef.update(updateData);
    const updatedWallet = await this.getWallet(id);

    return { ...updatedWallet, _id: id };
  };
  static deleteWallet = async (id) => {
    const walletRef = db.collection("wallets").doc(id);
    const walletData = await this.getWallet(id);
    if (!walletData) {
      throw new Error("Wallet not found");
    }
    if (walletData.symbol) {
      await deleteImageFromStorage(walletData.symbol);
    }
    await walletRef.delete();
    const budgetDocs = await db
      .collection("budgets")
      .where("wallet_id", "==", id)
      .get();

    await Promise.all(
      budgetDocs.docs.map(async (doc) =>
        db.collection("budgets").doc(doc.id).delete()
      )
    );

    const transactionDocs = await db
      .collection("transactions")
      .where("wallet_id", "==", id)
      .get();

    await Promise.all(
      transactionDocs.docs.map(async (doc) =>
        db.collection("transactions").doc(doc.id).delete()
      )
    );

    return walletData;
  };
  static getTransactionsByWalletAndType = async ({
    walletId,
    customerId,
    startTimestamp,
    endTimestamp,
  }) => {
    const transactions = [];
    const querySnap = await db
      .collection("transactions")
      .where("customer_id", "==", customerId)
      .where("wallet_id", "==", walletId)
      .where("createdAt", ">=", startTimestamp)
      .where("createdAt", "<=", endTimestamp)
      .orderBy("createdAt", "asc")
      .get();

    querySnap.forEach((docSnap) =>
      transactions.push({ ...docSnap.data(), _id: docSnap.id })
    );

    return transactions;
  };
  static getStatisticByWeek = async (walletId, customerId) => {
    try {
      const { startTimestamp, endTimestamp } = getDateRange("week");
      const transactions = await this.getTransactionsByWalletAndType({
        walletId,
        customerId,
        startTimestamp,
        endTimestamp,
      });
      const transactionsByDay = new Map();
      let totalIncome = 0;
      let totalExpense = 0;
      for (let transaction of transactions) {
        const date = formattedTransactionDate(transaction.createdAt.toDate());
        if (!transactionsByDay.has(date)) {
          transactionsByDay.set(date, {
            date,
            totalIncome: 0,
            totalExpense: 0,
            transactions: [],
          });
        }
        if (transaction.transaction_type === "income") {
          transactionsByDay.get(date).totalIncome += transaction.amount;
          totalIncome += transaction.amount;
        } else if (transaction.transaction_type === "expense") {
          transactionsByDay.get(date).totalExpense += transaction.amount;
          totalExpense += transaction.amount;
        }
        transactionsByDay.get(date).transactions.push(transaction);
      }

      return {
        totalIncome,
        totalExpense,
        transactionsByDay: Array.from(transactionsByDay.values()),
      };
    } catch (error) {
      throw new ErrorHandler(error.message, 500);
    }
  };
  static getStatisticByMonth = async (walletId, customerId) => {
    try {
      const { startTimestamp, endTimestamp } = getDateRange("month");
      const transactions = await this.getTransactionsByWalletAndType({
        walletId,
        customerId,
        startTimestamp,
        endTimestamp,
      });

      const transactionsByMonth = new Map();
      let totalIncome = 0;
      let totalExpense = 0;

      for (let transaction of transactions) {
        const date = transaction.createdAt.toDate();
        const monthKey = `${date.getFullYear()}-${String(
          date.getMonth() + 1
        ).padStart(2, "0")}`;

        if (!transactionsByMonth.has(monthKey)) {
          transactionsByMonth.set(monthKey, {
            month: monthKey,
            totalIncome: 0,
            totalExpense: 0,
            transactions: [],
          });
        }

        if (transaction.transaction_type === "income") {
          transactionsByMonth.get(monthKey).totalIncome += transaction.amount;
          totalIncome += transaction.amount;
        } else if (transaction.transaction_type === "expense") {
          transactionsByMonth.get(monthKey).totalExpense += transaction.amount;
          totalExpense += transaction.amount;
        }

        transactionsByMonth.get(monthKey).transactions.push(transaction);
      }

      return {
        totalIncome,
        totalExpense,
        transactionsByMonth: Array.from(transactionsByMonth.values()),
      };
    } catch (error) {
      throw new ErrorHandler(error.message, 500);
    }
  };
  static getStatisticByYear = async (walletId, customerId) => {
    try {
      const { startTimestamp, endTimestamp } = getDateRange("year");
      const transactions = await this.getTransactionsByWalletAndType({
        walletId,
        customerId,
        startTimestamp,
        endTimestamp,
      });

      const transactionsByYear = new Map();
      let totalIncome = 0;
      let totalExpense = 0;

      for (let transaction of transactions) {
        const yearKey = transaction.createdAt.toDate().getFullYear().toString();

        if (!transactionsByYear.has(yearKey)) {
          transactionsByYear.set(yearKey, {
            year: yearKey,
            totalIncome: 0,
            totalExpense: 0,
            transactions: [],
          });
        }

        if (transaction.transaction_type === "income") {
          transactionsByYear.get(yearKey).totalIncome += transaction.amount;
          totalIncome += transaction.amount;
        } else if (transaction.transaction_type === "expense") {
          transactionsByYear.get(yearKey).totalExpense += transaction.amount;
          totalExpense += transaction.amount;
        }

        transactionsByYear.get(yearKey).transactions.push(transaction);
      }

      return {
        totalIncome,
        totalExpense,
        transactionsByYear: Array.from(transactionsByYear.values()),
      };
    } catch (error) {
      throw new ErrorHandler(error.message, 500);
    }
  };
}

module.exports = WalletService;
