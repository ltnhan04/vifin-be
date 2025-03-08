const router = require("express").Router();
const { authenticateToken } = require("../middlewares/auth.middleware");
const {
  createWallet,
  updateWallet,
  deleteWallet,
  getWallets,
  getBudget,
} = require("../controllers/wallet.controller");
const { uploadImage } = require("../utils/upload");


router.get("/", authenticateToken, getWallets);
router.get("/:id", authenticateToken, getBudget);
router.post("/", authenticateToken, uploadImage, createWallet);
router.put("/:id", authenticateToken, uploadImage, updateWallet);
router.delete("/:id", authenticateToken, deleteWallet);

module.exports = router;
