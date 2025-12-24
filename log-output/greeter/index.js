const express = require('express')

const app = express()

const PORT = process.env.GREETER_PORT || 3002
const VERSION = process.env.VERSION || '1'

app.get('/', (req, res) => {
  res.json({ message: `Hello from version ${VERSION}` })
})

app.get('/healthz', (req, res) => {
  res.status(200).send('OK')
})

app.listen(PORT, () => console.log(`greeter listening on port ${PORT}`))