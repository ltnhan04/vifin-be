const CategoryService = require("../services/category.service");
const ResponseHandler = require("../utils/response.handler");

const getCategories = async (req, res, next) => {
  try {
    const customerId = req.customer.user_id;
    const categories = await CategoryService.getCategories(customerId);
    return ResponseHandler.sendSuccess(
      res,
      categories,
      200,
      "Get Categories Successfully"
    );
  } catch (error) {
    next(error);
  }
};

const addCategory = async (req, res, next) => {
  try {
    const newCategory = await CategoryService.addCategory(req.body);
    return ResponseHandler.sendSuccess(
      res,
      newCategory,
      201,
      "Created Category Successfully"
    );
  } catch (error) {
    next(error);
  }
};

const updatedCategory = async (req, res, next) => {
  try {
    const categoryId = req.params.id;
    const category = await CategoryService.updatedCategory(
      categoryId,
      req.body
    );
    return ResponseHandler.sendSuccess(
      res,
      category,
      200,
      "Updated Category Successfully"
    );
  } catch (error) {
    next(error);
  }
};

const deletedCategory = async (req, res, next) => {
  try {
    const categoryId = req.params.id;
    await CategoryService.deletedCategory(categoryId);
    return ResponseHandler.sendSuccess(
      res,
      "",
      200,
      "Deleted Created Successfully"
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addCategory,
  updatedCategory,
  deletedCategory,
  getCategories,
};
