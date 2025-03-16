const Joi = require("joi");

const createCategorySchema = Joi.object({
  transaction_type: Joi.string()
    .valid("expense", "income")
    .insensitive()
    .required(),
  parent_id: Joi.string().allow(null),
  createdBy: Joi.string().optional().default("system"),
  name: Joi.string().min(3).max(50).trim().required(),
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
