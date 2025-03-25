const { db } = require("../configs/firebase.config");
const { createCustomerSchema } = require("../validations/customer.schema")
class CustomerService {
  static createNewCustomer = async ({
    avatar,
    full_name,
    gender,
    email,
    uid,
    provider,
    role = "customer",
  }) => {
    // Validate dữ liệu đầu vào
    const { error, value } = createCustomerSchema.validate(
      { avatar, full_name, gender, email, provider },
      { abortEarly: false }
    );

    if (error) {
      throw new Error(error.details.map(err => err.message).join(", "));
    }
    const customerData = {
      avatar: avatar || null,
      full_name: full_name,
      gender: gender || "male",
      email: email,
      role: role,
      provider: provider,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await db
      .collection("customers")
      .doc(uid)
      .set(customerData, { merge: true });
    return { ...customerData, _id: uid };
  };
  static getCustomer = async (uid) => {
    const docSnap = await db.collection("customers").doc(uid).get();
    return { ...docSnap.data(), _id: uid };
  };
}

module.exports = CustomerService;
