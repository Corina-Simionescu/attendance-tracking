const User = require("./User.js");
const Event = require("./Event.js");

User.hasMany(Event);
Event.hasOne(User);

module.exports = {
  User,
  Event,
};
