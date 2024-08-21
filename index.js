const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@database0.2qbs8g0.mongodb.net/?retryWrites=true&w=majority&appName=database0`;

// Middleware
app.use(cors());
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
    // Connect the client to the server
    await client.connect();
    const userCollection = client.db("jeebika_main").collection("users");

    app.post("/first-regi", async (req, res) => {
      console.log("Request received:", req.body);
      try {
        const newUser = req.body;
        const result = await userCollection.insertOne(newUser);
        console.log("Insert result:", result);
        res.send(result);
      } catch (error) {
        console.error("Insert error:", error);
        res.status(500).send({ error: "Failed to insert data" });
      }
    });

    // Ping MongoDB to confirm connection
    await client.db("admin").command({ ping: 1 });
    console.log("Successfully connected to MongoDB!");
  } finally {
    // Ensure that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("JBK Server June 2024 is Running!");
});

app.listen(port, () => {
  console.log(`JBK SERVER is running on port ${port}`);
});
