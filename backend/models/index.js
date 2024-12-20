const User = require("./User.js");
const Event = require("./Event.js");

User.hasMany(Event);
Event.belongsTo(User);

module.exports = {
  User,
  Event,
};
