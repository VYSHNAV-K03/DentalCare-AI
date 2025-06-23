const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const path = require("path");

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Initialize app
const app = express();

// Enable CORS for cross-origin requests
app.use(
  cors({
    origin: true,
  })
);

// Middleware to parse incoming JSON requests
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Authentication routes
app.use("/api/auth", require("./routes/auth"));

// Admin routes
app.use("/api/admin", require("./routes/admin"));

app.use("/api/packagemanager", require("./routes/packagemanager"));

// User routes
app.use("/api/users", require("./routes/user"));

// Payment routes
app.use("/api/payments", require("./routes/payment_route"));
app.use("/api/cart", require("./routes/cart"));

app.use("/api/review", require("./routes/reviews"));

// Set the port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
