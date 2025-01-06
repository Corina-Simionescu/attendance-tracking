const express = require("express");
const router = express.Router();

const authRoutes = require("./auth.js");
const eventsRoutes = require("./events.js");
const eventGroupsRoutes = require("./eventGroups.js");
const attendanceRoutes = require("./attendance.js");

router.use("/auth", authRoutes);
router.use("/events", eventsRoutes);
router.use("/event-groups", eventGroupsRoutes);
router.use("/attendance", attendanceRoutes);

module.exports = router;
