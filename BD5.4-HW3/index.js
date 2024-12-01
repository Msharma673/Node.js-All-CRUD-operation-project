const express = require("express");
const bodyParser = require("body-parser");
const { sequelize } = require("./lib/index");
const { chef, dish, chefDish } = require("./models");

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.json());

// Seed Data
const dishData = [
  { name: "Margherita Pizza", cuisine: "Italian", preparationTime: 20 },
  { name: "Sushi", cuisine: "Japanese", preparationTime: 50 },
  { name: "Poutine", cuisine: "Canadian", preparationTime: 30 },
];

const chefData = [
  { name: "Gordon Ramsay", birthYear: 1966 },
  { name: "Masaharu Morimoto", birthYear: 1955 },
  { name: "Ricardo Larrivée", birthYear: 1967 },
];

// Endpoint to seed the database
app.get("/seed_chefs_dishes", async (req, res) => {
  try {
    await sequelize.sync({ force: true });
    await dish.bulkCreate(dishData);
    await chef.bulkCreate(chefData);
    res
      .status(200)
      .json({ message: "Chefs and dishes database seeded successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error seeding data", error: error.message });
  }
});

// Helper function to add a new chef
async function addNewChef(newChef) {
  const newData = await chef.create(newChef);
  return { newData };
}

// Endpoint to create a new chef
app.post("/chefs/new", async (req, res) => {
  try {
    const newChef = req.body.newChef;
    const response = await addNewChef(newChef);
    res.status(200).json(response);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating chef", error: error.message });
  }
});

// Helper function to update chef by ID
async function updateChefById(id, newChefData) {
  const chefDetails = await chef.findOne({ where: { id } });
  if (!chefDetails) {
    return { message: "Chef not found" };
  }
  chefDetails.set(newChefData);
  const updatedChef = await chefDetails.save();
  return { message: "Chef updated successfully", updatedChef };
}

// Endpoint to update chef by ID
app.post("/chefs/update/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const newChefData = req.body;
    const response = await updateChefById(id, newChefData);
    if (!response.updatedChef) {
      return res.status(404).json(response);
    }
    res.status(200).json(response);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating chef", error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
