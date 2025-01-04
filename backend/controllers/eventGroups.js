const EventGroup = require("../models/EventGroup.js");
const Event = require("../models/Event.js");

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

module.exports = {
  createEventGroup,
  getAllEventGroups,
  getEventGroupById,
  updateEventGroup,
  deleteEventGroup,
  getAllEventsFromOneEventGroup,
};
