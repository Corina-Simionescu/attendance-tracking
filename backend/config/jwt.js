const jwt = require("jsonwebtoken");

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const generateToken = (user) => {
  return jwt.sign({ id: user.id, username: user.username }, JWT_SECRET_KEY, {
    expiresIn: "24h",
  });
};

const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET_KEY);
};

module.exports = {
  generateToken,
  verifyToken,
};
