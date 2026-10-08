require("dotenv").config();
const express = require("express");
const userRoutes = require("./routes/userRoutes");


const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON requests
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: "Endpoint not found" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
