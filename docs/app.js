const express = require('express');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { ObjectId } = require('mongodb');
require('dotenv').config(); // Load environment variables

const app = express();
const clientPort = process.env.CLIENT_PORT || 8080; // Use CLIENT_PORT from .env

// Secret key for JWT
const secretKey = process.env.JWT_SECRET || 'default_secret_key'; // Fallback for JWT_SECRET

// Middleware
app.use(express.static(path.join(__dirname))); // Serve static files
app.use(express.json()); // Parse incoming JSON requests
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname));

// JWT Authentication Middleware
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Bearer token
  if (!token) return res.sendStatus(401); // Unauthorized

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.sendStatus(403); // Forbidden
    req.user = user;
    next();
  });
};

// Routes
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

app.get('/profile', (req, res) => {
  res.sendFile(path.join(__dirname, 'profile.html'));
});

app.get('/progress', (req, res) => {
  res.render('progress');
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

app.post('/home', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await req.db.findOne({ email });
    if (user && bcrypt.compareSync(password, user.password)) {
      const token = jwt.sign({ userId: user._id, email: user.email }, secretKey, { expiresIn: '12h' });
      res.send(`
        <script>
          localStorage.setItem('token', "${token}");
          window.location.href = '/profile';
        </script>
      `);
    } else {
      res.send('Invalid email or password');
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/submitSignup', async (req, res) => {
  const { email, fullName, password, coach } = req.body;
  try {
    const hashedPassword = bcrypt.hashSync(password, 10);
    await req.db.insertOne({
      email,
      name: fullName,
      password: hashedPassword,
      isCoach: coach ? 'coach' : 'user',
    });
    res.redirect('/');
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/save-exercises', async (req, res) => {
  const { userId, exerciseList } = req.body;
  try {
    const updateResult = await req.db.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { exercises: exerciseList } }
    );
    res.json(updateResult);
  } catch (error) {
    console.error('Error saving exercises:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/find-overlap', async (req, res) => {
  const { userId1, userId2 } = req.body;
  try {
    const user1 = await req.db.findOne({ _id: new ObjectId(userId1) });
    const user2 = await req.db.findOne({ _id: new ObjectId(userId2) });

    const overlaps = user1.timeslots.map((slot, index) =>
      slot.filter(timeSlot => user2.timeslots[index]?.includes(timeSlot))
    );

    res.json({ overlaps });
  } catch (error) {
    console.error('Error finding overlaps:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the client server
app.listen(clientPort, () => console.log(`Client is running at http://localhost:${clientPort}`));
