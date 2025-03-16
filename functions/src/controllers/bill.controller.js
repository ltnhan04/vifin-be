const BillService = require("../services/bill.service");
const ResponseHandler = require("../utils/response.handler");

const expenseClassification = async (req, res, next) => {
  try {
    const { text } = req.body;
    const categorizedExpense = await BillService.InvoiceDataExtraction({
      text,
      customerId: req.customer.user_id,
    });
    return ResponseHandler.sendSuccess(
      res,
      categorizedExpense,
      200,
      "Invoice processed successfully"
    );
  } catch (error) {
    next(error);
  }
};

module.exports = { expenseClassification };
