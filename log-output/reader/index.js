const express = require('express')
const fs = require('fs')
const path = require('path')
require('dotenv').config()

const app = express()

const WORKDIR = process.env.WORKDIR || __dirname
const LOG_DIR = path.join(WORKDIR, 'logs')
const LOGOUTPUT_FILE = path.join(LOG_DIR, 'logoutput.txt')
const PINGPONG_FILE = path.join(LOG_DIR, 'pingpong.log')

app.get('/', (req, res) => {
  let logOutputLine = 'No log-output entries yet.'
  let pingPongCount = 'Ping / Pongs: 0'

  if (fs.existsSync(LOGOUTPUT_FILE)) {
    const lines = fs.readFileSync(LOGOUTPUT_FILE, 'utf-8').trim().split('\n')
    if (lines.length > 0) logOutputLine = lines[lines.length - 1]
  }

  if (fs.existsSync(PINGPONG_FILE)) {
    const value = fs.readFileSync(PINGPONG_FILE, 'utf-8').trim()
    if (value) pingPongCount = `Ping / Pongs: ${value}`
  }

  res.type('text/plain').send(`${logOutputLine}\n${pingPongCount}`)
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Reader server listening on port ${PORT}`))
