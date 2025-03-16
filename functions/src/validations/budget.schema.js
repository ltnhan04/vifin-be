const Joi = require("joi");

const today = new Date();
today.setHours(0, 0, 0, 0);

const createBudgetSchema = Joi.object({
  category_id: Joi.string().min(1).required().messages({
    "string.empty": "Category is required",
  }),
  wallet_id: Joi.string().min(1).required().messages({
    "string.empty": "Wallet is required",
  }),
  startDate: Joi.date().required(),
  dueDate: Joi.date().required(),
  amount: Joi.number().min(0).required().messages({
    "number.min": "Amount must be at least 0",
  }),
  repeat_type: Joi.string()
    .valid("monthly", "weekly", "yearly", "custom")
    .required(),
  is_repeated: Joi.boolean().default(true),
  is_completed: Joi.boolean().default(false),
}).custom((data, helpers) => {
  if (data.repeat_type === "custom") {
    if (data.startDate < today) {
      return helpers.error("any.custom", {
        message:
          "Start date must be today or in the future for custom repeat type",
        path: ["startDate"],
      });
    }
    if (data.startDate > data.dueDate) {
      return helpers.error("any.custom", {
        message: "Start date must be before or equal to due date",
        path: ["dueDate"],
      });
    }
  }
  return data;
});

const updateBudgetSchema = Joi.object({
  category_id: Joi.string().min(1).messages({
    "string.empty": "Category is required",
  }),
  wallet_id: Joi.string().min(1).messages({
    "string.empty": "Wallet is required",
  }),
  startDate: Joi.date(),
  dueDate: Joi.date(),
  usage: Joi.number().min(0),
  amount: Joi.number().min(0).messages({
    "number.min": "Amount must be at least 0",
  }),
  repeat_type: Joi.string().valid("monthly", "weekly", "yearly", "custom"),
  is_repeated: Joi.boolean(),
  is_completed: Joi.boolean(),
})
  .min(1)
  .custom((data, helpers) => {
    if (data.startDate && data.dueDate && data.startDate > data.dueDate) {
      return helpers.error("any.custom", {
        message: "Start date must be before or equal to due date",
        path: ["dueDate"],
      });
    }
    return data;
  });

module.exports = { createBudgetSchema, updateBudgetSchema };
