const { db } = require("../configs/firebase.config");
const ErrorHandler = require("../middlewares/error.handler");
const { createImageUrl, deleteImageFromStorage } = require("../utils/upload");

class WalletService {
  static getWallets = async () => {
    const walletData = [];
    const querySnap = await db.collection("wallets").get();
    querySnap.forEach((docSnap) =>
      walletData.push({ ...docSnap.data(), _id: docSnap.id })
    );
    return walletData;
  };

  static getBudgetInWallet = async (walletId) => {
    const budgetDocs = await db
      .collection("budgets")
      .where("wallet_id", "==", walletId)
      .get();

    const budgets = Promise.all(
      budgetDocs.docs.map(async (doc) => {
        const budgetData = { ...doc.data(), _id: doc.id };
        const category = await CategoryService.getCategory(
          budgetData.category_id
        );
        return { ...budgetData, category };
      })
    );
    return budgets;
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
    const walletDoc = await walletRef.get();

    if (!walletDoc.exists) {
      throw new ErrorHandler("Wallet not found", 404);
    }

    const walletData = walletDoc.data();

    let imageUrl = walletData.symbol;
    if (data.symbol) {
      imageUrl = await createImageUrl(data.symbol);

      if (walletData.symbol) {
        await deleteImageFromStorage(walletData.symbol);
      }
    }

    const updateData = {
      ...data,
      symbol: imageUrl,
      updatedAt: new Date(),
    };

    await walletRef.update(updateData);
    return { ...updateData, _id: id };
  };

  static deleteWallet = async (id) => {
    const walletRef = db.collection("wallets").doc(id);
    const walletDoc = await walletRef.get();

    if (!walletDoc.exists) {
      throw new ErrorHandler("Wallet not found", 404);
    }

    const walletData = walletDoc.data();

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

    return;
  };
}

module.exports = WalletService;
