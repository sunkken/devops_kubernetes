const express = require('express')
const fs = require('fs')
const path = require('path')

const app = express()

const IMAGE_DIR = path.join(__dirname, 'image')
const IMAGE_PATH = path.join(IMAGE_DIR, 'image.jpg')

// Ensure image folder exists
fs.mkdirSync(IMAGE_DIR, { recursive: true })

app.get('/', (req, res) => {
  const imageExists = fs.existsSync(IMAGE_PATH)
  res.send(`
    <h1>Todo App</h1>
    <p>App is under construction</p>
    ${imageExists ? `<img src="/image.jpg">` : '<p>No image yet</p>'}
    <p></p>
    <footer>DevOps with Kubernetes 2025</footer>
  `)
})

app.use(express.static(IMAGE_DIR))

app.listen(3000, () => console.log('Reader running on port 3000'))
