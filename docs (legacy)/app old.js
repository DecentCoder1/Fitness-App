const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient, ObjectId } = require('mongodb');
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

// Connect to MongoDB once and reuse the connection
async function connectToDatabase() {
  if (!client.topology || !client.topology.isConnected()) {
    await client.connect();
  }
  return client.db("fitness-app-data");
}

// Middleware to handle database connection
app.use(async (req, res, next) => {
  req.db = await connectToDatabase();
  next();
});

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer token

  if (!token) return res.sendStatus(401); // Unauthorized if token is missing

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.sendStatus(403); // Forbidden if token is invalid
    req.user = user;
    next();
  });
};


// Route to get user ID
app.get('/getUserId', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization header is missing' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, secretKey);
    res.json({ userId: decoded.userId });
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
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

app.get('/progress', (req, res) => {
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
    await cursor.insertOne({ email: email, name: fullName, password: hashedPassword, isCoach: coach ? "coach" : "user" });
    res.redirect('/');
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post("/save-exercises", async (req, res) => {
  const { userId, excerciseList } = req.body;
  
  try {
    const database = await connectToDatabase();
    const collection = database.collection('logins');

    // Example ObjectId string
    const objectId = new ObjectId(userId);

    // Find the document by ObjectId
    const user = await collection.findOne({ _id: objectId });
    console.log('User:', user);

    // Update the document by ObjectId
    const updateResult = await collection.updateOne(
      { _id: objectId },
      { $set: { exercises: excerciseList } } // Replace with the new exercises data
    );
    console.log('Update Result:', updateResult);

  } catch (error) {
    console.error('Error:', error);
  }
});

app.post('/getUserType', async (req, res) => {

  try {
    const database = await connectToDatabase();
    const collection = database.collection('logins');

    let coachList = [];

    // Find all users where isCoach is true and append their userId to coachList
    await collection.find({ isCoach: true }).forEach(function(doc) {
      coachList.push(doc._id.toString()); // Assuming _id is ObjectId, convert it to string
    });

    res.json({ coachList });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to fetch coaches' });
  }
});




app.post("/save-scheduling", async (req, res) => {
  const { userId, schedulingList } = req.body;

  try {
    const database = await connectToDatabase();
    const collection = database.collection('logins');

    // Update the document by ObjectId
    const updateResult = await collection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { timeslots: schedulingList } } // Replace with the new scheduling list
    );
    console.log('Update Result:', updateResult);
  } catch (error) {
    console.error('Error:', error);
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

app.post('/find-overlap', async (req, res) => {
  const { userId1, userId2 } = req.body;

  try {
    const database = await connectToDatabase();
    const collection = database.collection('logins');

    const user1 = await collection.findOne({ _id: new ObjectId(userId1) });
    const user2 = await collection.findOne({ _id: new ObjectId(userId2) });

    const schedulingList1 = user1.timeslots;
    const schedulingList2 = user2.timeslots;

    const overlaps = [];

    for (let i = 0; i < schedulingList1.length; i++) {
      const dayOverlap = schedulingList1[i].filter(timeSlot => schedulingList2[i].includes(timeSlot));
      overlaps.push(dayOverlap);
    }

    res.json({ overlaps });

  } catch (error) {
    console.error('Error finding overlaps:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/get-coaches-list', async (req, res) => {
  try {
    const database = await connectToDatabase();
    const collection = database.collection('logins');

    let cards = [];
    await collection.find({ isCoach: true }).forEach(function(doc) {
      cards.push([doc.name, doc.description, doc._id.toString()]);
    });
    res.json({ cards });

  } catch (error) {
    console.error('Error finding overlaps:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// create flow for pages
// user can choose time and it will show the list of coaches on the side
// 15% top 85% bottom, top for search and bottom right shows list of coaches refer to crimson notes: https://app.crimsoneducation.org/session/1646759/agenda
// list all coaches on the side (make unavailable coaches unschedulable - alternate solution to ^)
// card style with coach name, description, schedule, and scrollable
// make scrollable list with booking history in a new page
// landing page/user page for website --> keep simple and can search up

// potentially save coaches schedule on the frontend since fetching from database on a responsive page becomes really slow
// maybe add booking confirmation page (and with notes for the coach)
// try to fix all scheduling issues
// https://fullcalendar.io/docs/initialize-globals