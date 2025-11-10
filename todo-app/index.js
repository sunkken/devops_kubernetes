const express = require('express')
const fs = require('fs')
const path = require('path')

const app = express()

const WORKDIR = process.env.WORKDIR || __dirname
const IMAGE_DIR = path.join(WORKDIR, 'image')
const INDEX_HTML = path.join(WORKDIR, 'index.html')

// Ensure image folder exists
fs.mkdirSync(IMAGE_DIR, { recursive: true })

// Serve image folder statically
app.use(express.static(IMAGE_DIR))

// Serve main HTML file
app.get('/', (req, res) => {
  res.sendFile(INDEX_HTML)
})

app.listen(3000, () => console.log('Reader running on port 3000'))
