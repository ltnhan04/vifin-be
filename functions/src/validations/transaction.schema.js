const Joi = require("joi");

const createTransactionSchema = Joi.object({
  amount: Joi.number().min(0).required().messages({
    "number.base": "Expected number, received string",
    "number.min": "Amount must be a positive number",
    "any.required": "amount is required",
  }),
  category_id: Joi.string().required(),
  wallet_id: Joi.string().required(),
  transaction_type: Joi.string()
    .valid("expense", "income")
    .insensitive()
    .required(),
  note: Joi.string().optional().allow(null, ""),
  createdAt: Joi.string().optional(),
});

const updateTransactionSchema = Joi.object({
  amount: Joi.number().min(0),
  category_id: Joi.string(),
  wallet_id: Joi.string(),
  transaction_type: Joi.string().valid("expense", "income").insensitive(),
  note: Joi.string().optional().allow(null, ""),
}).min(1);

module.exports = { createTransactionSchema, updateTransactionSchema };
