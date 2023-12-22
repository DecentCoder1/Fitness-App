const express = require('express');
const bodyParser = require('body-parser');

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

// Handle form submission
app.post('/submit', (req, res) => {
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