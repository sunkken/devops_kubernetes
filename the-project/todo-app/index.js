const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

const express = require('express')
const fs = require('fs')
const { createProxyMiddleware } = require('http-proxy-middleware')

const app = express()

const WORKDIR = process.env.TODO_APP_WORKDIR || process.env.TODO_APP_WORKDIR_LOCAL
const IMAGE_DIR = path.join(WORKDIR, 'image')
const INDEX_HTML = path.join(WORKDIR, 'index.html')

const backendUrl = process.env.TODO_BACKEND_URL
const PORT = process.env.TODO_APP_PORT

// Fail if missing environment variables
if (!WORKDIR) throw new Error('WORKDIR environment variable is required');
if (!backendUrl) throw new Error('BACKEND_URL environment variable is required');
if (!PORT) throw new Error('PORT environment variable is required');

// Ensure image folder exists
fs.mkdirSync(IMAGE_DIR, { recursive: true })

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

app.listen(PORT, () => console.log(`Todo-app running on port ${PORT}`))
