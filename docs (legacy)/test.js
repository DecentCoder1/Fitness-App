const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000;

const uri = 'mongodb+srv://main:xCEwUyNzOzCdzSfa@cluster0.ofinyq6.mongodb.net/';
const client = new MongoClient(uri);
app.use(express.static('docs'));
async function checkMongoDBConnection() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
        // access the collection
        const cursor = client.db("fitness-app-data").collection("logins");
        const doc = { email: "derekcheng33@gmail.com", name: "derek", password: "dfjdsalfjaldsn,mnb" };
        await cursor.insertOne(doc);
        // find with specific property
        const cursor1 = cursor.find({email: "25DerekC@students.tas.tw"});
        // logging all results that match
        for await (const doc of cursor1) {
            console.log(doc);
        }
        // logging all results that match can also be done like this
        // await cursor.forEach(console.log);
        
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    } finally {
    // Close the connection when done
    await client.close();
    console.log("Connection closed");
    }
}
// Call the function to check MongoDB connection
checkMongoDBConnection();

// cd to docs and run node test.js