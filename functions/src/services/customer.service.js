const { db } = require("../configs/firebase.config");
const { createCustomerSchema } = require("../validations/customer.schema");
const ErrorHandler = require("../middlewares/error.handler");
const { createImageUrl, deleteImageFromStorage } = require("../utils/upload");

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
    const { error, value } = createCustomerSchema.validate(
      { avatar, full_name, gender, email, provider },
      { abortEarly: false }
    );

    if (error) {
      throw new Error(error.details.map((err) => err.message).join(", "));
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
    if (!docSnap.exists) {
      throw new ErrorHandler("Customer not found", 404);
    }
    return { ...docSnap.data(), _id: uid };
  };

  static updateCustomerInfo = async (id, data) => {
    const customerInfo = await this.getCustomer(id);
    if (data.avatar && customerInfo.avatar) {
      await deleteImageFromStorage(customerInfo.avatar);
    }
    const updateCustomer = {};
    if (data.avatar) updateCustomer.avatar = await createImageUrl(data.avatar);
    if (data.full_name) updateCustomer.full_name = data.full_name;
    if (data.gender) updateCustomer.gender = data.gender;
    if (Object.keys(updateCustomer).length === 0) {
      throw new ErrorHandler("No valid data to update", 400);
    }
    await db.collection("customers").doc(id).update(updateCustomer);
    const updatedCustomer = await this.getCustomer(id);
    return { ...updatedCustomer, _id: id };
  };

  static updatePushToken = async (uid, pushToken) => {
    const customerRef = db.collection("customers").doc(uid);
    await customerRef.update({
      push_token: pushToken,
      updatedAt: new Date(),
    });
    return { ...(await this.getCustomer(uid)), _id: uid };
  };
}

module.exports = CustomerService;
