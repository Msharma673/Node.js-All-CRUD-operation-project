const { DataTypes, sequelize } = require("../lib");

const author = require("./author.model");
const book = require("./book.model");

const bookAuthor = sequelize.define("bookAuthor", {
  authorId: {
    type: DataTypes.INTEGER,
    references: {
      model: author,
      key: "id",
    },
  },
  bookId: {
    type: DataTypes.INTEGER,
    references: {
      model: book,
      key: "id",
    },
  },
});

module.exports = bookAuthor;
