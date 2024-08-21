const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@database0.2qbs8g0.mongodb.net/?retryWrites=true&w=majority&appName=database0`;

// CORS configuration
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://jeebika.com",
    "https://jeebika.onrender.com",
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"],
};

app.use(cors(corsOptions));
app.use(express.json());

// Create a MongoClient
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const userCollection = client.db("jeebika_main").collection("users");

    // POST route to add a new user
    app.post("/registration", async (req, res) => {
      const newUser = req.body;
      console.log(newUser);
      try {
        const result = await userCollection.insertOne(newUser);
        res.status(201).send(result);
      } catch (error) {
        console.error("Error inserting user:", error);
        res.status(500).send({ error: "Error inserting user" });
      }
    });

    // GET route to retrieve users
    app.get("/registration", async (req, res) => {
      try {
        const users = await userCollection.find({}).toArray();
        res.status(200).send(users);
      } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).send({ error: "Error fetching users" });
      }
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error); // Log connection errors
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("JBK Server June 2024 is Running!");
});

app.listen(port, () => {
  console.log(`JBK SERVER is running on port ${port}`);
});
