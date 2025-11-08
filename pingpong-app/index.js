const express = require('express')
const app = express()

let counter = 0

app.get('/pingpong', (req, res) => {
  const message = `pong ${counter}`
  counter += 1
  res.send(message)
  console.log(message)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server started in port ${PORT}`)
})
