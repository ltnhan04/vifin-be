const {
  createBudgetSchema,
  updateBudgetSchema,
} = require("../../validations/budget.schema");

const validateCreateBudget = (req, res, next) => {
  const { error } = createBudgetSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const errors = {};
    error.details.forEach((err) => {
      const field = err.path.join(".");
      if (!errors[field]) {
        errors[field] = [];
      }
      errors[field].push(err.message);
    });

    return res.status(400).json({ errors });
  }
  next();
};

const validateUpdateBudget = (req, res, next) => {
  const { error } = updateBudgetSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    return res
      .status(400)
      .json({ message: error.details.map((d) => d.message) });
  }

  next();
};

module.exports = { validateCreateBudget, validateUpdateBudget };
