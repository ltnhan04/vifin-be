const BudgetService = require("../services/budget.service");
const ResponseHandler = require("../utils/response.handler");
const ErrorHandler = require("../middlewares/error.handler");

const createNewBudget = async (req, res, next) => {
  try {
    const newBudget = await BudgetService.createBudget(req.body);
    return ResponseHandler.sendSuccess(
      res,
      newBudget,
      201,
      "Created Budget Successfully"
    );
  } catch (error) {
    next(error);
  }
};

const updateBudget = async (req, res, next) => {
  try {
    const budgetId = req.params.id;
    let budget = await BudgetService.getBudgetById(budgetId);
    if (!budget) {
      throw new ErrorHandler("Budget Not Found", 404);
    }
    await BudgetService.updateBudget(budgetId, req.body);
    budget = await BudgetService.getBudgetById(budgetId);
    await BudgetService.checkBudgetCompletion(budget);
    if (budget.is_repeated) {
      await BudgetService.handleRepeatBudget(budget);
    }
    return ResponseHandler.sendSuccess(
      res,
      budget,
      200,
      "Updated Budget Successfully"
    );
  } catch (error) {
    next(error);
  }
};

const deletedBudget = async (req, res, next) => {
  try {
    const budgetId = req.params.id;
    await BudgetService.deleteBudget(budgetId);
    return ResponseHandler.sendSuccess(
      res,
      "",
      200,
      "Deleted Budget Successfully"
    );
  } catch (error) {
    next(error);
  }
};

const getBudgets = async (_req, res, next) => {
  try {
    const budgets = await BudgetService.getBudgets();
    return ResponseHandler.sendSuccess(
      res,
      budgets,
      200,
      "Get All Budgets Successfully"
    );
  } catch (error) {
    next(error);
  }
};

const getBudget = async (req, res, next) => {
  try {
    const budgetId = req.params.id;
    const budget = await BudgetService.getBudgetById(budgetId);
    if (budget === -1) {
      throw new ErrorHandler("Budget Not Found", 404);
    }
    return ResponseHandler.sendSuccess(
      res,
      budget,
      200,
      "Get Budget Successfully"
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createNewBudget,
  updateBudget,
  getBudget,
  getBudgets,
  deletedBudget,
};
