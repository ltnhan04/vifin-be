const AuthService = require("../services/auth.service");
const ResponseHandler = require("../utils/response.handler");
const signUp = async (req, res, next) => {
  try {
    const customerId = req.customer.user_id;
    const newCustomer = await AuthService.createNewCustomer({
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
const signIn = async (req, res, next) => {
  try {
    const customerId = req.customer.user_id;
    const getCustomerInfo = await AuthService.getCustomer(customerId);
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

module.exports = { signUp, signIn };
