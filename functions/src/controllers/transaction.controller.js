const TransactionService = require("../services/transaction.service");
const ErrorHandler = require("../middlewares/error.handler");
const ResponseHandler = require("../utils/response.handler");

const createTransaction = async (req, res, next) => {
  try {
    const customerId = req.customer.user_id;
    const newTransaction =
      await TransactionService.createTransactionWithWalletUpdate({
        ...req.body,
        customer_id: customerId,
      });
    if (newTransaction) {
      return ResponseHandler.sendSuccess(
        res,
        newTransaction,
        201,
        "Create Transaction Successfully"
      );
    }
    throw new ErrorHandler("Transaction Not Found", 404);
  } catch (error) {
    next(error);
  }
};

const getTransaction = async (req, res, next) => {
  try {
    const transactionId = req.params.id;
    const transaction = await TransactionService.getTransactionById(
      transactionId
    );
    return ResponseHandler.sendSuccess(
      res,
      transaction,
      200,
      "Get Transaction Successfully"
    );
  } catch (error) {
    next(error);
  }
};
const weeklyTransaction = async (req, res, next) => {
  try {
    const { walletId, type } = req.query;
    const transactions = await TransactionService.getStatisticByWeek(
      type.replace(/"/g, ""),
      walletId,
      req.customer.user_id
    );
    return ResponseHandler.sendSuccess(
      res,
      transactions,
      200,
      " Get Transactions By Week Successfully"
    );
  } catch (error) {
    next(error);
  }
};
const monthlyTransaction = async (req, res, next) => {
  try {
    const { walletId, type } = req.query;
    const transactions = await TransactionService.getStatisticByMonth(
      type.replace(/"/g, ""),
      walletId,
      req.customer.user_id
    );
    return ResponseHandler.sendSuccess(
      res,
      transactions,
      200,
      "Get Transactions By Month Successfully"
    );
  } catch (error) {
    next(error);
  }
};
const yearlyTransaction = async (req, res, next) => {
  try {
    const { walletId, type } = req.query;
    const transactions = await TransactionService.getStatisticByYear(
      type.replace(/"/g, ""),
      walletId,
      req.customer.user_id
    );
    return ResponseHandler.sendSuccess(
      res,
      transactions,
      200,
      "Get Transactions By Year Successfully"
    );
  } catch (error) {
    next(error);
  }
};
const recentTransactions = async (req, res, next) => {
  try {
    const { walletId, limit, type } = req.query;
    const transactions = await TransactionService.getRecentTransactions(
      walletId,
      type.replace(/"/g, ""),
      limit
    );
    return ResponseHandler.sendSuccess(
      res,
      transactions,
      200,
      "Get recent transactions successfully"
    );
  } catch (error) {
    next(error);
  }
};

const filterTransactions = async (req, res, next) => {
  try {
    const customerId = req.customer.user_id;
    const { walletId, type } = req.query;

    const transactions =
      await TransactionService.getTransactionsByWalletAndType({
        walletId,
        type,
        customerId,
      });
    return ResponseHandler.sendSuccess(
      res,
      transactions,
      200,
      "Filter Transactions Successfully"
    );
  } catch (error) {
    next(error);
  }
};

const updateTransactions = async (req, res, next) => {
  try {
    const transactionId = req.params.id;
    const updatedTransactions =
      await TransactionService.updateTransactionWithWalletAdjustment(
        transactionId,
        req.body
      );
    return ResponseHandler.sendSuccess(
      res,
      updatedTransactions,
      200,
      "Updated Transaction Successfully"
    );
  } catch (error) {
    next(error);
  }
};

const deleteTransactions = async (req, res, next) => {
  try {
    const transactionId = req.params.id;
    const deletedTransaction = await TransactionService.deleteTransaction(
      transactionId
    );
    return ResponseHandler.sendSuccess(
      res,
      deletedTransaction,
      200,
      "Deleted Transaction Successfully"
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTransaction,
  getTransaction,
  updateTransactions,
  deleteTransactions,
  filterTransactions,
  recentTransactions,
  weeklyTransaction,
  monthlyTransaction,
  yearlyTransaction,
};
