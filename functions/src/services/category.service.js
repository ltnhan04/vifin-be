const { db } = require("../configs/firebase.config");
const ErrorHandler = require("../middlewares/error.handler");
const { createImageUrl, deleteImageFromStorage } = require("../utils/upload");
const { createCategorySchema } = require("../validations/category.schema")

class CategoryService {
  static getCategories = async (customerId) => {
    const categoryData = [];
    const categoriesMap = new Map();

    const querySnap = await db
      .collection("categories")
      .where("createdBy", "in", ["system", customerId])
      .get();

    querySnap.docs.forEach((docSnap) => {
      const category = { ...docSnap.data(), _id: docSnap.id, children: [] };
      categoriesMap.set(category._id, category);
    });

    categoriesMap.forEach((category) => {
      if (category.parent_id) {
        const parentCategory = categoriesMap.get(category.parent_id);
        if (parentCategory) {
          parentCategory.children.push(category);
        }
      } else {
        categoryData.push(category);
      }
    });

    return categoryData;
  };

  static getCategory = async (categoryId) => {
    const categoryDoc = await db.collection("categories").doc(categoryId).get();
    if (!categoryDoc.exists) {
      throw new ErrorHandler("Category not found", 404);
    }
    return categoryDoc.data();
  };

  static filterCategoryName(data) {
    const getNames = (category) => {
      return [category.name, ...(category.children || []).flatMap(getNames)];
    };
    return data.flatMap(getNames);
  }

  static addCategory = async ({
    name,
    symbol,
    parent_id,
    createdBy,
    transaction_type,
  }) => {
    // Validate dữ liệu đầu vào
    const { error, value } = createCategorySchema.validate(
      { name, symbol, parent_id, createdBy, transaction_type },
      { abortEarly: false }
    );

    if (error) {
      throw new Error(error.details.map(err => err.message).join(", "));
    }
    const categoryRef = db.collection("categories").doc();
    // Xử lý symbol khi bị undefined hoặc null
    let imageUrl = null;
    if (symbol) {
      imageUrl = await createImageUrl(symbol);
    }
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
    const categoryData = await this.getCategory(id);
    let imageUrl = categoryData.symbol;
    if (data.symbol) {
      imageUrl = await createImageUrl(data.symbol);
      if (categoryData.symbol) {
        await deleteImageFromStorage(categoryData.symbol);
      }
    }
    const { name, transaction_type, createdBy, parent_id } = data;
    const updateData = {
      ...(name && { name }),
      ...(transaction_type && { transaction_type }),
      ...(createdBy && { createdBy }),
      ...(parent_id && { parent_id }),
      symbol: imageUrl,
      updatedAt: new Date(),
    };

    await categoryRef.update(updateData);
    const updated = await this.getCategory(id);
    return { ...updated, _id: id };
  };

  static deletedCategory = async (id) => {
    const categoryRef = db.collection("categories").doc(id);
    const categorySnap = await categoryRef.get();
    if (!categorySnap.exists) {
      throw new ErrorHandler("Category not found", 404);
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
    return { ...categoryData, _id: id };
  };
}

module.exports = CategoryService;
