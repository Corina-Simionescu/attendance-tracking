const User = require("./User.js");
const EventGroup = require("./EventGroup.js");
const Event = require("./Event.js");
const Attendance = require("./Attendance.js");

User.hasMany(EventGroup, { foreignKey: "userId" });
EventGroup.belongsTo(User, { foreignKey: "userId" });

EventGroup.hasMany(Event, { foreignKey: "eventGroupId" });
Event.belongsTo(EventGroup, { foreignKey: "eventGroupId" });

User.hasMany(Event, { foreignKey: "userId" });
Event.belongsTo(User, { foreignKey: "userId" });

Event.hasMany(Attendance, { foreignKey: "eventId" });
Attendance.belongsTo(Event, { foreignKey: "eventId" });

module.exports = {
  User,
  EventGroup,
  Event,
  Attendance,
};
