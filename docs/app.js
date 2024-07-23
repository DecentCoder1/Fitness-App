const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const { MongoClient } = require('mongodb');
const MongoDBStore = require('connect-mongodb-session')(session);
const path = require('path');

const uri = 'mongodb+srv://main:xCEwUyNzOzCdzSfa@cluster0.ofinyq6.mongodb.net/';
const client = new MongoClient(uri);

const app = express();
const port = 3000;

// Use a manually defined secret key
const secretKey = 'dakjlnqewuoizxvmkajlqiuoy'; // Replace with a strong, random string

// Create a MongoDB session store
const store = new MongoDBStore({
  uri: uri,
  collection: 'mySessions'
});

// Catch errors
store.on('error', function(error) {
  console.error(error);
});

app.use(session({
  secret: secretKey,
  resave: false,
  saveUninitialized: true,
  store: store,
  cookie: { secure: false }
}));

app.use(express.static(path.join(__dirname))); // Serve static files from the root directory
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname)); // Use the root directory for views

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/home', async (req, res) => {
  const { email, password } = req.body;

  try {
    await client.connect();
    const cursor = client.db("fitness-app-data").collection("logins");
    const user = await cursor.findOne({ email: email });

    if (user && user.password === password) {
      req.session.userId = user._id.toString(); // Store user ID in session
      res.redirect('/progress');
    } else {
      res.send("Invalid email or password");
    }
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    res.status(500).send('Internal Server Error');
  } finally {
    await client.close();
  }
});

app.get('/progress', (req, res) => {
  if (!req.session.userId) {
    res.redirect('/');
  } else {
    res.sendFile(path.join(__dirname, 'progress.html'));
  }
});

app.get('/profile', (req, res) => {
  if (!req.session.userId) {
    res.redirect('/');
  } else {
    res.sendFile(path.join(__dirname, 'profile.html'));
  }
});

app.get('/composition', (req, res) => {
  if (!req.session.userId) {
    res.redirect('/');
  } else {
    res.sendFile(path.join(__dirname, 'composition.html'));
  }
});

app.get('/preference', (req, res) => {
  if (!req.session.userId) {
    res.redirect('/');
  } else {
    res.sendFile(path.join(__dirname, 'preference.html'));
  }
});

app.get('/submitSignup', (req, res) => {
  res.sendFile(path.join(__dirname, 'signup.html'));
});

app.post('/submitSignup', async (req, res) => {
  const { email, fullName, password, coach } = req.body;

  try {
    await client.connect();
    const cursor = client.db("fitness-app-data").collection("logins");
    await cursor.insertOne({ email: email, name: fullName, password: password, userType: coach ? "coach" : "user" });
    res.redirect('/');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    res.status(500).send('Internal Server Error');
  } finally {
    await client.close();
  }
});

// New route to get the userId from the session
app.get('/getUserId', (req, res) => {
  if (req.session.userId) {
    res.json({ userId: req.session.userId });
  } else {
    res.status(401).send('Not logged in');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
