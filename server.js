
const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// Read JSON requests
app.use(express.json({ limit: "10kb" }));

// Serve your existing portfolio files
app.use(express.static(path.join(__dirname, "..")));

// Test whether the backend is working
app.get("/api/hello", (req, res) => {
  res.json({
    status: "success",
    message: "Portfolio backend is working!"
  });
});

// Receive contact form messages
app.post("/api/contact", (req, res) => {
  const { name, email, message } = req.body || {};

  // Validate required fields
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

  const cleanName = name.trim();
  const cleanEmail = email.trim();
  const cleanMessage = message.trim();

  // Limit input sizes
  if (
    cleanName.length > 100 ||
    cleanEmail.length > 254 ||
    cleanMessage.length > 5000
  ) {
    return res.status(400).json({
      message: "One or more fields are too long."
    });
  }

  // Basic email format check
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    return res.status(400).json({
      message: "Please enter a valid email address."
    });
  }

  // Display the received message in the server terminal
  console.log("\n===== NEW CONTACT MESSAGE =====");
  console.log("Name:", cleanName);
  console.log("Email:", cleanEmail);
  console.log("Message:", cleanMessage);
  console.log("================================\n");

  res.status(200).json({
    message: "Thank you! Your message was received successfully."
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Portfolio running at http://localhost:${PORT}`);
  console.log(`Backend API: http://localhost:${PORT}/api/hello`);
});
