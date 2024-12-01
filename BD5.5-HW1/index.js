const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require('./lib/index');
const { user, book, like } = require('./models');
const { Op } = require('@sequelize/core');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.json());

// Seed Data
const userData = {
  username: 'booklover',
  email: 'booklover@gmail.com',
  password: 'password123',
};

const bookData = [
  {
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    genre: 'Fiction',
    year: 1960,
    summary: 'A novel about the serious issues of rape and racial inequality.',
  },
  {
    title: '1984',
    author: 'George Orwell',
    genre: 'Dystopian',
    year: 1949,
    summary:
      'A novel presenting a dystopian future under a totalitarian regime.',
  },
  {
    title: 'Moby-Dick',
    author: 'Herman Melville',
    genre: 'Adventure',
    year: 1851,
    summary:
      'The narrative of the sailor Ishmael and the obsessive quest of Ahab.',
  },
  {
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    genre: 'Romance',
    year: 1813,
    summary:
      'A romantic novel that charts the emotional development of the protagonist Elizabeth Bennet.',
  },
  {
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    genre: 'Fiction',
    year: 1925,
    summary: 'A novel about the American dream and the roaring twenties.',
  },
];

// Seed Database Endpoint
app.get('/seed_db', async (req, res) => {
  try {
    await sequelize.sync({ force: true });

    await user.create(userData);
    await book.bulkCreate(bookData);

    res.status(200).json({ message: 'Database seeding successful!' });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error seeding database', error: error.message });
  }
});

// Helper Functions
async function likeBook(userId, bookId) {
  const newLike = await like.create({ userId, bookId });
  return { message: 'Book liked', newLike };
}

async function dislikeBook(userId, bookId) {
  await like.destroy({ where: { userId, bookId } });
  return { message: 'Book disliked' };
}

async function getAllLikedBooks(userId) {
  const likedBookIds = await like.findAll({
    where: { userId },
    attributes: ['bookId'],
  });

  const bookIds = likedBookIds.map((likeRecord) => likeRecord.bookId);

  const likedBooks = await book.findAll({
    where: { id: { [Op.in]: bookIds } },
  });

  return { likedBooks };
}

// Endpoints

// 1. Like a Book
app.get('/users/:id/like', async (req, res) => {
  try {
    const userId = req.params.id;
    const bookId = req.query.bookId;

    const response = await likeBook(userId, bookId);
    res.status(200).json(response);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error liking book', error: error.message });
  }
});

// 2. Dislike a Book
app.get('/users/:id/dislike', async (req, res) => {
  try {
    const userId = req.params.id;
    const bookId = req.query.bookId;

    const response = await dislikeBook(userId, bookId);
    res.status(200).json(response);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error disliking book', error: error.message });
  }
});

// 3. Get All Liked Books
app.get('/users/:id/liked', async (req, res) => {
  try {
    const userId = req.params.id;

    const response = await getAllLikedBooks(userId);
    if (response.likedBooks.length === 0) {
      return res.status(404).json({ message: 'No liked books found.' });
    }

    res.status(200).json(response);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error fetching liked books', error: error.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
