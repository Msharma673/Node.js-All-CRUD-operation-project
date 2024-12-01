const { sequelize } = require("../lib");
const author = require("./author.model");
const book = require("./book.model");
const bookAuthor = require("./bookAuthor.model");

author.belongsToMany(book, { through: bookAuthor });
book.belongsToMany(author, { through: bookAuthor });

sequelize
  .sync({ force: true })
  .then(() => {
    console.log("Database synced successfully!");
  })
  .catch((error) => console.error("Error syncing database:", error));

module.exports = { author, book, bookAuthor };
