const admin = require("firebase-admin");
const dotenv = require("dotenv");
const fs = require("fs");

dotenv.config();
const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH;
if (!serviceAccountPath || !fs.existsSync(serviceAccountPath)) {
  throw new Error("Firebase service account key is missing!");
}
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf-8"));
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});
const db = admin.firestore();
module.exports = { db };
