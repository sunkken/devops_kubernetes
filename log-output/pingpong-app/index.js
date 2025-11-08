const fs = require('fs')
const path = require('path')
const express = require('express')
const app = express()

const LOGS_DIR = process.env.LOGS_DIR || '/usr/src/app/logs'
const LOG_FILE = path.join(LOGS_DIR, 'pingpong.log')

// Ensure logs directory exists
fs.mkdirSync(LOGS_DIR, { recursive: true })

// Load previous counter if file exists
let counter = 0
if (fs.existsSync(LOG_FILE)) {
  const value = parseInt(fs.readFileSync(LOG_FILE, 'utf8').trim(), 10)
  if (!isNaN(value)) counter = value
}

app.get('/pingpong', (req, res) => {
  counter += 1
  fs.writeFileSync(LOG_FILE, counter.toString()) // persist counter
  const message = `pong ${counter}`
  console.log(message)
  res.send(message)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
