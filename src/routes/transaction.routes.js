const router = require("express").Router();
const { authenticateToken } = require("../middlewares/auth.middleware");
const {
  createTransaction,
  getTransaction,
  getTransactions,
  updateTransactions,
  deleteTransactions,
} = require("../controllers/transaction.controller");

router.post("/", authenticateToken, createTransaction);
router.get("/", authenticateToken, getTransactions);
router.get("/:id", authenticateToken, getTransaction);
router.put("/:id", authenticateToken, updateTransactions);
router.delete("/:id", authenticateToken, deleteTransactions);

module.exports = router;
