const express = require('express')
const fs = require('fs')
const path = require('path')
const { createProxyMiddleware } = require('http-proxy-middleware')

const app = express()

const WORKDIR = process.env.WORKDIR || __dirname
const IMAGE_DIR = path.join(WORKDIR, 'image')
const INDEX_HTML = path.join(WORKDIR, 'index.html')

// Ensure image folder exists
fs.mkdirSync(IMAGE_DIR, { recursive: true })

// Serve static images
app.use(express.static(IMAGE_DIR))

// Proxy /api requests to backend
app.use('/api', createProxyMiddleware({
  target: 'http://todo-backend:5000',
  changeOrigin: true,
  pathRewrite: { '^/api': '' }
}))

// Serve main HTML
app.get('/', (req, res) => res.sendFile(INDEX_HTML))

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Todo-app running on port ${PORT}`))
