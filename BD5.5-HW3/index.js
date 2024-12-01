const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require('./lib');
const { user, recipe, favorite } = require('./models');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.json());

// Dummy data for seeding
const userData = {
  username: 'foodlover',
  email: 'foodlover@example.com',
  password: 'securepassword',
};

const recipeData = [
  {
    title: 'Spaghetti Carbonara',
    chef: 'Chef Luigi',
    cuisine: 'Italian',
    preparationTime: 30,
    instructions:
      'Cook spaghetti. In a bowl, mix eggs, cheese, and pepper. Combine with pasta and pancetta.',
  },
  {
    title: 'Chicken Tikka Masala',
    chef: 'Chef Anil',
    cuisine: 'Indian',
    preparationTime: 45,
    instructions:
      'Marinate chicken in spices and yogurt. Grill and serve with a creamy tomato sauce.',
  },
  {
    title: 'Sushi Roll',
    chef: 'Chef Sato',
    cuisine: 'Japanese',
    preparationTime: 60,
    instructions:
      'Cook sushi rice. Place rice on nori, add fillings, roll, and slice into pieces.',
  },
  {
    title: 'Beef Wellington',
    chef: 'Chef Gordon',
    cuisine: 'British',
    preparationTime: 120,
    instructions:
      'Wrap beef fillet in puff pastry with mushroom duxelles and bake until golden.',
  },
  {
    title: 'Tacos Al Pastor',
    chef: 'Chef Maria',
    cuisine: 'Mexican',
    preparationTime: 50,
    instructions:
      'Marinate pork in adobo, grill, and serve on tortillas with pineapple and cilantro.',
  },
];

// Endpoint to seed the database
app.get('/seed_db', async (req, res) => {
  try {
    await sequelize.sync({ force: true });
    await user.create(userData);
    await recipe.bulkCreate(recipeData);
    res.status(200).json({ message: 'Database seeded successfully' });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error seeding data', error: error.message });
  }
});

// Function to favorite a recipe
async function favoriteRecipe(userId, recipeId) {
  const newFavorite = await favorite.create({ userId, recipeId });
  return { message: 'Recipe favorited', newFavorite };
}

// Endpoint to favorite a recipe
app.get('/users/:id/favorite', async (req, res) => {
  try {
    const userId = req.params.id;
    const recipeId = req.query.recipeId;
    const response = await favoriteRecipe(userId, recipeId);
    res.status(200).json(response);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error favoriting recipe', error: error.message });
  }
});

// Function to unfavorite a recipe
async function unfavoriteRecipe(userId, recipeId) {
  await favorite.destroy({ where: { userId, recipeId } });
  return { message: 'Recipe unfavorited' };
}

// Endpoint to unfavorite a recipe
app.get('/users/:id/unfavorite', async (req, res) => {
  try {
    const userId = req.params.id;
    const recipeId = req.query.recipeId;
    const response = await unfavoriteRecipe(userId, recipeId);
    res.status(200).json(response);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error unfavoriting recipe', error: error.message });
  }
});

// Function to get all favorited recipes
async function getAllFavoritedRecipes(userId) {
  const favoritedRecipes = await recipe.findAll({
    include: {
      model: user,
      where: { id: userId },
      through: { attributes: [] },
    },
  });
  return { favoritedRecipes };
}

// Endpoint to get all favorited recipes
app.get('/users/:id/favorites', async (req, res) => {
  try {
    const userId = req.params.id;
    const response = await getAllFavoritedRecipes(userId);
    if (response.favoritedRecipes.length === 0) {
      return res.status(404).json({ message: 'No favorited recipes found.' });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching favorited recipes',
      error: error.message,
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
