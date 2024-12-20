const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "../data/database.sqlite",
  logging: false,
});

const initializeDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection established successfully.");

    await sequelize.sync();
    console.log("Models successfully (re)created");
  } catch (error) {
    console.error("Database initialization error:", error);
  }
};

module.exports = { sequelize, initializeDatabase };
