const { sequelize, DataTypes } = require("../lib/index");

// Define the Company model
const Company = sequelize.define(
  "Company",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false, // Name is required
    },
    industry: {
      type: DataTypes.STRING,
      allowNull: false, // Industry is required
    },
    foundedYear: {
      type: DataTypes.INTEGER,
      allowNull: false, // Founded year is required
    },
    headquarters: {
      type: DataTypes.STRING,
      allowNull: false, // Headquarters is required
    },
    revenue: {
      type: DataTypes.INTEGER,
      allowNull: false, // Revenue is required
    },
  },
  {
    timestamps: false, // Disable automatic timestamps
  },
);

module.exports = Company;
