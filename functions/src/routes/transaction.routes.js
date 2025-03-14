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

router.get("/", authenticateToken, recentTransactions);
router.get("/filter", authenticateToken, filterTransactions);
router.get("/weekly", authenticateToken, weeklyTransaction);
router.get("/monthly", authenticateToken, monthlyTransaction);
router.get("/yearly", authenticateToken, yearlyTransaction);
router.get("/:id", authenticateToken, getTransaction);
router.post("/", authenticateToken, createTransaction);
router.put("/:id", authenticateToken, updateTransactions);
router.delete("/:id", authenticateToken, deleteTransactions);

module.exports = router;
