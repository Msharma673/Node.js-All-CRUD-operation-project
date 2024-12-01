const { Sequelize, DataTypes } = require("sequelize");

// Create a new Sequelize instance with SQLite as the database
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "database.sqlite", // Path to the SQLite database file
  logging: false, // Disable logging for cleaner output
});

// Export sequelize instance and DataTypes for use in models
module.exports = { sequelize, DataTypes };
