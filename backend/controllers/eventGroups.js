const EventGroup = require("../models/EventGroup.js");
const Event = require("../models/Event.js");
const Attendance = require("../models/Attendance.js");
const ExcelJS = require("exceljs");

const createEventGroup = async (req, res) => {
  try {
    const { name, description } = req.body;

    const eventGroup = await EventGroup.create({
      name,
      description,
      userId: req.user.id,
    });

    res
      .status(201)
      .json({ message: "Event group created successfully", eventGroup });
  } catch (error) {
    console.error("Error creating event group:", error);
    res.status(500).json({ message: "Error creating event group" });
  }
};

const getAllEventGroups = async (req, res) => {
  try {
    const eventGroups = await EventGroup.findAll({
      where: { userId: req.user.id },
    });

    res.status(200).json({
      message: "Event groups retrieved successfully",
      eventGroups,
    });
  } catch (error) {
    console.error("Error retrieving all event groups:", error);
    res.status(500).json({ message: "Error retrieving all event groups" });
  }
};

const getEventGroupById = async (req, res) => {
  try {
    const eventGroup = await EventGroup.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!eventGroup) {
      return res.status(404).json({ message: "Event group not found" });
    }

    res.status(200).json({
      message: "Event group retrieved successfully",
      eventGroup,
    });
  } catch (error) {
    console.error("Error retrieving event group:", error);
    res.status(500).json({ message: "Error retrieving event group" });
  }
};

const updateEventGroup = async (req, res) => {
  try {
    const { name, description } = req.body;

    const eventGroup = await EventGroup.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!eventGroup) {
      return res.status(404).json({ message: "Event group not found" });
    }

    eventGroup.name = name || eventGroup.name;
    eventGroup.description = description || eventGroup.description;

    await eventGroup.save();

    res
      .status(200)
      .json({ message: "Event group updated successfully", eventGroup });
  } catch (error) {
    console.error("Error updating the event group:", error);
    res.status(500).json({ message: "Error updating the event group" });
  }
};

const deleteEventGroup = async (req, res) => {
  try {
    const eventGroup = await EventGroup.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!eventGroup) {
      return res.status(404).json({ message: "Event group not found" });
    }

    await eventGroup.destroy();

    res
      .status(200)
      .json({ message: "Event group deleted successfully", eventGroup });
  } catch (error) {
    console.error("Error deleting event group:", error);
    res.status(500).json({ message: "Error deleting event group" });
  }
};

