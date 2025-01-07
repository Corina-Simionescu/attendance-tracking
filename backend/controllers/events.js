const Event = require("../models/Event.js");
const Attendance = require("../models/Attendance.js");
const ExcelJS = require("exceljs");

const generateAccessCode = async () => {
  let code = "";
  const codeLength = 6;
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

  while (true) {
    for (let i = 0; i < codeLength; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }

    const exists = await Event.findOne({ where: { accessCode: code } });
    if (!exists) return code;
  }
};

const createEvent = async (req, res) => {
  try {
    const { title, description, startTime, duration, eventGroupId } = req.body;
    const eventData = {
      title,
      description,
      startTime,
      duration,
      accessCode: await generateAccessCode(),
      userId: req.user.id,
    };

    if (eventGroupId) {
      eventData.eventGroupId = eventGroupId;
    }

    const event = await Event.create(eventData);

    res
      .status(201)
      .json({ message: "Event created successfully", event: event });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ message: "Error creating event" });
  }
};

const getAllEvents = async (req, res) => {
  try {
    const events = await Event.findAll({ where: { userId: req.user.id } });
    res.status(200).json({ message: "Events retrieved successfully", events });
  } catch (error) {
    console.error("Error retrieving all events:", error);
    res.status(500).json({ message: "Error retrieving all events" });
  }
};

const getEventById = async (req, res) => {
  try {
    const event = await Event.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json({ message: "Event retrieved successfully", event });
  } catch (error) {
    console.error("Error retrieving event:", error);
    res.status(500).json({ message: "Error retrieving event" });
  }
};

const updateEvent = async (req, res) => {
  try {
    let { title, description, startTime, duration } = req.body;

    const event = await Event.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    event.title = title || event.title;
    event.description = description || event.description;
    event.startTime = startTime || event.startTime;
    event.duration = duration || event.duration;

    await event.save();

    res.status(200).json({ message: "Event updated successfully", event });
  } catch (error) {
    console.error("Error updating the event:", error);
    res.status(500).json({ message: "Error updating the event" });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    await event.destroy();

    res.status(200).json({ message: "Event deleted successfully", event });
  } catch (error) {
    console.error("Error deleting the event:", error);
    res.status(500).json({ message: "Error deleting the event" });
  }
};

const updateEventStatus = async (req, res) => {
  try {
    const event = await Event.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    event.status = event.status === "OPEN" ? "CLOSED" : "OPEN";

    await event.save();

    res
      .status(200)
      .json({ message: "Event status updated successfully", event });
  } catch (error) {
    console.error("Error updating event status:", error);
    res.status(500).json({ message: "Error updating event status" });
  }
};

const getEventAttendance = async (req, res) => {
  try {
    const event = await Event.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const attendanceRecords = await Attendance.findAll({
      where: { eventId: event.id },
      attributes: ["id", "participantName", "participantEmail", "timestamp"],
      order: [["timestamp", "DESC"]],
    });

    res.status(200).json({
      message: "Event attendance retrieved successfully",
      event: {
        id: event.id,
        title: event.title,
        status: event.status,
      },
      attendance: attendanceRecords,
    });
  } catch (error) {
    console.error("Error retrieving event attendance:", error);
    res.status(500).json({ message: "Error retrieving event attendance" });
  }
};

const formatDate = (date) => {
  return new Date(date).toLocaleString("en-GB", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
    timeZone: "UTC",
  });
};

const exportEventAttendance = async (req, res) => {
  try {
    const { format = "csv" } = req.query;

    const event = await Event.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const attendanceRecords = await Attendance.findAll({
      where: { eventId: event.id },
      attributes: ["participantName", "participantEmail", "timestamp"],
      order: [["timestamp", "DESC"]],
    });

    if (format.toLowerCase() === "csv") {
      try {
        let csvContent = [];

        // Title row
        csvContent.push("Event Attendance Report"); // Row 1

        csvContent.push(""); // Row 2: Empty

        // Event details
        csvContent.push(`Event:,${event.title}`); // Row 3
        csvContent.push(`Date:,${formatDate(event.startTime).split(",")[0]}`); // Row 4
        csvContent.push(`Total Participants:,${attendanceRecords.length}`); // Row 5

        csvContent.push(""); // Row 6: Empty

        // Participant table headers (Row 7)
        csvContent.push("Participant Name,Participant Email,Check-in Time");

        // Participant data (Starting from Row 8)
        attendanceRecords.forEach((record) => {
          csvContent.push(
            `${record.participantName},${record.participantEmail},"${formatDate(
              record.timestamp
            )}"`
          );
        });

        // Joining all lines with newline character
        const csv = csvContent.join("\n");

        res.setHeader("Content-Type", "text/csv");
        res.setHeader(
          "Content-Disposition",
          `attachment; filename=attendance-event.csv`
        );
        return res.status(200).send(csv);
      } catch (error) {
        console.error("Error generating CSV file:", error);
        return res.status(500).json({ message: "Error generating CSV file" });
      }
    } else if (format.toLowerCase() === "xlsx") {
      try {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Event Attendance");

        worksheet.columns = [
          { key: "participantName", width: 30 },
          { key: "participantEmail", width: 35 },
          { key: "checkInTime", width: 25 },
        ];

        // Title row
        const titleRow = worksheet.addRow(["Event Attendance Report"]); // Row 1
        titleRow.font = { bold: true, size: 16 };
        worksheet.mergeCells("A1:C1");
        titleRow.getCell(1).alignment = { horizontal: "center" };

        worksheet.addRow([]); // Row 2: Empty

        // Event details
        worksheet.addRow(["Event:", event.title]); // Row 3
        worksheet.addRow(["Date:", formatDate(event.startTime).split(",")[0]]); // Row 4
        worksheet.addRow(["Total Participants:", attendanceRecords.length]); // Row 5

        worksheet.addRow([]); // Row 6: Empty

        // Participant table headers with styling (Row 7)
        const headerRow = worksheet.addRow([
          "Participant Name",
          "Participant Email",
          "Check-in Time",
        ]);

        headerRow.eachCell((cell) => {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFE0E0E0" },
          };
          cell.font = { bold: true };
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
        });

        // Participant table rows (Starting from Row 8)
        attendanceRecords.forEach((record) => {
          worksheet.addRow({
            participantName: record.participantName,
            participantEmail: record.participantEmail,
            checkInTime: formatDate(record.timestamp),
          });
        });

        // Borders for all cells that contain data
        worksheet.eachRow((row) => {
          row.eachCell((cell) => {
            cell.border = {
              top: { style: "thin" },
              left: { style: "thin" },
              bottom: { style: "thin" },
              right: { style: "thin" },
            };
          });
        });

        const buffer = await workbook.xlsx.writeBuffer();

        res.setHeader(
          "Content-Type",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
          "Content-Disposition",
          `attachment; filename=attendance-event.xlsx`
        );
        return res.status(200).send(buffer);
      } catch (error) {
        console.error("Error generating XLSX file:", error);
        return res.status(500).json({ message: "Error generating XLSX file" });
      }
    } else {
      return res
        .status(400)
        .json({ message: "Invalid export format. Use 'csv' or 'xlsx'" });
    }
  } catch (error) {
    console.error("Error exporting event attendance:", error);
    res.status(500).json({ message: "Error exporting event attendance" });
  }
};

module.exports = {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  updateEventStatus,
  getEventAttendance,
  exportEventAttendance,
};
