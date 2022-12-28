const express = require("express");
require("dotenv").config();
const port = process.env.PORT || 5000;
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
// middle wares
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.42e2srw.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  const postCollection = client.db("social-people").collection("posts");

  try {
    // storing post to db
    app.post("/post", async (req, res) => {
      const post = req.body;
      const result = await postCollection.insertOne(post);
    //   console.log(post);
      res.send(result)
    });

    // getting all post from db
    app.get('/posts', async(req, res)=>{
        const posts = await postCollection.find({}).toArray();
        res.send(posts);
        // console.log(posts);
    })
  } finally {
  }
};

run().catch((e) => {
  console.error("run error => ", e.message);
});

app.get("/", (req, res) => {
  res.send("SOCIAL PEOPLE server is running");
});

app.listen(port, () => {
  console.log("server running on: ", port);
});
