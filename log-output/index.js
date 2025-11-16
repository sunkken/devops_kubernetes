const express = require('express')
const axios = require('axios')
const fs = require('fs')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const app = express()

// ---- Configuration ----
const PORT = process.env.LOG_PORT
const PINGPONG_URL = process.env.PINGPONG_URL
const MESSAGE = process.env.MESSAGE || 'MESSAGE not set'

// ---- Read ConfigMap file ----
function readFileContent() {
  const path =
    fs.existsSync('/config/information.txt')
      ? '/config/information.txt'
      : 'env/information.txt'

  try {
    return fs.readFileSync(path, 'utf8').trim()
  } catch {
    return 'File not found'
  }
}

const fileContent = readFileContent()

// ---- Writer setup ----
const RANDOM_STRING = Math.random().toString(36).substring(2, 8)
console.log(`Writer started. Random string: ${RANDOM_STRING}`)

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
    const data = response.data

    // Check DB Connection before giving counter
    if (data.db_ok === false) {
      pingPongCount = 'Pingpong DB not updated / connection issue!'
    } else {
      pingPongCount = `Ping / Pongs: ${data.counter}`
    }
  } catch {
    pingPongCount = 'Pingpong service not reachable'
  }

const output = `
file content: ${fileContent}
env variable: MESSAGE=${MESSAGE}
${logOutputLine}
${pingPongCount}
`.trim()

res.type('text/plain').send(output)
})

// ---- Start server ----
app.listen(PORT, () => console.log(`Reader+Writer server listening on port ${PORT}`))
