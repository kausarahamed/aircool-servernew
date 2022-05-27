const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
const port = process.env.PORT || 5000;
const app = express();
require("dotenv").config();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zhibv.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
    await client.connect();
    const airCollection = client.db("aircool").collection("air");
    const orderCollection = client.db("aircool").collection("order");
    const userCollection = client.db("aircool").collection("user");
    const addReviewCollection = client.db("aircool").collection("review");
    const adminProductCollection = client.db("aircool").collection("product");
    app.get("/purchase/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await adminProductCollection.findOne(query);
      res.send(result);
    });
    app.get("/product", async (req, res) => {
      const query = {};
      const cursor = airCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    app.post("/order", async (req, res) => {
      const product = req.body.order;
      const result = await orderCollection.insertOne(product);
      res.send(result);
    });

    app.put("/user/:email", async (req, res) => {
      const email = req.params.email;
      const profile = req.body;
      const query = { email };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          name: profile.name,
          email: profile.email,
          education: profile.education,
          number: profile.number,
          address: profile.address,
          linkedin: profile.linkedin,
        },
      };
      const result = await userCollection.updateOne(query, updateDoc, options);
      res.send(result);
    });

    app.get("/user/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email };
      const result = await userCollection.findOne(query);
      res.send(result);
    });
    //ADD Review
    app.post("/addreview", async (req, res) => {
      const review = req.body;

      const result = await addReviewCollection.insertOne(review);
      res.send(result);
    });

    //ADD Review
    app.get("/addreview", async (req, res) => {
      const result = await addReviewCollection.find().toArray();
      res.send(result);
    });

    // add product admin
    app.post("/addProduct", async (req, res) => {
      const product = req.body;
      const result = await adminProductCollection.insertOne(product);
      res.send(result);
    });

    app.get("/items", async (req, res) => {
      const cursor = adminProductCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    app.delete("/items/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await adminProductCollection.deleteOne(query);
      res.send(result);
    });
    app.get("/order", async (req, res) => {
      const cursor = orderCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    app.delete("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await orderCollection.deleteOne(query);
      res.send(result);
    });
    // admin
    app.delete("/user/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await userCollection.deleteOne(query);
      res.send(result);
    });
    app.get("/users", async (req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result);
    });
    // payment
    app.get("/order/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await orderCollection.findOne(query);
      res.send(result);
    });
  } finally {
    //    client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Running ac Server solve....ha...");
});

app.listen(port, () => {
  console.log("Listening to port", port);
});
