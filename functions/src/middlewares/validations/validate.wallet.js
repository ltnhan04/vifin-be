const {
  createWalletSchema,
  updateWalletSchema,
} = require("../../validations/wallet.schema");

const validateCreateWallet = (req, res, next) => {
  const { error } = createWalletSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    return res
      .status(400)
      .json({ message: error.details.map((d) => d.message) });
  }

  next();
};

const validateUpdateWallet = (req, res, next) => {
  const { error } = updateWalletSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    return res
      .status(400)
      .json({ message: error.details.map((d) => d.message) });
  }

  next();
};

module.exports = { validateCreateWallet, validateUpdateWallet };
