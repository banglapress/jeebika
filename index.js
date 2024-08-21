const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@database0.2qbs8g0.mongodb.net/?retryWrites=true&w=majority&appName=database0`;

//middleware
app.use(cors());
app.use(express.json());

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const userSchema = new mongoose.Schema({
  fullName: String,
  username: { type: String, unique: true },
  email: String,
  phone: String,
  education: String,
  dob: Date,
  gender: String,
  password: String,
});

// Create a User Model
const User = mongoose.model("User", userSchema);

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const userCollection = client.db("jeebika_main").collection("users");

    app.post("/first-regi", async (req, res) => {
      const newUser = req.body;
      console.log(newUser);
      const result = await userCollection.insertOne(newUser);
      res.send(result);
    });

    const existingUser = await User.findOne({ username: req.body.username });
    if (existingUser) {
        return res.status(400).json({ username: 'Username is already taken' });
    }

    

    // Save the new user
    const newUser = new User(req.body);
    await newUser.save();

    res.status(200).send('User registered successfully');
} catch (err) {
    console.error('Error registering new user:', err);
    res.status(500).send('Error registering new user');
}

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
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
