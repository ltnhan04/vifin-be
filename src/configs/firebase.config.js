const { initializeApp, cert } = require("firebase-admin/app");
const admin = require("firebase-admin");
const { getFirestore } = require("firebase-admin/firestore");

const dotenv = require("dotenv");
const fs = require("fs");

dotenv.config();
const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH;
if (!serviceAccountPath || !fs.existsSync(serviceAccountPath)) {
  throw new Error("Firebase service account key is missing!");
}
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf-8"));
initializeApp({
  credential: cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});
const db = getFirestore();
module.exports = { db, admin };
