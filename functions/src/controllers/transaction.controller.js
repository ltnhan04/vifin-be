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

const getTransactions = async (req, res, next) => {
  try {
    const customerId = req.customer.user_id;
    const transactions = await TransactionService.getTransactions(customerId);
    return ResponseHandler.sendSuccess(
      res,
      transactions,
      200,
      "Get Transactions Successfully"
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
    await TransactionService.deleteTransaction(transactionId);
    return ResponseHandler.sendSuccess(
      res,
      "",
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
  getTransactions,
  updateTransactions,
  deleteTransactions,
};
