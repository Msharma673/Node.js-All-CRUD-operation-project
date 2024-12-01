const express = require("express");
const bodyParser = require("body-parser");
const { sequelize } = require("./lib/index");
const { author, book, bookAuthor } = require("./models");

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.json());

// Seed Data
const bookData = [
  {
    title: "Harry Potter and the Philosopher's Stone",
    genre: "Fantasy",
    publicationYear: 1997,
  },
  { title: "A Game of Thrones", genre: "Fantasy", publicationYear: 1996 },
  { title: "The Hobbit", genre: "Fantasy", publicationYear: 1937 },
];

const authorData = [{ name: "J.K. Rowling", birthYear: 1965 }];

// Endpoint to seed the database
app.get("/seed_books_authors", async (req, res) => {
  try {
    await sequelize.sync({ force: true });
    await book.bulkCreate(bookData);
    await author.bulkCreate(authorData);
    res
      .status(200)
      .json({ message: "Books and authors database seeded successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error seeding data", error: error.message });
  }
});

// Helper function to add a new author
async function addNewAuthor(newAuthor) {
  const newData = await author.create(newAuthor);
  return { newData };
}

// Endpoint to create a new author
app.post("/authors/new", async (req, res) => {
  try {
    const newAuthor = req.body.newAuthor;
    const response = await addNewAuthor(newAuthor);
    res.status(200).json(response);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating author", error: error.message });
  }
});

// Helper function to update author by ID
async function updateAuthorById(id, newAuthorData) {
  const authorDetails = await author.findOne({ where: { id } });
  if (!authorDetails) {
    return { message: "Author not found" };
  }
  authorDetails.set(newAuthorData);
  const updatedAuthor = await authorDetails.save();
  return { message: "Author updated successfully", updatedAuthor };
}

// Endpoint to update author by ID
app.post("/authors/update/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const newAuthorData = req.body;
    const response = await updateAuthorById(id, newAuthorData);
    if (!response.updatedAuthor) {
      return res.status(404).json(response);
    }
    res.status(200).json(response);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating author", error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
