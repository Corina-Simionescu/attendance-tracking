const express = require("express");
const router = express.Router();

const eventsController = require("../controllers/events.js");
const authMiddleware = require("../middleware/auth.js");

router.post("/", authMiddleware.verifyAuthToken, eventsController.createEvent);
router.get("/", authMiddleware.verifyAuthToken, eventsController.getAllEvents);
router.get(
  "/:id",
  authMiddleware.verifyAuthToken,
  eventsController.getEventById
);
router.put(
  "/:id",
  authMiddleware.verifyAuthToken,
  eventsController.updateEvent
);
router.delete(
  "/:id",
  authMiddleware.verifyAuthToken,
  eventsController.deleteEvent
);
router.put(
  "/:id/status",
  authMiddleware.verifyAuthToken,
  eventsController.updateEventStatus
);
router.get(
  "/:id/attendance",
  authMiddleware.verifyAuthToken,
  eventsController.getEventAttendance
);
router.get(
  "/:id/export-attendance",
  authMiddleware.verifyAuthToken,
  eventsController.exportEventAttendance
);

module.exports = router;
