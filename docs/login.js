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

main().catch(console.error);

const app = express();
const port = 3000;

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'RobloxOof2020',
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.message);
    return;
  }

  console.log('Connected to MySQL');

  // Create a new database
  connection.query('CREATE DATABASE IF NOT EXISTS Fitness_App', (createErr) => {
    if (createErr) {
      console.error('Error creating database:', createErr.message);
    } else {
      console.log('Database created or already exists');

      // Your code logic goes here

      // Close the database connection
      connection.end((endErr) => {
        if (endErr) {
          console.error('Error closing MySQL connection:', endErr.message);
        } else {
          console.log('Connection closed');
        }
      });
    }
  });
});




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

// Handle form submission
app.post('/home', (req, res) => {
  // Access form data from req.body
  const { email, password } = req.body;

  // Process the form data (e.g., store in a database, perform authentication)
  console.log('Form submitted with email:', email, 'and password:', password);

  // Send a response to the client
  res.send('Form submitted successfully!');
});

app.post('/submitSignup', (req, res) => {
  // Access form data from req.body
  const { email, password } = req.body;

  // Process the form data (e.g., store in a database, perform authentication)
  console.log('Form submitted with email:', email, 'and password:', password);

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