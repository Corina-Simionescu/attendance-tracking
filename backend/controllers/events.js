const Event = require("../models/Event.js");

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

module.exports = {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  updateEventStatus,
};
