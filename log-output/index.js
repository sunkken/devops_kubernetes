const express = require('express')
const fs = require('fs')
const path = require('path')
const axios = require('axios')
require('dotenv').config()

const app = express()

// ---- Configuration / constants ----
const WORKDIR = process.env.WORKDIR || __dirname
const LOG_DIR = path.join(WORKDIR, 'logs')
const LOG_FILE = path.join(LOG_DIR, 'logoutput.txt')
const PINGPONG_URL = process.env.PINGPONG_URL || 'http://pingpong-app:3001/pings'

// Ensure log directory exists
fs.mkdirSync(LOG_DIR, { recursive: true })

// ---- Writer setup ----
const RANDOM_STRING = Math.random().toString(36).substring(2, 8)
console.log(`Writer started. Random string: ${RANDOM_STRING}`)

setInterval(() => {
  const line = `${new Date().toISOString()} ${RANDOM_STRING}\n`
  fs.appendFileSync(LOG_FILE, line)
  console.log(`Wrote: ${line.trim()}`)
}, 5000)

// ---- Reader route ----
app.get('/', async (req, res) => {
  const lines = fs.readFileSync(LOG_FILE, 'utf-8').split('\n')
  const logOutputLine = lines[lines.length - 2] || 'No log-output entries yet.'

  let pingPongCount = 'Ping / Pongs: 0'
  try {
    const response = await axios.get(PINGPONG_URL, { timeout: 500 })
    pingPongCount = `Ping / Pongs: ${response.data}`
  } catch {
    pingPongCount = 'Pingpong service not reachable'
  }

  res.type('text/plain').send(`${logOutputLine}\n${pingPongCount}`)
})

// ---- Start server ----
const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Reader+Writer server listening on port ${PORT}`))
