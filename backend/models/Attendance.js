const { sequelize } = require("../config/database.js");
const { DataTypes } = require("sequelize");

const Attendance = sequelize.define(
  "Attendance",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    eventId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Events",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    participantName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    participantEmail: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ["eventId", "participantEmail"],
      },
    ],
  }
);

module.exports = Attendance;
