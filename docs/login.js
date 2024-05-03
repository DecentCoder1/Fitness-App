const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://main:xCEwUyNzOzCdzSfa@cluster0.ofinyq6.mongodb.net/';
const client = new MongoClient(uri);

const app = express();
const port = 3000;

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
  async function checkMongoDBConnection() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
        // access the collection
        const cursor = client.db("fitness-app-data").collection("logins");
        const cursor1 = cursor.find({email: email});
        // logging all results that match
        for await (const doc of cursor1) {
          // check if password is correct or if account exists
          if (doc.password == password) {
            console.log("successful");
            res.send("Logged In!");
            window.location.href = "progress.html";
          } else {
            console.log("unsuccessful");
            res.send("Something went wrong");
          }
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
  checkMongoDBConnection();
  console.log('Form submitted with email:', email, 'and password:', password);
});

// fixe submitSignup going nowhere
app.get('/submitSignup', function (req, res) {
  res.sendFile(__dirname + '/preference.html')
})

app.post('/submitSignup', (req, res) => {
  // Access form data from req.body
  const { email, fullName, password } = req.body;

  async function checkMongoDBConnection() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
        const cursor = client.db("fitness-app-data").collection("logins");
        const doc = { email: email, name: fullName, password: password};
        await cursor.insertOne(doc);
        console.log("successful");
        res.send("successful");
        sessionStorage.setItem('email', email);
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    } finally {
    // Close the connection when done
    await client.close();
    console.log("Connection closed");
    }
  }
  checkMongoDBConnection();

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

// add a list of buttons for different exercise types (saves time for communication)
// coach can see the excercise type summary for each user
// user enter availability and match with the gym's time
// sizing issues


// pushing to github online: git push -u https://github.com/DecentCoder1/Fitness-App.git main
// connecting to mongodb playground: mongodb+srv://main:xCEwUyNzOzCdzSfa@cluster0.ofinyq6.mongodb.net/