const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  // Safely grab the token after the "Bearer " keyword
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ success: false, error: "Access Denied: No Token Provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decodedUser) => {
    if (err) {
      return res.status(403).json({ success: false, error: "Access Denied: Invalid or Expired Token" });
    }
    // Attach the validated user data to the request object
    req.user = decodedUser;
    next();
  });
};

module.exports = authenticateToken;
