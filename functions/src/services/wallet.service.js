const { db } = require("../configs/firebase.config");
const ErrorHandler = require("../middlewares/error.handler");
const { createImageUrl, deleteImageFromStorage } = require("../utils/upload");
const { createWalletSchema, updateWalletSchema} = require("../../src/validations/wallet.schema")

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
    // Validate dữ liệu đầu vào
    const { error, value } = createWalletSchema.validate(
      { symbol, wallet_name, customer_id, currency_unit, amount },
      { abortEarly: false }
    );

    if (error) {
      throw new Error(error.details.map(err => err.message).join(", "));
    }

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
    const { error } = updateWalletSchema.validate(data);
    if (error) {
      throw new ErrorHandler(error.details[0].message, 400);
    }
    
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
}

module.exports = WalletService;
