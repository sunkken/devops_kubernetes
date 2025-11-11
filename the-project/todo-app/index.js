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

// Backend URL (Docker Compose or k3d)
const backendUrl = process.env.BACKEND_URL || 'http://todo-backend-svc:5000'

// Proxy /api requests to backend
app.use('/api', createProxyMiddleware({
  target: backendUrl,
  changeOrigin: true,
  pathRewrite: { '^/api': '' },
  onProxyReq: (proxyReq, req, res) => {
    console.log(`[Proxy] ${req.method} ${req.originalUrl} -> ${backendUrl}${req.originalUrl.replace(/^\/api/, '')}`)
  }
}))

// Serve static images
app.use(express.static(IMAGE_DIR))

// Serve main HTML
app.get('/', (req, res) => res.sendFile(INDEX_HTML))

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Todo-app running on port ${PORT}`))
