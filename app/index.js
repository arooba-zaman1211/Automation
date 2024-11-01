const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const productRoutes = require("../routes/Products_Routes");
const connectDB = require("../config/dbConnection.js");
const { watchPostCollection } = require("../helper/changeStreamHandler.js");
const cronHelper = require("../helper/cronHelper.js");

app.use(express.json());

const RETRY_INTERVAL = 10000;

async function connectWithRetry() {
  while (true) {
    try {
      await connectDB();
      console.log("Connected to MongoDB");
      break;
    } catch (error) {
      console.error(
        "Failed to connect to MongoDB. Retrying in 10 seconds...",
        error
      );
      await new Promise((resolve) => setTimeout(resolve, RETRY_INTERVAL));
    }
  }
}

async function tokenCheckWithRetry() {
  while (true) {
    try {
      await cronHelper.checkTokenAndRefresh();
      console.log("Token check and refresh completed successfully");
      break;
    } catch (error) {
      console.error("Token check failed. Retrying in 10 seconds...", error);
      await new Promise((resolve) => setTimeout(resolve, RETRY_INTERVAL));
    }
  }
}

async function initializeApp() {
  await connectWithRetry();
  watchPostCollection();
  await tokenCheckWithRetry();
}

app.use("/api/product", productRoutes);

const PORT = process.env.PORT || 3000;
initializeApp().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
