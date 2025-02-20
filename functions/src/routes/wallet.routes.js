const router = require("express").Router();
const { authenticateToken } = require("../middlewares/auth.middleware");
const {
  createWallet,
  updateWallet,
  deleteWallet,
  getWallets,
  getWallet,
} = require("../controllers/wallet.controller");

router.get("/", authenticateToken, getWallets);
router.get("/:id", authenticateToken, getWallet);
router.post("/", authenticateToken, createWallet);
router.put("/:id", authenticateToken, updateWallet);
router.delete("/:id", authenticateToken, deleteWallet);

module.exports = router;
