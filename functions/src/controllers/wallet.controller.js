const WalletService = require("../services/wallet.service");
const ResponseHandler = require("../utils/response.handler");

const getWallets = async (req, res, next) => {
  try {
    const customerId = req.customer.user_id;
    const wallets = await WalletService.getWallets(customerId);
    return ResponseHandler.sendSuccess(
      res,
      wallets,
      200,
      "Get Wallets successfully"
    );
  } catch (error) {
    next(error);
  }
};

const getWallet = async (req, res, next) => {
  try {
    const walletId = req.params.id;
    const wallet = await WalletService.getWallet(walletId);
    return ResponseHandler.sendSuccess(
      res,
      wallet,
      200,
      "Get Wallet Successfully"
    );
  } catch (error) {
    next(error);
  }
};

const createWallet = async (req, res, next) => {
  try {
    const wallet = await WalletService.createWallet({
      ...req.body,
      customer_id: req.customer.user_id,
      symbol: req.files[0],
    });
    return ResponseHandler.sendSuccess(
      res,
      wallet,
      201,
      "Created Wallet Successfully!"
    );
  } catch (error) {
    next(error);
  }
};

const updateWallet = async (req, res, next) => {
  try {
    const walletId = req.params.id;
    const wallet = await WalletService.updateWallet(walletId, {
      ...req.body,
      symbol: req.files[0] || null,
    });
    return ResponseHandler.sendSuccess(
      res,
      wallet,
      200,
      "Updated Wallet Successfully"
    );
  } catch (error) {
    next(error);
  }
};

const deleteWallet = async (req, res, next) => {
  try {
    const walletId = req.params.id;
    const deletedWallet = await WalletService.deleteWallet(walletId);
    return ResponseHandler.sendSuccess(
      res,
      deletedWallet,
      200,
      "Deleted Wallet Successfully"
    );
  } catch (error) {
    next(error);
  }
};

const statisticByWeek = async (req, res, next) => {
  try {
    const customerId = req.customer.user_id;
    const { walletId } = req.query;
    const weekly = await WalletService.getStatisticByWeek(
      walletId.replace(/"/g, ""),
      customerId
    );
    return ResponseHandler.sendSuccess(
      res,
      weekly,
      200,
      "Get Weekly Statistic Successfully"
    );
  } catch (error) {
    next(error);
  }
};
const statisticByMonth = async (req, res, next) => {
  try {
    const customerId = req.customer.user_id;
    const { walletId } = req.query;
    const monthly = await WalletService.getStatisticByMonth(
      walletId.replace(/"/g, ""),
      customerId
    );
    return ResponseHandler.sendSuccess(
      res,
      monthly,
      200,
      "Get Monthly Statistic Successfully"
    );
  } catch (error) {
    next(error);
  }
};

const statisticByYear = async (req, res, next) => {
  try {
    const customerId = req.customer.user_id;
    const { walletId } = req.query;
    const yearly = await WalletService.getStatisticByYear(
      walletId.replace(/"/g, ""),
      customerId
    );
    return ResponseHandler.sendSuccess(
      res,
      yearly,
      200,
      "Get Yearly Statistic Successfully"
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createWallet,
  updateWallet,
  deleteWallet,
  getWallets,
  getWallet,
  statisticByWeek,
  statisticByMonth,
  statisticByYear,
};
