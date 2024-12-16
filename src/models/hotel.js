const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database.js");

const Hotel = sequelize.define(
  "Hotel",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    webLink: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    longitude: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    latitude: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    is_open: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    tableName: "hotels",
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ["id"],
      },
      {
        fields: ["country"],
      },
      {
        fields: ["city"],
      },
    ],
  }
);

module.exports = Hotel;
