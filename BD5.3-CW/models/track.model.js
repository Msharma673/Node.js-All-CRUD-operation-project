const { sequelize, DataTypes } = require("../lib/index");

const Track = sequelize.define(
    "Track",
    {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        genre: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        release_year: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        artist: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        album: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        duration: {
            type: DataTypes.INTEGER, // duration in minutes
            allowNull: false,
        },
    },
    {
        timestamps: false, // Disable createdAt and updatedAt fields
    },
);

module.exports = Track;
