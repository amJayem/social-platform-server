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
  const activitiesCollection = client
    .db("social-people")
    .collection("activities");

  try {
    // storing post to db
    app.post("/post", async (req, res) => {
      const post = req.body;
      const result = await postCollection.insertOne(post);
      //   console.log(post);
      res.send(result);
    });

    // getting all post from db
    app.get("/posts", async (req, res) => {
      const posts = await postCollection.find({}).toArray();
      res.send(posts);
      // console.log(posts);
    });

    // getting single post by id
    app.get("/post-details/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const result = await postCollection.findOne(filter);
      // console.log(id);
      res.send(result);
    });

    // updating like count
    app.patch("/post-like/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const like = req.body.value;
      const updateLike = { $set: { like: like } };
      const result = await postCollection.updateOne(filter, updateLike);
      console.log(like);
      res.send(result);
    });

    // save reaction to db
    app.post("/my-reaction", async (req, res) => {
      const relatedPostInfo = req.body;
      const result = await activitiesCollection.insertOne(relatedPostInfo);
      console.log(relatedPostInfo);
      res.send(result);
    });

    // getting reaction from db for single user
    app.get("/activities/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { postId: id };
      const result = await activitiesCollection.findOne(filter);
    //   console.log(result);
      if (result) {
        res.send(result);
      }
      else{
        res.send({success: 'wait'})
      }
    });
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
