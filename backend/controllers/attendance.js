const Attendance = require("../models/Attendance.js");
const Event = require("../models/Event.js");

const recordAttendance = async (req, res) => {
  try {
    const { accessCode, participantName, participantEmail } = req.body;

    const event = await Event.findOne({ where: { accessCode } });

    if (!event) {
      return res.status(404).json({ message: "Invalid access code." });
    }

    if (event.status !== "OPEN") {
      return res
        .status(400)
        .json({ message: "Event is not open for attendance." });
    }

    const existingAttendance = await Attendance.findOne({
      where: { eventId: event.id, participantEmail },
    });

    if (existingAttendance) {
      return res
        .status(400)
        .json({ message: "Participant already registered for this event" });
    }

    const attendance = await Attendance.create({
      eventId: event.id,
      participantName,
      participantEmail,
    });

    res
      .status(201)
      .json({ message: "Attendance recorded successfully", attendance });
  } catch (error) {
    console.error("Error recording attendance:", error);
    res.status(500).json({ message: "Error recording attendance" });
  }
};

module.exports = { recordAttendance };
