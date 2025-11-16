const path = require('path')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: path.resolve(__dirname, '../.env') })
}

const express = require('express')

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


const PORT = process.env.PINGPONG_PORT
app.listen(PORT, () => console.log(`Pingpong app running on port ${PORT}`))
