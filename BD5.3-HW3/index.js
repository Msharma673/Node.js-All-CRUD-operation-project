const express = require("express");
const bodyParser = require("body-parser");
const { sequelize } = require("./lib/index");
const Company = require("./models/company.model"); // Import the Company model

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.json());

// Dummy data for seeding the database (companies)
const seedCompanies = [
  {
    name: "Tech Innovators",
    industry: "Technology",
    foundedYear: 2010,
    headquarters: "San Francisco",
    revenue: 75000000,
  },
  {
    name: "Green Earth",
    industry: "Renewable Energy",
    foundedYear: 2015,
    headquarters: "Portland",
    revenue: 50000000,
  },
  {
    name: "Innovatech",
    industry: "Technology",
    foundedYear: 2012,
    headquarters: "Los Angeles",
    revenue: 65000000,
  },
  {
    name: "Solar Solutions",
    industry: "Renewable Energy",
    foundedYear: 2015,
    headquarters: "Austin",
    revenue: 60000000,
  },
  {
    name: "HealthFirst",
    industry: "Healthcare",
    foundedYear: 2008,
    headquarters: "New York",
    revenue: 80000000,
  },
  {
    name: "EcoPower",
    industry: "Renewable Energy",
    foundedYear: 2018,
    headquarters: "Seattle",
    revenue: 55000000,
  },
  {
    name: "MediCare",
    industry: "Healthcare",
    foundedYear: 2012,
    headquarters: "Boston",
    revenue: 70000000,
  },
  {
    name: "NextGen Tech",
    industry: "Technology",
    foundedYear: 2018,
    headquarters: "Chicago",
    revenue: 72000000,
  },
  {
    name: "LifeWell",
    industry: "Healthcare",
    foundedYear: 2010,
    headquarters: "Houston",
    revenue: 75000000,
  },
  {
    name: "CleanTech",
    industry: "Renewable Energy",
    foundedYear: 2008,
    headquarters: "Denver",
    revenue: 62000000,
  },
];

// Endpoint to seed the companies database
app.get("/seed_companies", async (req, res) => {
  try {
    await sequelize.sync({ force: true }); // Sync the database and drop existing tables
    await Company.bulkCreate(seedCompanies); // Bulk create companies
    res.status(200).json({ message: "Companies database seeded successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error seeding the companies data",
      error: error.message,
    });
  }
});

// Fetch all companies
app.get("/companies", async (req, res) => {
  try {
    const companies = await Company.findAll(); // Fetch all companies from the database
    res.status(200).json({ companies });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching companies", error: error.message });
  }
});

// Add a new company
app.post("/companies/new", async (req, res) => {
  const newCompany = req.body; // Extract new company data from request body
  try {
    const company = await Company.create(newCompany); // Create new company in the database
    res.status(201).json({ newCompany: company });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding new company", error: error.message });
  }
});

// Update company information
app.put("/companies/update/:id", async (req, res) => {
  const id = req.params.id; // Get company ID from the request parameters
  const newCompanyData = req.body; // Get new company data from the request body
  try {
    const company = await Company.findByPk(id); // Find the company by ID
    if (company) {
      await company.update(newCompanyData); // Update company information
      res.status(200).json({
        message: "Company updated successfully",
        updatedCompany: company,
      });
    } else {
      res.status(404).json({ message: "Company not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating company", error: error.message });
  }
});

// Delete a company
app.delete("/companies/delete", async (req, res) => {
  const { id } = req.body; // Get company ID from the request body
  try {
    if (!id) {
      return res.status(400).json({ message: "ID is required for deletion." });
    }

    const company = await Company.findByPk(id); // Find the company by ID
    if (company) {
      await company.destroy(); // Delete the company
      res.status(200).json({ message: "Company record deleted successfully" });
    } else {
      res.status(404).json({ message: "Company not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting company", error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
