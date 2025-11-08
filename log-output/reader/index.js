const express = require('express')
const fs = require('fs')
const path = require('path')
const app = express()

const LOG_FILE = path.join('/usr/src/app/logs', 'output.txt')

app.get('/', (req, res) => {
  if (fs.existsSync(LOG_FILE)) {
    const content = fs.readFileSync(LOG_FILE, 'utf-8')
    res.type('text/plain').send(content)
  } else {
    res.status(404).send('Log file not found yet.')
  }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Reader server listening on ${PORT}`))
