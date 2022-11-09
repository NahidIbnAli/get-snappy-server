const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require("mongodb");

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

    app.get("/services", async (req, res) => {
      const isLimited = req.query.limited;
      const query = {};
      let count = 0;
      if (isLimited) {
        count = 3;
      }
      const cursor = serviceCollection.find(query).limit(count);
      const services = await cursor.toArray();
      res.send(services);
      console.log(services);
    });
  } finally {
  }
}
run().catch((error) => console.error(error));

app.listen(port, () => {
  console.log("server is running on port :", port);
});