const getAllEventsFromOneEventGroup = async (req, res) => {
  try {
    const events = await Event.findAll({
      where: { eventGroupId: req.params.id, userId: req.user.id },
    });

    if (!events) {
      return res
        .status(404)
        .json({ message: "Events from event group not found" });
    }

    res.status(200).json({
      message: "Events from the event group retrieved successfully",
      events,
    });
  } catch (error) {
    console.error("Error retrieving events from the event group:", error);
    res
      .status(500)
      .json({ message: "Error retrieving events from the event group" });
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

const getEventGroupAttendance = async (req, res) => {
  try {
    const eventGroup = await EventGroup.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!eventGroup) {
      return res.status(404).json({ message: "Event group not found" });
    }

    const events = await Event.findAll({
      where: {
        eventGroupId: eventGroup.id,
        userId: req.user.id,
      },
      attributes: ["id", "title", "startTime", "status"],
    });

    if (!events || events.length === 0) {
      return res.status(200).json({
        message: "Event group has no events",
        eventGroup: {
          id: eventGroup.id,
          name: eventGroup.name,
          events: [],
        },
      });
    }

    const eventIds = events.map((event) => event.id);
    const attendanceRecords = await Attendance.findAll({
      where: { eventId: eventIds },
      attributes: [
        "id",
        "eventId",
        "participantName",
        "participantEmail",
        "timestamp",
      ],
      order: [["timestamp", "DESC"]],
    });

    const attendanceByEvent = events.map((event) => ({
      eventId: event.id,
      eventTitle: event.title,
      eventDate: formatDate(event.startTime).split(",")[0],
      status: event.status,
      attendance: attendanceRecords.filter(
        (record) => record.eventId === event.id
      ),
    }));

    res.status(200).json({
      message: "Event group attendance retrieved successfully",
      eventGroup: {
        id: eventGroup.id,
        name: eventGroup.name,
        events: attendanceByEvent,
      },
    });
  } catch (error) {
    console.error("Error retrieving event group attendance:", error);
    res
      .status(500)
      .json({ message: "Error retrieving event group attendance" });
  }
};

const exportEventGroupAttendance = async (req, res) => {
  try {
    const { format = "csv" } = req.query;

    const eventGroup = await EventGroup.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!eventGroup) {
      return res.status(404).json({ message: "Event group not found" });
    }

    const events = await Event.findAll({
      where: {
        eventGroupId: eventGroup.id,
        userId: req.user.id,
      },
      attributes: ["id", "title", "startTime"],
    });

    if (!events || events.length === 0) {
      return res.status(200).json({
        message: "Event group has no events to export",
        eventGroup: {
          id: eventGroup.id,
          name: eventGroup.name,
        },
      });
    }

    const eventIds = events.map((event) => event.id);
    const attendanceRecords = await Attendance.findAll({
      where: { eventId: eventIds },
      attributes: [
        "eventId",
        "participantName",
        "participantEmail",
        "timestamp",
      ],
      order: [["timestamp", "DESC"]],
    });

    if (format.toLowerCase() === "csv") {
      let csvContent = [];

      // Title row
      csvContent.push("Event Group Attendance Report"); // Row 1

      csvContent.push(""); // Row 2: Empty

      // Event Group details
      csvContent.push(`Event Group:,${eventGroup.name}`); // Row 3
      csvContent.push(`Total Events:,${events.length}`); // Row 4
      csvContent.push(`Total Participants:,${attendanceRecords.length}`); // Row 5

      csvContent.push(""); // Row 6: Empty

      // Participant table headers (Row 7)
      csvContent.push(
        "Event Title,Event Date,Participant Name,Participant Email,Check-in Time"
      );

      // Participant data (Starting from Row 8)
      attendanceRecords.forEach((record) => {
        const event = events.find((e) => e.id === record.eventId);
        csvContent.push(
          `"${event.title}","${formatDate(event.startTime).split(",")[0]}","${
            record.participantName
          }","${record.participantEmail}","${formatDate(record.timestamp)}"`
        );
      });

      // Joining all lines with newline character
      const csv = csvContent.join("\n");

      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=attendance-group.csv`
      );
      return res.status(200).send(csv);
    } else if (format.toLowerCase() === "xlsx") {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Event Group Attendance");

      worksheet.columns = [
        { key: "eventTitle", width: 30 },
        { key: "eventDate", width: 15 },
        { key: "participantName", width: 30 },
        { key: "participantEmail", width: 35 },
        { key: "checkInTime", width: 25 },
      ];

      // Title row
      const titleRow = worksheet.addRow(["Event Group Attendance Report"]); // Row 1
      titleRow.font = { bold: true, size: 16 };
      worksheet.mergeCells("A1:E1");
      titleRow.getCell(1).alignment = { horizontal: "center" };

      worksheet.addRow([]); // Row 2: Empty

      // Event Group details
      worksheet.addRow(["Event Group:", eventGroup.name]); // Row 3
      worksheet.addRow(["Total Events:", events.length]); // Row 4
      worksheet.addRow(["Total Participants:", attendanceRecords.length]); // Row 5

      worksheet.addRow([]); // Row 6: Empty

      // Participant table headers with styling (Row 7)
      const headerRow = worksheet.addRow([
        "Event Title",
        "Event Date",
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
        const event = events.find((e) => e.id === record.eventId);
        worksheet.addRow({
          eventTitle: event.title,
          eventDate: formatDate(event.startTime).split(",")[0],
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
        `attachment; filename=attendance-group.xlsx`
      );
      return res.status(200).send(buffer);
    } else {
      return res.status(400).json({
        message: "Invalid export format. Use 'csv' or 'xlsx'",
      });
    }
  } catch (error) {
    console.error("Error exporting event group attendance:", error);
    res.status(500).json({ message: "Error exporting event group attendance" });
  }
};

module.exports = {
  createEventGroup,
  getAllEventGroups,
  getEventGroupById,
  updateEventGroup,
  deleteEventGroup,
  getAllEventsFromOneEventGroup,
  getEventGroupAttendance,
  exportEventGroupAttendance,
};
