const express = require("express");
const cors = require("cors");
const routes = require("./routes/routes");
const db = require("./models");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", routes);

(async () => {
  await db.sequelize.sync({ force: false });
})();

app.listen(PORT);
