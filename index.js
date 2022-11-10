const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.wgjxpn1.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

app.get("/", (req, res) => {
  res.send("Yes, server is working");
});

async function run() {
  try {
    const serviceCollection = client.db("getSnappy").collection("services");
    const reviewCollection = client.db("getSnappy").collection("reviews");

    app.get("/services", async (req, res) => {
      const query = {};
      let count = 0;
      if (req.query.limited) {
        count = 3;
      }
      const cursor = serviceCollection.find(query).limit(count);
      const services = await cursor.toArray();
      res.send(services);
    });

    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await serviceCollection.findOne(query);
      res.send(service);
    });

    app.post("/reviews", async (req, res) => {
      const review = req.body;
      const result = await reviewCollection.insertOne(review);
      res.send(result);
    });

    app.get("/reviews", async (req, res) => {
      let query = {};
      if (req.query.id) {
        query = {
          serviceId: req.query.id,
        };
      }
      if (req.query.email) {
        query = {
          email: req.query.email,
        };
      }
      const cursor = reviewCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post("/services", async (req, res) => {
      const service = req.body;
      const result = await serviceCollection.insertOne(service);
      res.send(result);
    });

    app.delete("/reviews/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await reviewCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
  }
}
run().catch((error) => console.error(error));

app.listen(port, () => {
  console.log("server is running on port :", port);
});
