const router = require("express").Router();
const { authenticateToken } = require("../middlewares/auth.middleware");
const {
  createWallet,
  updateWallet,
  deleteWallet,
  getWallets,
  getWallet,
  statisticByWeek,
  statisticByMonth,
  statisticByYear,
} = require("../controllers/wallet.controller");
const { uploadImage } = require("../utils/upload");
const {
  validateCreateWallet,
  validateUpdateWallet,
} = require("../middlewares/validations/validate.wallet");

router.get("/weekly", authenticateToken, statisticByWeek);
router.get("/monthly", authenticateToken, statisticByMonth);
router.get("/yearly", authenticateToken, statisticByYear);

router.get("/", authenticateToken, getWallets);
router.get("/:id", authenticateToken, getWallet);

router.post(
  "/",
  authenticateToken,
  validateCreateWallet,
  uploadImage,
  createWallet
);
router.put(
  "/:id",
  authenticateToken,
  validateUpdateWallet,
  uploadImage,
  updateWallet
);
router.delete("/:id", authenticateToken, deleteWallet);

module.exports = router;
