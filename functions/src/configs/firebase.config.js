const { initializeApp, cert } = require("firebase-admin/app");
const admin = require("firebase-admin");
const { getFirestore, Timestamp } = require("firebase-admin/firestore");
const { getStorage } = require("firebase-admin/storage");
const path = require("path");
const dotenv = require("dotenv");
const fs = require("fs");

dotenv.config();
const serviceAccountPath = path.resolve(
  __dirname,
  "vifin-app-firebase-adminsdk-z76vc-4bb289a55d.json"
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
  storageBucket: "vifin-app.firebasestorage.app",
});
const db = getFirestore();
const bucket = getStorage().bucket();
module.exports = { db, admin, bucket, Timestamp };
