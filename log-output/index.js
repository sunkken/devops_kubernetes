const express = require('express');
const app = express();

const RANDOM_STRING = Math.random().toString(36).substring(2, 8);
console.log(`App started. Random string: ${RANDOM_STRING}`);

// Save current status
let currentStatus = {
  timestamp: new Date().toISOString(),
  randomString: RANDOM_STRING
};

// Print status to console every 5 seconds
setInterval(() => {
  currentStatus.timestamp = new Date().toISOString();
  console.log(currentStatus);
}, 5000);

// Serve status at root endpoint
app.get('/', (req, res) => res.json(currentStatus));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
