const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require("mongodb");

const uri = `mongodb+srv://getSnappyDbUser:8DWUqt7WtqpYEsWn@cluster0.wgjxpn1.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

// middleware
app.use(cors());

app.get("/", (req, res) => {
  res.send("Yes, server is working");
});

app.listen(port, () => {
  console.log("server is running on port :", port);
});
