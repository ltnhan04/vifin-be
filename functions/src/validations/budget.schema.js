const Joi = require("joi");

const today = new Date();
today.setHours(0, 0, 0, 0);

const createBudgetSchema = Joi.object({
  category_id: Joi.string().min(1).required().messages({
    "string.empty": "Category is required",
    "any.required": "Category is required",
  }),
  wallet_id: Joi.string().min(1).required().messages({
    "string.empty": "Wallet is required",
    "any.required": "Wallet is required",
  }),
  startDate: Joi.date().required(),
  dueDate: Joi.date().required(),
  amount: Joi.number().min(0).required().messages({
    "number.min": "Amount must be at least 0",
    "number.base": "Amount must be a number",
    "number.max": "Amount must be a safe number",
    "any.required": "amount is required"
  }),
  repeat_type: Joi.string()
    .valid("monthly", "weekly", "yearly", "custom")
    .required(),
  is_repeated: Joi.boolean().default(true),
  is_completed: Joi.boolean().default(false),
}).custom((data, helpers) => {
  const startDate = new Date(data.startDate);
  const dueDate = new Date(data.dueDate);

  if (isNaN(startDate) || isNaN(dueDate)) {
    return helpers.error("any.custom", { message: "Invalid date format" });
  }

  if (startDate > dueDate) {
    return helpers.message("Start date must be before or equal to due date");
  }

  return data;
});

const updateBudgetSchema = Joi.object({
  category_id: Joi.string().min(1).messages({
    "string.empty": "Category is required",
    "any.required": "Category is required",
  }),
  wallet_id: Joi.string().min(1).messages({
    "string.empty": "Wallet is required",
    "any.required": "Wallet is required",
  }),
  startDate: Joi.date(),
  dueDate: Joi.date(),
  usage: Joi.number().min(0),
  amount: Joi.number().min(0).messages({
    "number.min": "Amount must be at least 0",
    "number.base": "Amount must be a number",
    "number.max": "Amount must be a safe number",
    "any.required": "amount is required"
  }),
  repeat_type: Joi.string().valid("monthly", "weekly", "yearly", "custom"),
  is_repeated: Joi.boolean(),
  is_completed: Joi.boolean(),
})
  .min(1)
  .custom((data, helpers) => {
    const startDate = new Date(data.startDate);
    const dueDate = new Date(data.dueDate);

    if (isNaN(startDate) || isNaN(dueDate)) {
      return helpers.error("any.custom", { message: "Invalid date format" });
    }

    if (startDate > dueDate) {
      return helpers.message("Start date must be before or equal to due date");
    }

    return data;
  });

module.exports = { createBudgetSchema, updateBudgetSchema };
