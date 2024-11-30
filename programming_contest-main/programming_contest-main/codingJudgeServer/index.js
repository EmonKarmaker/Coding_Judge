require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: ["http://localhost:5173", "https://educare-fe496.web.app"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// MongoDB connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@developingcluster.sfd1o.mongodb.net/?retryWrites=true&w=majority&appName=developingCluster`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Connect to the database
const dbConnect = async () => {
  try {
    await client.connect();
    console.log("DB Connected Successfully ✅");
  } catch (error) {
    console.error("DB Connection Error:", error.name, error.message);
  }
};
dbConnect();

// Ensure graceful shutdown
process.on("SIGINT", async () => {
  await client.close();
  console.log("DB Connection Closed");
  process.exit(0);
});

// Database collections
const database = client.db("eduCareDB");
const usersCollections = database.collection("usersDB");
const contestsCollections = database.collection("contestsDB");
const submittedContestsCollections = database.collection("submittedContestsDB");

// JWT Middleware
const verifyCookie = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).send({ message: "Unauthorized Access" });
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized Access" });
    }
    req.user = decoded;
    next();
  });
};

// Middleware to validate ObjectId
const validateObjectId = (req, res, next) => {
  const id = req.params.id;
  if (!ObjectId.isValid(id)) {
    return res.status(400).send({ message: "Invalid ID format" });
  }
  next();
};

// API Endpoints
app.get("/", (req, res) => {
  res.send("Server is running, data will appear soon...");
});

// JWT routes
app.post("/jwt", (req, res) => {
  try {
    const user = req.body;
    const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1h",
    });
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      })
      .send({ success: true });
  } catch (error) {
    res.status(500).send({ message: "Error generating JWT", error });
  }
});

app.post("/logout", (req, res) => {
  try {
    res.clearCookie("token", { maxAge: 0 }).send({ success: true });
  } catch (error) {
    res.status(500).send({ message: "Error during logout", error });
  }
});

// Users routes
app.get("/users", async (req, res) => {
  try {
    const result = await usersCollections.find().toArray();
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Error retrieving users", error });
  }
});

app.get("/users/:email", async (req, res) => {
  try {
    const userEmail = req.params.email;
    const query = { email: userEmail };
    const result = await usersCollections.findOne(query);
    if (!result) {
      return res.status(404).send({ message: "User not found" });
    }
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Error retrieving user", error });
  }
});

app.post("/users", async (req, res) => {
  try {
    const email = req.body.email;
    const query = { email: email };
    const existedUser = await usersCollections.findOne(query);
    if (existedUser) {
      res.json({ message: "User already exists!", success: true });
    } else {
      const user = req.body;
      const result = await usersCollections.insertOne(user);
      res.json({ message: "User registered successfully!", result });
    }
  } catch (error) {
    res.status(500).send({ message: "Error registering user", error });
  }
});

// Contests routes
app.get("/contests", async (req, res) => {
  try {
    const result = await contestsCollections.find().toArray();
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Error retrieving contests", error });
  }
});

app.get("/contests/:id", verifyCookie, validateObjectId, async (req, res) => {
  try {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await contestsCollections.findOne(query);
    if (!result) {
      return res.status(404).send({ message: "Contest not found" });
    }
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Error retrieving contest", error });
  }
});

app.post("/contests", verifyCookie, async (req, res) => {
  try {
    const contestInfo = req.body;
    const result = await contestsCollections.insertOne(contestInfo);
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Error creating contest", error });
  }
});

app.delete(
  "/contests/:id",
  verifyCookie,
  validateObjectId,
  async (req, res) => {
    try {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await contestsCollections.deleteOne(query);
      if (result.deletedCount === 0) {
        return res.status(404).send({ message: "Contest not found" });
      }
      res.send({ message: "Contest deleted successfully", success: true });
    } catch (error) {
      res.status(500).send({ message: "Error deleting contest", error });
    }
  }
);

// Submitted Contests routes
app.get("/submittedContests", async (req, res) => {
  try {
    const result = await submittedContestsCollections.find().toArray();
    res.send(result);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error retrieving submitted contests", error });
  }
});

app.get(
  "/submittedContests/:id",
  verifyCookie,
  validateObjectId,
  async (req, res) => {
    try {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await submittedContestsCollections.findOne(query);
      if (!result) {
        return res.status(404).send({ message: "Submitted contest not found" });
      }
      res.send(result);
    } catch (error) {
      res
        .status(500)
        .send({ message: "Error retrieving submitted contest", error });
    }
  }
);

app.get("/submittedContestsByUser/:email", verifyCookie, async (req, res) => {
  try {
    const submittedBy = req.params.email;
    if (req.user.email !== submittedBy) {
      return res.status(403).send({ message: "Forbidden Access" });
    }
    const query = { userEmail: submittedBy };
    const result = await submittedContestsCollections.find(query).toArray();
    res.send(result);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error retrieving user submissions", error });
  }
});

app.post("/submittedContests", verifyCookie, async (req, res) => {
  try {
    const submittedData = req.body;
    const result = await submittedContestsCollections.insertOne(submittedData);
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Error submitting contest", error });
  }
});

app.put(
  "/submittedContests/:id",
  verifyCookie,
  validateObjectId,
  async (req, res) => {
    try {
      const id = req.params.id;
      const { feedback, status } = req.body;

      if (!Array.isArray(feedback) || !status) {
        return res.status(400).send({
          message:
            "Invalid request. `feedback` must be an array, and `status` is required.",
        });
      }

      const query = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: { feedback, status },
      };

      const result = await submittedContestsCollections.updateOne(
        query,
        updateDoc
      );

      if (result.matchedCount === 0) {
        return res.status(404).send({ message: "Submitted contest not found" });
      }

      res.send({
        message: "Submitted contest updated successfully",
        success: true,
        result,
      });
    } catch (error) {
      res
        .status(500)
        .send({ message: "Error updating submitted contest", error });
    }
  }
);

// Server setup
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
