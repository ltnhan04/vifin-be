const { admin } = require("../configs/firebase.config");
const ErrorHandler = require("./error.handler");

const authenticateToken = async (req, _res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ErrorHandler("Invalid Token!", 401);
    }
    const idToken = authHeader.split("Bearer ")[1];
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.customer = decodedToken;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { authenticateToken };
