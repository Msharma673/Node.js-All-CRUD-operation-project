const express = require("express");
const bodyParser = require("body-parser"); // Import body-parser
const { sequelize } = require("./lib/index");
const Track = require("./models/track.model");

const app = express();
const PORT = 3000;
const { parse } = require("querystring");

app.use(express.json());

app.use(bodyParser.json());

// Seed data for tracks
const tracks = [
    {
        name: "Raabta",
        genre: "Romantic",
        release_year: 2012,
        artist: "Arijit Singh",
        album: "Agent Vinod",
        duration: 4,
    },
    {
        name: "Naina Da Kya Kasoor",
        genre: "Pop",
        release_year: 2018,
        artist: "Amit Trivedi",
        album: "Andhadhun",
        duration: 3,
    },
    {
        name: "Ghoomar",
        genre: "Traditional",
        release_year: 2018,
        artist: "Shreya Ghoshal",
        album: "Padmaavat",
        duration: 3,
    },
    {
        name: "Bekhayali",
        genre: "Rock",
        release_year: 2019,
        artist: "Sachet Tandon",
        album: "Kabir Singh",
        duration: 6,
    },
    {
        name: "Hawa Banke",
        genre: "Romantic",
        release_year: 2019,
        artist: "Darshan Raval",
        album: "Hawa Banke (Single)",
        duration: 3,
    },
    {
        name: "Ghungroo",
        genre: "Dance",
        release_year: 2019,
        artist: "Arijit Singh",
        album: "War",
        duration: 5,
    },
    {
        name: "Makhna",
        genre: "Hip-Hop",
        release_year: 2019,
        artist: "Tanishk Bagchi",
        album: "Drive",
        duration: 3,
    },
    {
        name: "Tera Ban Jaunga",
        genre: "Romantic",
        release_year: 2019,
        artist: "Tulsi Kumar",
        album: "Kabir Singh",
        duration: 3,
    },
    {
        name: "First Class",
        genre: "Dance",
        release_year: 2019,
        artist: "Arijit Singh",
        album: "Kalank",
        duration: 4,
    },
    {
        name: "Kalank Title Track",
        genre: "Romantic",
        release_year: 2019,
        artist: "Arijit Singh",
        album: "Kalank",
        duration: 5,
    },
];

// Endpoint to seed the database with tracks
app.get("/seed_tracks", async (req, res) => {
    try {
        await sequelize.sync({ force: true }); // Drop and recreate the table
        await Track.bulkCreate(tracks); // Seed the tracks data
        res.status(200).json({
            message: "Tracks database seeded successfully",
        });
    } catch (error) {
        res.status(500).json({
            message: "Error seeding the tracks data",
            error: error.message,
        });
    }
});

// Exercise 1: Fetch all tracks
app.get("/tracks", async (req, res) => {
    try {
        const tracks = await Track.findAll();
        res.json({ tracks });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Exercise 2: Add a new track
app.post("/tracks/new", async (req, res) => {
    const newTrack = req.body; // Get the whole body
    try {
        const createdTrack = await Track.create(newTrack);
        res.status(201).json({ newTrack: createdTrack }); // Send status 201 for created resource
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Exercise 3: Update track information
app.put("/tracks/update/:id", async (req, res) => {
    // Use PUT for updates
    const id = req.params.id;
    const newTrackData = req.body;
    try {
        const [updated] = await Track.update(newTrackData, { where: { id } });
        if (updated) {
            const updatedTrack = await Track.findByPk(id);
            res.json({
                message: "Track updated successfully",
                updatedTrack,
            });
        } else {
            res.status(404).json({ error: "Track not found" });
        }
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Exercise 4: Delete a track
app.delete("/tracks/delete", async (req, res) => {
    // Use DELETE for deletions
    const { id } = req.body;
    try {
        const deleted = await Track.destroy({ where: { id } });
        if (deleted) {
            res.json({ message: "Track record deleted successfully" });
        } else {
            res.status(404).json({ error: "Track not found" });
        }
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
