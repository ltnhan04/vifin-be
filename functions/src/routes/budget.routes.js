const router = require("express").Router();
const { authenticateToken } = require("../middlewares/auth.middleware");
const {
  createNewBudget,
  updateBudget,
  deletedBudget,
  getBudget,
  getBudgets,
  getBudgetByRepeatType,
} = require("../controllers/budget.controller");
const {
  validateCreateBudget,
  validateUpdateBudget,
} = require("../middlewares/validations/validate.budget");

router.get("/", authenticateToken, getBudgets);
router.get("/filter", authenticateToken, getBudgetByRepeatType);
router.get("/:id", authenticateToken, getBudget);
router.post("/", authenticateToken, validateCreateBudget, createNewBudget);
router.put("/:id", authenticateToken, validateUpdateBudget, updateBudget);
router.delete("/:id", authenticateToken, deletedBudget);
module.exports = router;
