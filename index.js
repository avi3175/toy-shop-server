require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5000

// MOIDDLEWARE

app.use(cors())
app.use(express.json())

// console.log(process.env.DB_PASS)

// MONGODB

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.f2tn7zt.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const toysCollection = client.db('toyWorld').collection('toys')
    const addToyCollection = client.db('toyWorld').collection('addtoy')


    app.get('/toys',async(req,res)=>{
        const cursor = toysCollection.find()
        const result = await cursor.toArray()
        res.send(result)
    })


    app.get('/toys/:id',async(req,res)=>{
        const id = req.params.id
        const query = { _id: new ObjectId(id)}
        const result = await toysCollection.findOne(query)
        res.send(result)
    })


    //ADDTOY

    // 1. THIS IS FOR GETTING ALL THE DATA
    app.get('/addtoy',async(req,res)=>{
      const result = await addToyCollection.find().toArray()
      res.send(result)
    })

  //  2.THIS IS FOR GETTING SPECIFIC DATA

  app.get('/addstoy',async(req,res)=>{
    console.log(req.query.email)
    let query = {}
    if(req.query?.email){
      query={email:req.query.email}
    }
    const result = await addToyCollection.find(query).toArray()
    res.send(result)
  })

    app.post('/addtoy',async(req,res)=>{
      const add = req.body
      console.log(add)
      const result = await addToyCollection.insertOne(add)
      res.send(result)
    })








    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);







app.get('/',(req,res)=>{
        res.send('CAR IS RUNNING')
})

app.listen(port,()=>{
    console.log(`car is running on the port${port}`)
})