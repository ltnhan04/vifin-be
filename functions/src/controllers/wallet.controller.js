const WalletService = require("../services/wallet.service");
const ResponseHandler = require("../utils/response.handler");

const getWallets = async (_req, res, next) => {
  try {
    const wallets = await WalletService.getWallets();
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
    const transactions = await WalletService.getBudgetInWallet(walletId);
    return ResponseHandler.sendSuccess(
      res,
      transactions,
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
    const wallet = await WalletService.updateWallet(walletId, req.body);
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
      "",
      200,
      "Deleted Wallet Successfully"
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
};
