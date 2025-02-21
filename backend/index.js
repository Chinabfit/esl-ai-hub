const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { OpenAI } = require("openai");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const path = require("path");
const socketIo = require("socket.io");
const http = require("http");
const fs = require("fs");

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const port = process.env.PORT || 5000;
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected to Atlas"))
  .catch((error) => console.error("MongoDB connection error:", error));

// User Schema
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});
const User = mongoose.model("User", UserSchema);

// Middleware for authentication
const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ error: "Access denied" });
  try {
    const verified = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ error: "Invalid token" });
  }
};

// File Upload Configuration (to store files in local storage)
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({ storage });
app.post("/upload", authenticateToken, upload.single("file"), (req, res) => {
  res.json({ filePath: req.file.path });
});

// AI Content Generation Endpoint
app.post("/generate-content", authenticateToken, async (req, res) => {
  try {
    const { prompt } = req.body;
    const openai = new OpenAI(process.env.OPENAI_API_KEY);
    const response = await openai.completions.create({
      model: "gpt-4",
      prompt: prompt,
      max_tokens: 500,
    });
    res.json({ content: response.choices[0].text });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Stripe Payment Integration
app.post("/create-payment-intent", async (req, res) => {
  try {
    const { amount, currency } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { OpenAI } = require("openai");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const path = require("path");
const socketIo = require("socket.io");
const http = require("http");
const fs = require("fs");

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const port = process.env.PORT || 5000;
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected to Atlas"))
  .catch((error) => console.error("MongoDB connection error:", error));

// User Schema
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});
const User = mongoose.model("User", UserSchema);

// Middleware for authentication
const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ error: "Access denied" });
  try {
    const verified = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ error: "Invalid token" });
  }
};

// File Upload Configuration (to store files in local storage)
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({ storage });
app.post("/upload", authenticateToken, upload.single("file"), (req, res) => {
  res.json({ filePath: req.file.path });
});

// AI Content Generation Endpoint
app.post("/generate-content", authenticateToken, async (req, res) => {
  try {
    const { prompt } = req.body;
    const openai = new OpenAI(process.env.OPENAI_API_KEY);
    const response = await openai.completions.create({
      model: "gpt-4",
      prompt: prompt,
      max_tokens: 500,
    });
    res.json({ content: response.choices[0].text });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Stripe Payment Integration
app.post("/create-payment-intent", async (req, res) => {
  try {
    const { amount, currency } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
