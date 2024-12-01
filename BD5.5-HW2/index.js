const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require('./lib/index');

const { user, movie, like } = require('./models');

const { Op } = require('@sequelize/core');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.json());

// Dummy Data
const movieData = [
  {
    title: 'Inception',
    director: 'Christopher Nolan',
    genre: 'Sci-Fi',
    year: 2010,
    summary:
      'A skilled thief is given a chance at redemption if he can successfully perform an inception.',
  },
  {
    title: 'The Godfather',
    director: 'Francis Ford Coppola',
    genre: 'Crime',
    year: 1972,
    summary:
      'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
  },
  {
    title: 'Pulp Fiction',
    director: 'Quentin Tarantino',
    genre: 'Crime',
    year: 1994,
    summary:
      'The lives of two mob hitmen, a boxer, a gangster, and his wife intertwine in four tales of violence and redemption.',
  },
  {
    title: 'The Dark Knight',
    director: 'Christopher Nolan',
    genre: 'Action',
    year: 2008,
    summary:
      'When the menace known as the Joker emerges, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
  },
  {
    title: 'Forrest Gump',
    director: 'Robert Zemeckis',
    genre: 'Drama',
    year: 1994,
    summary:
      'The presidencies of Kennedy and Johnson, the Vietnam War, and other events unfold from the perspective of an Alabama man with an IQ of 75.',
  },
];

app.get('/seed_db', async (req, res) => {
  try {
    await sequelize.sync({ force: true });

    // Seeding user
    await user.create({
      username: 'moviefan',
      email: 'moviefan@gmail.com',
      password: 'password123',
    });

    // Seeding movies
    await movie.bulkCreate(movieData);

    res.status(200).json({ message: 'Database seeding successful!' });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error seeding data', error: error.message });
  }
});

// Helper function to like a movie
async function likeMovie(userId, movieId) {
  const newLike = await like.create({ userId, movieId });
  return { message: 'Movie liked', newLike };
}

// Endpoint to like a movie
app.get('/users/:id/like', async (req, res) => {
  try {
    const userId = req.params.id;
    const movieId = req.query.movieId;

    const response = await likeMovie(userId, movieId);
    res.status(200).json(response);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error liking movie', error: error.message });
  }
});

// Helper function to dislike a movie
async function dislikeMovie(userId, movieId) {
  await like.destroy({ where: { userId, movieId } });
  return { message: 'Movie disliked' };
}

// Endpoint to dislike a movie
app.get('/users/:id/dislike', async (req, res) => {
  try {
    const userId = req.params.id;
    const movieId = req.query.movieId;

    const response = await dislikeMovie(userId, movieId);
    res.status(200).json(response);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error disliking movie', error: error.message });
  }
});

// Helper function to get all liked movies
async function getAllLikedMovies(userId) {
  const likedMoviesIds = await like.findAll({
    where: { userId },
    attributes: ['movieId'],
  });

  const movieIds = likedMoviesIds.map((like) => like.movieId);

  const likedMovies = await movie.findAll({
    where: { id: { [Op.in]: movieIds } },
  });

  return { likedMovies };
}

// Endpoint to get all liked movies
app.get('/users/:id/liked', async (req, res) => {
  try {
    const userId = req.params.id;

    const response = await getAllLikedMovies(userId);
    if (response.likedMovies.length === 0) {
      return res.status(404).json({ message: 'No liked movies found' });
    }
    res.status(200).json(response);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error fetching liked movies', error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
