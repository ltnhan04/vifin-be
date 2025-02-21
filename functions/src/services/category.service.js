const { db } = require("../configs/firebase.config");
const { createImageUrl, deleteImageFromStorage } = require("../utils/upload");

class CategoryService {
  static getCategories = async (customerId) => {
    const categoryData = [];
    const querySnap = await db
      .collection("categories")
      .where("createdBy", "in", ["system", customerId])
      .get();
    for (const docSnap of querySnap.docs) {
      const category = { ...docSnap.data(), _id: docSnap.id };
      let children = [];
      if (!category.parent_id) {
        const childrenSnap = await db
          .collection("categories")
          .where("parent_id", "==", category._id)
          .get();
        childrenSnap.forEach((snap) =>
          children.push({ ...snap.data(), _id: snap.id })
        );
      }
      categoryData.push({ ...category, children });
    }
    return categoryData;
  };

  static getCategory = async (categoryId) => {
    const categorySnap = await db
      .collection("categories")
      .doc(categoryId)
      .get();
    if (categorySnap.exists) {
      return { ...categorySnap.data(), _id: categorySnap.id };
    }
    return null;
  };

  static addCategory = async ({
    name,
    symbol,
    parent_id,
    createdBy,
    transaction_type,
  }) => {
    const categoryRef = db.collection("categories").doc();
    const imageUrl = await createImageUrl(symbol);
    const categoryData = {
      name,
      symbol: imageUrl,
      parent_id: parent_id || null,
      createdBy: createdBy || "system",
      transaction_type: transaction_type || "expense",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.collection("categories").doc(categoryRef.id).set(categoryData);

    return { ...categoryData, _id: categoryRef.id };
  };

  static updatedCategory = async (id, data) => {
    const categoryRef = db.collection("categories").doc(id);
    const categorySnap = await categoryRef.get();
    if (!categorySnap.exists) {
      throw new Error("Category not found");
    }

    const updateData = { ...data, updatedAt: new Date() };

    if (data.symbol) {
      const oldData = categorySnap.data();
      if (oldData.symbol) {
        try {
          await deleteImageFromStorage(oldData.symbol);
        } catch (error) {
          console.error("Error deleting old image: ", error);
        }
      }
      const newImageUrl = await createImageUrl(data.symbol);
      updateData.symbol = newImageUrl;
    }

    await categoryRef.update(updateData);
    return { ...updateData, _id: id };
  };

  static deletedCategory = async (id) => {
    const categoryRef = db.collection("categories").doc(id);
    const categorySnap = await categoryRef.get();
    if (!categorySnap.exists) {
      throw new Error("Category not found");
    }

    const categoryData = categorySnap.data();
    if (categoryData.symbol) {
      try {
        await deleteImageFromStorage(categoryData.symbol);
      } catch (error) {
        console.error("Error deleting category image: ", error);
      }
    }

    await categoryRef.delete();

    const budgetSnap = await db
      .collection("budgets")
      .where("category_id", "==", id)
      .get();
    await Promise.all(
      budgetSnap.docs.map((docSnap) =>
        db.collection("budgets").doc(docSnap.id).delete()
      )
    );

    const transactionSnap = await db
      .collection("transactions")
      .where("category_id", "==", id)
      .get();
    await Promise.all(
      transactionSnap.docs.map((docSnap) =>
        db.collection("transactions").doc(docSnap.id).delete()
      )
    );
    return;
  };
}

module.exports = CategoryService;
