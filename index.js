const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());
// ******************************

/**
 *
 *
 *
 */

// console.log(process.env.DB_COFFEE_USER);
// console.log(process.env.DB_COFFEE_PASS);
const uri = `mongodb+srv://${process.env.DB_COFFEE_USER}:${process.env.DB_COFFEE_PASS}@cluster0.pc8mx8l.mongodb.net/?appName=Cluster0`;
console.log(uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // send data {which was sent from client side}  to mondo DATABASe{step-2}
    // create collection and db name
    const coffeeCollection = client.db("coffeeDB").collection("coffee");
    // get data from database and create an api
    app.get("/coffee", async (req, res) => {
      const cursor = coffeeCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    // ******
    // to get specific data by id for update

    app.get("/coffee/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeeCollection.findOne(query);
      res.send(result);
    });
    // ********

    // create post to receive data from client side {step-1}
    app.post("/coffee", async (req, res) => {
      const newCoffee = req.body;
      console.log(newCoffee);
      // newCoffee came from client side{step-3}
      const result = await coffeeCollection.insertOne(newCoffee);
      res.send(result);
    });

    // put or patch for updating data

    app.put("/coffee/:id", async (req, res) => {
      const id = req.params.id;
      const coffeeUpdate = req.body;
      console.log(id, coffeeUpdate);
      // add updated value to database
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedCoffee = {
        $set: {
          name: coffeeUpdate.name,
          chef: coffeeUpdate.chef,
          details: coffeeUpdate.details,
          supplier: coffeeUpdate.supplier,
          category: coffeeUpdate.category,
          taste: coffeeUpdate.taste,
          photo: coffeeUpdate.photo,
          
        },
      };
      const result = await coffeeCollection.updateOne(
        filter,
        updatedCoffee,
        options
      );
      res.send(result);
    });

    // delete data from database
    // Delete data ************************

    app.delete("/coffee/:id", async (req, res) => {
      const id = req.params.id;
      console.log(" delete data from database", id);
      // const query = {id: ObjectId(id)}
      const result = await coffeeCollection.deleteOne({
        _id: new ObjectId(id),
      });
      res.json({
        data: result,
      });
    });

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
  res.send("coffee server is running");
});
app.listen(port, () => {
  console.log(`server is running on port : ${port}`);
});
