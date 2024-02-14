const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const { MongoClient } = require('mongodb');

async function listDatabases(client){
  databasesList = await client.db().fitness-app-data().listDatabases();

  console.log("Databases:");
  databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};

async function main(){
  const uri = "mongodb+srv://main:xCEwUyNzOzCdzSfa@cluster0.ofinyq6.mongodb.net/?retryWrites=true&w=majority";
  const client = new MongoClient(uri);

  try {
      // Connect to the MongoDB cluster
      await client.connect();

      // Make the appropriate DB calls
      await  listDatabases(client);

  } catch (e) {
      console.error(e);
  } finally {
      await client.close();
  }
}

async function createListing(client, collectionName, newListing){
  const result = await client.db("fitness-app-data").collection(collectionName).insertOne(newListing);
  console.log(`New listing created with the following id: ${result.insertedId}`);
}

async function findOneListingByName(client, collectionName, nameOfListing) {
  const result = await client.db("fitness-app-data").collection(collectionName).findOne({ email: nameOfListing });

  if (result) {
      return result;
  } else {
      return 0;
  }
}

main().catch(console.error);

const app = express();
const port = 3000;

// const connection = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: 'RobloxOof2020',
// });

// Serve static files (e.g., HTML, CSS) from the "public" folder
app.use(express.static('docs'));

// Parse incoming requests with JSON payloads
app.use(bodyParser.json());

// Parse incoming requests with urlencoded payloads
app.use(bodyParser.urlencoded({ extended: true }));

// Serve the HTML file
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Handle sign in submission
app.post('/home', (req, res) => {
  // Access form data from req.body
  const { email, password } = req.body;

  // Process the form data (e.g., store in a database, perform authentication)
  data = findOneListingByName(client, "logins", {
    email: email
  })
  if (data == 0) {
    window.location.href = "signup.html";
    return 0;
  } else if (data != 0) {
    if (data["password"] != password) {
      console.log("incorrect password");
      return 0;
    }
  }
  console.log('Form submitted with email:', email, 'and password:', password);

  // Send a response to the client
  res.send('Form submitted successfully!');
});

app.post('/submitSignup', (req, res) => {
  // Access form data from req.body
  const { email, name, password } = req.body;

  // Process the form data (e.g., store in a database, perform authentication)
  createListing(client, "logins", {
        email: email,
        name: name,
        password: password
    }
);

  // Send a response to the client
  res.send('Form submitted successfully!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});



function forgotPassword() {
  // implement forgotPassword
}


function switchToSignup() {
    window.location.href="signup.html";
}

function switchToSignin() {
  window.location.href="index.html"
}

// pushing to github online: git push -u https://github.com/DecentCoder1/Fitness-App.git main
// connecting to mongodb playground: mongodb+srv://main:xCEwUyNzOzCdzSfa@cluster0.ofinyq6.mongodb.net/