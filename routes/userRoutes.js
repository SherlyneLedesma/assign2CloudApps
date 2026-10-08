const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const authenticateToken = require("../config/auth"); 

//Login Endpoint:
router.post("/login", async (req, res) => {
  try {
    const { username, passwd } = req.body;

    // Check if both fields are provided in the payload
    if (!username || !passwd) {
      return res.status(400).json({ success: false, error: "Username and password are required." });
    }

    // Query database via our User model to check credentials
    const user = await User.findByCredentials(username, passwd);

    // If no user found matching username and password, deny entry
    if (!user) {
      return res.status(401).json({ success: false, error: "Invalid username or password." });
    }

    // Generate JWT payload containing non-sensitive user identity details
    const payload = { id: user.userID, username: user.username, role: user.urole };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({ success: true, token: token });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.use(authenticateToken);


// Endpoint: GET /api/users - Find all users (READ)
router.get("/", async function (req, res) {
  try {
    const users = await User.findAll();
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Endpoint: GET /api/users/:id - Find single user (READ)
router.get("/:id", async function (req, res) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Endpoint: POST /api/users - Add new user (CREATE)
router.post("/", async function (req, res) {
  try {
    const { username } = req.body;
    if (!username) {
      return res.status(400).json({ success: false, error: 'Field "username" is required.' });
    }

    const insertId = await User.create(req.body);
    const newUser = await User.findById(insertId);

    res.status(201).json({ success: true, data: newUser });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Endpoint: PUT /api/users/:id - Update user (UPDATE)
router.put("/:id", async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) {
      return res.status(400).json({ success: false, error: 'Field "username" is required.' });
    }
    const updated = await User.update(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, error: "User not found" });
    }
    const updatedUser = await User.findById(req.params.id);
    res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE /api/users/:id - Delete user
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await User.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: "User not found" });
    }
    res.status(200).json({ success: true, message: "User successfully deleted" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
