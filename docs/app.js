const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const session = require('express-session');
const redis = require('ioredis');
const path = require('path');

var redisClient = redis.createClient({host:'localhost',port:6379,username:'bruh',password:'moment'});

redisClient.on('connect',() => {
    console.log('connected to redis successfully!');
})

redisClient.on('error',(error) => {
    console.log('Redis connection error :', error);
})

module.exports = redisClient;


// MongoDB client setup
const uri = 'mongodb+srv://main:xCEwUyNzOzCdzSfa@cluster0.ofinyq6.mongodb.net/fitness-app-data?retryWrites=true&w=majority';
const client = new MongoClient(uri);

const app = express();
const port = 3000;

// Use a manually defined secret key
const secretKey = 'dakjlnqewuoizxvmkajlqiuoy'; // Replace with a strong, random string

let redisStore = new RedisStore({
    client: redisClient,
});

app.use(
   session({
     store: redisStore,
     secret: secretKey,
     resave: false,
     saveUninitialized: false,
     cookie: {
       secure: false,
    },
  })
);

app.use(express.static(path.join(__dirname))); // Serve static files from the root directory
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname)); // Use the root directory for views

// Middleware to handle database connection
app.use(async (req, res, next) => {
  if (!client.isConnected()) {
    await client.connect();
  }
  req.db = client.db("fitness-app-data");
  next();
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/home', async (req, res) => {
  const { email, password } = req.body;

  try {
    const cursor = req.db.collection("logins");
    const user = await cursor.findOne({ email: email });

    if (user && user.password === password) {
      req.session.userId = user._id.toString(); // Store user ID in session
      res.redirect('/progress');
    } else {
      res.send("Invalid email or password");
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/progress', (req, res) => {
  if (!req.session.userId) {
    res.redirect('/');
  } else {
    res.sendFile(path.join(__dirname, 'progress.html'));
  }
});

app.get('/submitSignup', (req, res) => {
  res.sendFile(path.join(__dirname, 'signup.html'));
});

app.post('/submitSignup', async (req, res) => {
  const { email, fullName, password, coach } = req.body;

  try {
    const cursor = req.db.collection("logins");
    await cursor.insertOne({ email: email, name: fullName, password: password, userType: coach ? "coach" : "user" });
    res.redirect('/');
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
