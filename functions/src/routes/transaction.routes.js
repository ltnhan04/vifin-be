const router = require("express").Router();
const { authenticateToken } = require("../middlewares/auth.middleware");
const {
  createTransaction,
  getTransaction,
  updateTransactions,
  deleteTransactions,
  filterTransactions,
  recentTransactions,
  weeklyTransaction,
  monthlyTransaction,
  yearlyTransaction,
} = require("../controllers/transaction.controller");
const {
  validateCreateTransaction,
  validateUpdateTransaction,
} = require("../middlewares/validations/validate.transaction");

router.get("/", authenticateToken, recentTransactions);
router.get("/filter", authenticateToken, filterTransactions);
router.get("/weekly", authenticateToken, weeklyTransaction);
router.get("/monthly", authenticateToken, monthlyTransaction);
router.get("/yearly", authenticateToken, yearlyTransaction);
router.get("/:id", authenticateToken, getTransaction);
router.post(
  "/",
  authenticateToken,
  validateCreateTransaction,
  createTransaction
);
router.put(
  "/:id",
  authenticateToken,
  validateUpdateTransaction,
  updateTransactions
);
router.delete("/:id", authenticateToken, deleteTransactions);

module.exports = router;
