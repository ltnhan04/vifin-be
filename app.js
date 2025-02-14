const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

require("./src/configs/firebase.config");
const authRoutes = require("./src/routes/auth.routes");
const walletRoutes = require("./src/routes/wallet.routes");
const categoriesRouter = require("./src/routes/category.routes");

dotenv.config();
const app = express();

const PORT = process.env.PORT || 3000;
app.use(express.json({ limit: "10mb" }));
app.use(cors());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/wallet", walletRoutes);
app.use("/api/v1/category", categoriesRouter);

app.get("/", (_, res) => {
  res.send("Hello World!");
});
app.use((error, _req, res, _next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal Server Error";
  res.status(statusCode).json({ message });
});

app.listen(PORT, () =>
  console.log(`Server is running on http://localhost:${PORT}`)
);
