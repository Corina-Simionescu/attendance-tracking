const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const swaggerUi = require("swagger-ui-express");
const fs = require("fs");
const YAML = require("yaml");

const { initializeDatabase } = require("./config/database.js");
const routes = require("./routes/index.js");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const file = fs.readFileSync("./swagger.yaml", "utf8");
const swaggerDocument = YAML.parse(file);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

initializeDatabase();

app.use("/api", routes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
