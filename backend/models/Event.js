const { sequelize } = require("../config/database.js");
const { DataTypes } = require("sequelize");

const Event = sequelize.define("Event", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  startTime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("CLOSED", "OPEN"),
    defaultValue: "CLOSED",
  },
  accessCode: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Users",
      key: "id",
    },
  },
  eventGroupId: {
    type: DataTypes.INTEGER,
    references: {
      model: "EventGroups",
      key: "id",
    },
  },
});

module.exports = Event;
