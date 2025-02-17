const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

require("./src/configs/firebase.config");
const customerRoutes = require("./src/routes/customer.routes");
const walletRoutes = require("./src/routes/wallet.routes");
const categoriesRoutes = require("./src/routes/category.routes");
const budgetRoutes = require("./src/routes/budget.routes");
const transactionRoutes = require("./src/routes/transaction.routes");

dotenv.config();
const app = express();

const PORT = process.env.APP_PORT || 3000;
app.use(express.json({ limit: "10mb" }));
app.use(cors());

app.use("/api/v1/customer", customerRoutes);
app.use("/api/v1/wallet", walletRoutes);
app.use("/api/v1/category", categoriesRoutes);
app.use("/api/v1/budget", budgetRoutes);
app.use("/api/v1/transactions/", transactionRoutes);

app.get("/", (_, res) => {
  res.send("Hello World!");
});
app.use((error, _req, res, _next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal Server Error";
  res.status(statusCode).json({ message });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

module.exports = app;
