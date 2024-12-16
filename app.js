const express = require("express");
const hotelRoutes = require("./src/routes/hotelRoute.js");
const sequelize = require("./src/config/database.js");

const app = express();

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
    return sequelize.sync({ force: false }); // Call .sync here and return its promise
  })
  .then(() => {
    console.log("Database & tables created!");
  })
  .catch((error) => {
    console.error("Unable to create tables:", error);
  });


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/hotels", hotelRoutes);

module.exports = app;
