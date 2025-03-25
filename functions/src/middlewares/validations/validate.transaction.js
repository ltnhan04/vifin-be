const {
  createTransactionSchema,
  updateTransactionSchema,
} = require("../../validations/transaction.schema");

const validateCreateTransaction = (req, res, next) => {
  const { error } = createTransactionSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    return res
      .status(400)
      .json({ message: error.details.map((d) => d.message) });
  }

  next();
};

const validateUpdateTransaction = (req, res, next) => {
  const { error } = updateTransactionSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    return res
      .status(400)
      .json({ message: error.details.map((d) => d.message) });
  }

  next();
};

module.exports = { validateCreateTransaction, validateUpdateTransaction };
