const { db } = require("../configs/firebase.config");

class CategoryService {
  static getCategories = async () => {
    const categoryData = [];
    const querySnap = await db.collection("categories").get();
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

  static addCategory = async ({
    name,
    symbol,
    parent_id,
    transaction_type,
  }) => {
    const categoryRef = db.collection("categories").doc();
    const categoryData = {
      name: name,
      symbol: symbol,
      parent_id: parent_id || null,
      transaction_type: transaction_type || "expense",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.collection("categories").doc(categoryRef.id).set(categoryData);

    return { ...categoryData, _id: categoryRef.id };
  };
  static updatedCategory = async (id, data) => {
    const updateData = {
      ...data,
      updatedAt: new Date(),
    };
    await db.collection("categories").doc(id).update(updateData);
    return { ...updateData, _id: id };
  };
  static deletedCategory = async (id) => {
    return await db.collection("categories").doc(id).delete();
  };
}
module.exports = CategoryService;
