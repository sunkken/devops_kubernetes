const express = require('express')
const axios = require('axios')
require('dotenv').config()

const app = express()

// ---- Configuration / constants ----
const PINGPONG_URL = process.env.PINGPONG_URL || 'http://pingpong-app:3001/pings'

// ---- Writer setup ----
const RANDOM_STRING = Math.random().toString(36).substring(2, 8)
console.log(`Writer started. Random string: ${RANDOM_STRING}`)

// In-memory log storage
const logLines = []

setInterval(() => {
  const line = `${new Date().toISOString()} ${RANDOM_STRING}`
  logLines.push(line)
  console.log(`Wrote: ${line}`)
}, 5000)

// ---- Reader route ----
app.get('/', async (req, res) => {
  const logOutputLine = logLines.at(-1) || 'No log-output entries yet.'

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
