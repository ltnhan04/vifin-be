const CustomerService = require("../services/customer.service");
const ResponseHandler = require("../utils/response.handler");
const createCustomer = async (req, res, next) => {
  try {
    const customerId = req.customer.user_id;
    const newCustomer = await CustomerService.createNewCustomer({
      ...req.body,
      uid: customerId,
    });

    return ResponseHandler.sendSuccess(
      res,
      newCustomer,
      201,
      "Created customer successfully!"
    );
  } catch (error) {
    next(error);
  }
};
const getCustomers = async (req, res, next) => {
  try {
    const customerId = req.params.id;
    const getCustomerInfo = await CustomerService.getCustomer(customerId);
    return ResponseHandler.sendSuccess(
      res,
      getCustomerInfo,
      200,
      "Get customer profile successfully"
    );
  } catch (error) {
    next(error);
  }
};
const updateCustomer = async (req, res, next) => {
  try {
    const updatedCustomer = await CustomerService.updateCustomerInfo(
      req.params.id,
      { ...req.body, avatar: req.files[0] }
    );
    return ResponseHandler.sendSuccess(
      res,
      updatedCustomer,
      200,
      "Updated customer info successfully"
    );
  } catch (error) {
    next(error);
  }
};
const updatePushToken = async (req, res, next) => {
  try {
    const uid = req.customer.user_id;
    const pushToken = req.body;
    const updatedCustomer = await CustomerService.updatePushToken(
      uid,
      pushToken
    );
    return ResponseHandler.sendSuccess(
      res,
      updatedCustomer,
      200,
      "Updated push token successfully"
    );
  } catch (error) {
    next(error);
  }
};
module.exports = {
  createCustomer,
  getCustomers,
  updateCustomer,
  updatePushToken,
};
