const { db } = require("../configs/firebase.config");
class CustomerService {
  static createNewCustomer = async ({
    avatar,
    full_name,
    gender,
    email,
    uid,
  }) => {
    const customerData = {
      avatar: avatar || null,
      full_name: full_name,
      gender: gender || "male",
      email: email,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await db.collection("customers").doc(uid).set(customerData);
    return { ...customerData, _id: uid };
  };
  static getCustomer = async (uid) => {
    const docSnap = await db.collection("customers").doc(uid).get();
    return { ...docSnap.data(), _id: uid };
  };
}

module.exports = CustomerService;
