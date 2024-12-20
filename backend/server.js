const express = require("express");
const dotenv = require("dotenv");
const { sequelize, initializeDatabase } = require("./config/database.js");

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

initializeDatabase();

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
