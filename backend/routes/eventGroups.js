const express = require("express");
const router = express.Router();

const eventGroupsController = require("../controllers/eventGroups.js");
const authMiddleware = require("../middleware/auth.js");

router.post(
  "/",
  authMiddleware.verifyAuthToken,
  eventGroupsController.createEventGroup
);
router.get(
  "/",
  authMiddleware.verifyAuthToken,
  eventGroupsController.getAllEventGroups
);
router.get(
  "/:id",
  authMiddleware.verifyAuthToken,
  eventGroupsController.getEventGroupById
);
router.put(
  "/:id",
  authMiddleware.verifyAuthToken,
  eventGroupsController.updateEventGroup
);
router.delete(
  "/:id",
  authMiddleware.verifyAuthToken,
  eventGroupsController.deleteEventGroup
);
router.get(
  "/:id/events",
  authMiddleware.verifyAuthToken,
  eventGroupsController.getAllEventsFromOneEventGroup
);
// router.get(
//   "/:id/export",
//   authMiddleware.verifyAuthToken,
//   eventGroupsController.exportGroupAttendance
// );

module.exports = router;
