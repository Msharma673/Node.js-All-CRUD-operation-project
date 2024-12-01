// models/post.model.js
const { sequelize, DataTypes } = require("../lib/index");

const Post = sequelize.define(
    "Post",
    {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        author: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        timestamps: false, // Disable createdAt and updatedAt fields
    },
);

module.exports = Post;
