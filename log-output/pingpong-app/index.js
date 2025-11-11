const fs = require('fs')
const path = require('path')
const express = require('express')
require('dotenv').config()

const app = express()

const WORKDIR = process.env.WORKDIR || __dirname
const LOGS_DIR = path.join(WORKDIR, 'logs')
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
  fs.writeFileSync(LOG_FILE, counter.toString())
  const message = `pong ${counter}`
  console.log(message)
  res.send(message)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Pingpong writer running on port ${PORT}`))
