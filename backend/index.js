// Import express
const express = require('express');

// Create an express app
const app = express();

// Set the port number
const port = 3000;

// Define a route that sends "Hello, World!" when accessed via GET request
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Start the server and listen on port 3000
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
