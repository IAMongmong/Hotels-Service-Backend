const dotenv = require("dotenv");
const { Sequelize } = require("sequelize");
const { promises } = require("supertest/lib/test");

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    port: process.env.DB_PORT,
  }
);

module.exports = sequelize;
