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
    const customerId = req.customer.user_id;
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

module.exports = { createCustomer, getCustomers };
