const { initializeApp, cert } = require("firebase-admin/app");
const admin = require("firebase-admin");
const { getFirestore } = require("firebase-admin/firestore");
const path = require("path");
const dotenv = require("dotenv");
const fs = require("fs");

dotenv.config();
const serviceAccountPath = path.resolve(
  __dirname,
  "vifin-app-firebase-adminsdk-z76vc-570916c2d7.json"
);
if (!fs.existsSync(serviceAccountPath)) {
  throw new Error(
    `Firebase service account key not found at: ${serviceAccountPath}`
  );
}
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf-8"));
initializeApp({
  credential: cert(serviceAccount),
  databaseURL: process.env.DB_URL,
});
const db = getFirestore();
module.exports = { db, admin };
