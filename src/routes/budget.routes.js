const router = require("express").Router();
const { authenticateToken } = require("../middlewares/auth.middleware");
const {
  createNewBudget,
  updateBudget,
  deletedBudget,
  getBudget,
  getBudgets,
} = require("../controllers/budget.controller");

router.post("/", authenticateToken, createNewBudget);
router.put("/:id", authenticateToken, updateBudget);
router.delete("/:id", authenticateToken, deletedBudget);
router.get("/", authenticateToken, getBudgets);
router.get("/:id", authenticateToken, getBudget);
module.exports = router;
