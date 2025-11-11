const express = require('express')
require('dotenv').config()

const app = express()

let counter = 0

// User-facing increment endpoint
app.get('/pingpong', (req, res) => {
  counter += 1
  console.log(`Ping / Pongs: ${counter}`)
  res.send(counter.toString())
})

// Internal read-only endpoint
app.get('/pings', (req, res) => {
  res.send(counter.toString())
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Pingpong app running on port ${PORT}`))
