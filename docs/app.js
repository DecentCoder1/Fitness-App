const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const path = require('path');

const uri = 'mongodb+srv://main:xCEwUyNzOzCdzSfa@cluster0.ofinyq6.mongodb.net/fitness-app-data?retryWrites=true&w=majority';
const client = new MongoClient(uri);

const app = express();
const port = 3000;

// Secret key for JWT
const secretKey = 'dakjlnqewuoizxvmkajlqiuoy'; // Replace with a strong, random string

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

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/home', async (req, res) => {
  const { email, password } = req.body;

  try {
    const cursor = req.db.collection("logins");
    const user = await cursor.findOne({ email: email });

    if (user && bcrypt.compareSync(password, user.password)) {
      const token = jwt.sign({ userId: user._id.toString(), email: user.email }, secretKey, { expiresIn: '1h' });
      res.json({ token });
    } else {
      res.send("Invalid email or password");
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/progress', authenticateToken, (req, res) => {
  res.sendFile(path.join(__dirname, 'progress.html'));
});

app.get('/submitSignup', (req, res) => {
  res.sendFile(path.join(__dirname, 'signup.html'));
});

app.post('/submitSignup', async (req, res) => {
  const { email, fullName, password, coach } = req.body;

  try {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const cursor = req.db.collection("logins");
    await cursor.insertOne({ email: email, name: fullName, password: hashedPassword, userType: coach ? "coach" : "user" });
    res.redirect('/');
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});