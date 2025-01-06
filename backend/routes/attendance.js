const express = require("express");
const router = express.Router();

const attendanceController = require("../controllers/attendance.js");

router.post("/register", attendanceController.recordAttendance);

module.exports = router;
