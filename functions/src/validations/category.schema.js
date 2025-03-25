const Joi = require("joi");

const createCategorySchema = Joi.object({
  transaction_type: Joi.string()
    .valid("expense", "income")
    .insensitive()
    .required(),
  parent_id: Joi.string().allow(null),
  createdBy: Joi.string().optional().default("system"),
  name: Joi.string()
  .min(3)
  .message("name must be at least 3 characters long")
  .max(50)
  .message("name must be at most 50 characters")
  .trim()
  .required(),
  symbol: Joi.string().allow(null, "").optional(),
}).unknown(true);

const updateCategorySchema = Joi.object({
  transaction_type: Joi.string().valid("expense", "income").insensitive(),
  parent_id: Joi.string().allow(null),
  createdBy: Joi.forbidden(),
  name: Joi.string().min(3).max(50).trim(),
})
  .min(1)
  .unknown(true);

module.exports = { createCategorySchema, updateCategorySchema };
