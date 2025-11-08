const express = require('express');
const app = express();

const RANDOM_STRING = Math.random().toString(36).substring(2, 8);
console.log(`App started. Random string: ${RANDOM_STRING}`);

function getStatus() {
  return { timestamp: new Date().toISOString(), randomString: RANDOM_STRING };
}

// Print status to console every 5 seconds
setInterval(() => console.log(getStatus()), 5000);

// Endpoint for browser access
app.get('/', (req, res) => res.json(getStatus()));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
