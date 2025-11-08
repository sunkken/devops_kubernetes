const express = require('express')
const fs = require('fs')
const path = require('path')
const app = express()

const LOGOUTPUT_FILE = path.join('/usr/src/app/logs', 'logoutput.txt')
const PINGPONG_FILE = path.join('/usr/src/app/logs', 'pingpong.log')

app.get('/', (req, res) => {
  let logOutputLine = 'No log-output entries yet.'
  let pingPongCount = 'Ping / Pongs: 0'

  // Read last line of log-output file if exists
  if (fs.existsSync(LOGOUTPUT_FILE)) {
    const lines = fs.readFileSync(LOGOUTPUT_FILE, 'utf-8').trim().split('\n')
    logOutputLine = lines[lines.length - 1] // get most recent entry
  }

  // Read pingpong counter if exists
  if (fs.existsSync(PINGPONG_FILE)) {
    const value = fs.readFileSync(PINGPONG_FILE, 'utf-8').trim()
    if (value) pingPongCount = `Ping / Pongs: ${value}`
  }

  // Combine and send
  const output = `${logOutputLine}\n${pingPongCount}`
  res.type('text/plain').send(output)
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Reader server listening on ${PORT}`))
