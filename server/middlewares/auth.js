const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.cookies["token"];

  if (!token) {
    return res
      .status(403)
      .json({ error: "A token is required for authentication" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded;
  } catch (err) {
    return res.status(401).json({ error: "Invalid Token" });
  }

  next();
};

const verifyAdmin = (req, res, next) => {
  const token = req.cookies["token"];

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      if (decoded.role && decoded.role === "Admins") {
        req.user = decoded; // User is authenticated and authorized as an admin
        next();
      } else {
        // User is not an admin
        return res
          .status(403)
          .json({ error: "Access denied: Admin role required" });
      }
    } catch (err) {
      return res.status(401).json({ error: "Invalid Token" });
    }
  }
};

module.exports = { verifyToken, verifyAdmin };
