const express = require("express");
const { sequelize } = require("./lib/index");
const Post = require("./models/post.model");

const app = express();
const PORT = 3000;

app.use(express.json());

const seedPosts = [
  {
    title: "Getting Started with Node.js",
    content:
      "This post will guide you through the basics of Node.js and how to set up a Node.js project.",
    author: "Alice Smith",
  },
  {
    title: "Advanced Express.js Techniques",
    content:
      "Learn advanced techniques and best practices for building applications with Express.js.",
    author: "Bob Johnson",
  },
  {
    title: "ORM with Sequelize",
    content:
      "An introduction to using Sequelize as an ORM for Node.js applications.",
    author: "Charlie Brown",
  },
  {
    title: "Boost Your JavaScript Skills",
    content:
      "A collection of useful tips and tricks to improve your JavaScript programming.",
    author: "Dana White",
  },
  {
    title: "Designing RESTful Services",
    content: "Guidelines and best practices for designing RESTful APIs.",
    author: "Evan Davis",
  },
  {
    title: "Mastering Asynchronous JavaScript",
    content:
      "Understand the concepts and patterns for writing asynchronous code in JavaScript.",
    author: "Fiona Green",
  },
  {
    title: "Modern Front-end Technologies",
    content:
      "Explore the latest tools and frameworks for front-end development.",
    author: "George King",
  },
  {
    title: "Advanced CSS Layouts",
    content: "Learn how to create complex layouts using CSS Grid and Flexbox.",
    author: "Hannah Lewis",
  },
  {
    title: "Getting Started with React",
    content: "A beginner's guide to building user interfaces with React.",
    author: "Ian Clark",
  },
  {
    title: "Writing Testable JavaScript Code",
    content:
      "An introduction to unit testing and test-driven development in JavaScript.",
    author: "Jane Miller",
  },
];

// Seed the database
app.get("/seed_db", async (req, res) => {
  try {
    await sequelize.sync({ force: true });
    await Post.bulkCreate(seedPosts);
    res.status(200).json({ message: "Database seeded successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error seeding the data", error: error.message });
  }
});

// Fetch all posts
app.get("/posts", async (req, res) => {
  try {
    const posts = await Post.findAll();
    res.status(200).json({ posts });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching posts", error: error.message });
  }
});

// Add a new post
app.post("/posts/new", async (req, res) => {
  try {
    const { title, content, author } = req.body;
    if (!title || !content || !author) {
      return res
        .status(400)
        .json({ message: "Title, content, and author are required fields." });
    }

    const newPost = await Post.create({ title, content, author });
    res.status(201).json({ message: "New post created successfully", newPost });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding new post", error: error.message });
  }
});

// Update a post by ID
app.put("/posts/update/:id", async (req, res) => {
  const id = req.params.id;
  const newPostData = req.body;

  try {
    const post = await Post.findByPk(id);
    if (post) {
      await post.update(newPostData);
      res
        .status(200)
        .json({ message: "Post updated successfully", updatedPost: post });
    } else {
      res.status(404).json({ message: "Post not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating post", error: error.message });
  }
});

// Delete a post by ID
app.delete("/posts/delete", async (req, res) => {
  const { id } = req.body;
  try {
    if (!id) {
      return res.status(400).json({ message: "ID is required for deletion." });
    }

    const post = await Post.findByPk(id);
    if (post) {
      await post.destroy();
      res.status(200).json({ message: "Post record deleted successfully" });
    } else {
      res.status(404).json({ message: "Post not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting post", error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
