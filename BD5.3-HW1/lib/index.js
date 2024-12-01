// lib/index.js
const { Sequelize, DataTypes } = require("sequelize");

// Create a new Sequelize instance (SQLite file storage)
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "database.sqlite", // This creates a SQLite database file
  logging: false,
});

module.exports = { sequelize, DataTypes };
