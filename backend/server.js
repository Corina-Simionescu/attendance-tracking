const dotenv = require("dotenv");
dotenv.config();

const express = require("express");

const { initializeDatabase } = require("./config/database.js");
const routes = require("./routes/index.js");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

initializeDatabase();

app.use("/api", routes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
