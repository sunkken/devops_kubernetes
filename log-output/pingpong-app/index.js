
const path = require('path')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: path.resolve(__dirname, '../.env') })
}

const express = require('express')
const { Pool } = require('pg')

const requiredVars = ['PG_HOST', 'PG_PORT', 'PG_USER', 'PG_PASSWORD', 'PG_DB', 'USE_DB']
const missing = requiredVars.filter(v => !process.env[v])
if (missing.length) {
  console.warn(`Running without database, missing env vars: ${missing.join(', ')}`)
}

const app = express()
let counter = 0
let lastDbError = false
let isReconnecting = false

let db
if (process.env.USE_DB === 'true') {
  db = new Pool({
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DB
  })

  // ---- Improved DB initialization with retries ----
  async function initCounter() {
    if (!db) return

    for (let attempt = 1; attempt <= 20; attempt++) {
      try {
        // Ensure table exists
        await db.query(`
          CREATE TABLE IF NOT EXISTS pingpong_counter (
            id INT PRIMARY KEY,
            pings INT
          )
        `)
        await db.query(`
          INSERT INTO pingpong_counter (id, pings)
          VALUES (1, 0)
          ON CONFLICT (id) DO NOTHING
        `)

        // Fetch current counter
        const res = await db.query('SELECT pings FROM pingpong_counter WHERE id=1')
        counter = res.rows.length ? res.rows[0].pings : 0
        console.log(`Counter initialized from DB: ${counter}`)
        lastDbError = false
        isReconnecting = false
        return
      } catch (err) {
        console.error(`DB init attempt ${attempt} failed: ${err.message}`)
        lastDbError = true
        if (attempt < 20) {
          await new Promise(r => setTimeout(r, 5000)) // wait 5s before retry
        }
      }
    }
    console.warn('DB initialization failed after retries. Starting at 0.')
    lastDbError = true
    isReconnecting = false
  }

  async function reconnectIfNeeded() {
    if (!db || isReconnecting) return
    isReconnecting = true
    console.log('DB connection lost, attempting to reconnect...')
    await initCounter()
  }

  initCounter()
}

// ---- Routes ----
app.get('/', async (req, res) => {
  counter += 1
  console.log(`Ping / Pongs: ${counter}`)

  if (db) {
    try {
      await db.query('UPDATE pingpong_counter SET pings=$1 WHERE id=1', [counter])
      lastDbError = false
      console.log(`DB updated successfully: pings=${counter}`)
    } catch (err) {
      console.error('DB update failed:', err.message)
      lastDbError = true
      // Trigger reconnection in background
      reconnectIfNeeded()
    }
  }

  res.send(counter.toString())
})

app.get('/pings', (req, res) => {
  res.json({
    counter,
    db_ok: !lastDbError
  })
})

app.get('/healthz', async (req, res) => {
  if (!db) {
    return res.status(200).json({ status: 'ok', db: 'disabled' })
  }

  try {
    await db.query('SELECT 1')
    res.status(200).json({ status: 'ok', db: 'connected' })
  } catch (err) {
    res.status(503).json({ status: 'unavailable', db: 'error', error: err.message })
  }
})

const PORT = process.env.PINGPONG_PORT || process.env.SERVERLESS_PORT || 8080
app.listen(PORT, () => console.log(`Pingpong app running on port ${PORT}`))