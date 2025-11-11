const express = require('express')
const fs = require('fs')
const path = require('path')

const app = express()

const WORKDIR = process.env.WORKDIR || __dirname
const IMAGE_DIR = path.join(WORKDIR, 'image')
const INDEX_HTML = path.join(WORKDIR, 'index.html')

// Ensure image folder exists
fs.mkdirSync(IMAGE_DIR, { recursive: true })

// Only use proxy if NOT running in k3d
const isK3d = process.env.K3D === 'true'

if (!isK3d) {
  const { createProxyMiddleware } = require('http-proxy-middleware')
  const backendUrl = process.env.BACKEND_URL || 'http://todo-backend:5000'

  app.use('/api', createProxyMiddleware({
    target: backendUrl,
    changeOrigin: true,
    pathRewrite: { '^/api': '' }
  }))
}

// Serve static images
app.use(express.static(IMAGE_DIR))

// Serve main HTML
app.get('/', (req, res) => res.sendFile(INDEX_HTML))

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Todo-app running on port ${PORT}, K3D=${isK3d}`))
