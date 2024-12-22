const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.js");
const authMiddleware = require("../middleware/auth.js");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get(
  "/profile",
  authMiddleware.verifyAuthToken,
  authController.getProfile
);

module.exports = router;
