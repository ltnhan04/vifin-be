const router = require("express").Router();
const { authenticateToken } = require("../middlewares/auth.middleware");
const {
  createTransaction,
  getTransaction,
  getTransactions,
  updateTransactions,
  deleteTransactions,
  filterTransactions,
} = require("../controllers/transaction.controller");

router.post("/", authenticateToken, createTransaction);
router.get("/filter", authenticateToken, filterTransactions);
router.get("/", authenticateToken, getTransactions);
router.get("/:id", authenticateToken, getTransaction);
router.put("/:id", authenticateToken, updateTransactions);
router.delete("/:id", authenticateToken, deleteTransactions);

module.exports = router;
