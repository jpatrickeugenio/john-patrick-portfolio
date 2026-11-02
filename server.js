
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Serve your portfolio files from the parent folder.
app.use(express.static(path.join(__dirname, "..")));

const Contact = mongoose.model(
  "Contact",
  new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  })
);

app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof message !== "string" ||
      !name.trim() ||
      !email.trim() ||
      !message.trim()
    ) {
      return res.status(400).json({
        message: "Please complete all fields."
      });
    }

    await Contact.create({
      name: name.trim(),
      email: email.trim(),
      message: message.trim()
    });

    res.status(201).json({
      message: "Your message was saved successfully!"
    });
  } catch (error) {
    console.error("Contact form error:", error);
    res.status(500).json({
      message: "Could not save your message. Please try again."
    });
  }
});

async function startServer() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing from your .env file.");
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB!");

    app.listen(PORT, () => {
      console.log(`Website running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
  }
}

startServer();
