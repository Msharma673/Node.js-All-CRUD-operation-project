const express = require("express");
const bodyParser = require("body-parser");
const { sequelize } = require("./lib/index");
const { user, track, like } = require("./models");

let { Op } = require("@sequelize/core");

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.json());

const trackData = [
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

app.get("/seed_db", async (req, res) => {
  try {
    await sequelize.sync({ force: true });
    await user.create({
      username: "testuser",
      email: "testuser@gmail.com",
      password: "testuser",
    });

    await track.bulkCreate(trackData);
    res.status(200).json({ message: "Database Seeding successful" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error seeding the data", error: error.message });
  }
});

async function likeTrack(userId, trackId) {
  const newLike = await like.create({ userId, trackId });
  return { message: "Track liked", newLike };
}

// Endpoint to like a track
app.get("/users/:id/like", async (req, res) => {
  try {
    const userId = req.params.id;
    const trackId = req.query.trackId;
    const response = await likeTrack(userId, trackId);
    res.status(200).json(response);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error liking track", error: error.message });
  }
});

// Helper function to dislike a track
async function dislikeTrack(userId, trackId) {
  await like.destroy({ where: { userId, trackId } });
  return { message: "Track disliked" };
}

// Endpoint to dislike a track
app.get("/users/:id/dislike", async (req, res) => {
  try {
    const userId = req.params.id;
    const trackId = req.query.trackId;
    const response = await dislikeTrack(userId, trackId);
    res.status(200).json(response);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error disliking track", error: error.message });
  }
});

// Helper function to get all liked tracks
async function getAllLikedTracks(userId) {
  const likedTracks = await Track.findAll({
    include: {
      model: User,
      where: { id: userId },
      through: { attributes: [] },
    },
  });
  return { likedTracks };
}

async function getAllLikedTracks(userId) {
  let trackIds = await like.findAll({
    where: { userId },
    attributes: ["trackId"],
  });
  let trackRecords = [];
  for (let i = 0; i < trackIds.length; i++) {
    trackRecords.push(trackIds[i].trackId);
  }

  let likedTracks = await track.findAll({
    where: { id: { [Op.in]: trackRecords } },
  });
  return { likedTracks };
}

app.get("/users/:id/liked", async (req, res) => {
  try {
    let userId = req.params.id;
    let response = await getAllLikedTracks(userId);
    if (response.likedTracks.length === 0) {
      return res.status(404).json({ message: "No liked tracks found." });
    }
    return res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function getAllLikedTracksByArtist(userId, artist) {
  let trackIds = await like.findAll({
    where: { userId },
    attributes: ["trackId"],
  });
  let trackRecords = [];
  for (let i = 0; i < trackIds.length; i++) {
    trackRecords.push(trackIds[i].trackId);
  }

  let likedTracks = await track.findAll({
    where: { id: { [Op.in]: trackRecords }, artist },
  });

  return { likedTracks };
}

app.get("/users/:id/liked-artists", async (req, res) => {
  try {
    let userId = req.params.id;
    let artist = req.query.artist;

    let response = await getAllLikedTracksByArtist(userId, artist);

    if (response.likedTracks.length === 0) {
      return res
        .status(404)
        .json({ message: "No liked tracks found by " + artist });
    }
    return res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
