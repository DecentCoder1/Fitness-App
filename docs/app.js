const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const path = require('path');

const uri = 'mongodb+srv://main:xCEwUyNzOzCdzSfa@cluster0.ofinyq6.mongodb.net/fitness-app-data?retryWrites=true&w=majority';
const client = new MongoClient(uri);

const app = express();
const port = 8080;

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
    await client.connect();
    req.db = client.db("fitness-app-data");
    next();
});

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  var token = localStorage.getItem('token');

  if (!token) return res.sendStatus(401);

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Route to get user ID
app.get('/getUserId', authenticateToken, (req, res) => {
  console.log('Authenticated user:', req.user); // Debugging log
  const userId = req.user.userId;
  res.json({ userId });
});


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/home', async (req, res) => {
  const { email, password } = req.body;

  console.log('Received login request:', { email, password });

  try {
    const cursor = req.db.collection("logins");
    const user = await cursor.findOne({ email: email });

    console.log('Database query result:', user);

    if (user) {
      console.log('Comparing passwords:', { provided: password, stored: user.password });

      if (password === user.password) {
        const token = jwt.sign({ userId: user._id.toString(), email: user.email }, secretKey, { expiresIn: '12h' });
        res.send(`
          <script>
            const token = "${token}";
            console.log('Generated token:', token);
            localStorage.setItem('token', token); // Store token in localStorage for later use
            window.location.href = '/profile';
          </script>
        `);
      } else {
        res.send("Invalid email or password");
        console.log('Password mismatch:', { provided: password, stored: user.password });
      }
    } else {
      res.send("Invalid email or password");
      console.log('User not found:', { email });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/profile', (req, res) => {
  res.sendFile(path.join(__dirname, 'profile.html'));
});

app.get('/progress', authenticateToken, (req, res) => {
  res.render('progress')
});

app.get('/composition', (req, res) => {
  res.sendFile(path.join(__dirname, 'composition.html'));
});

app.get('/scheduling', (req, res) => {
  res.sendFile(path.join(__dirname, 'scheduling.html'));
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