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
let lastDbError = false // <-- track DB error

// ---- Postgres setup ----
let db
if (process.env.USE_DB === 'true') {
  db = new Pool({
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DB,
  })

  db.query('SELECT pings FROM pingpong_counter WHERE id=1')
    .then(res => {
      if (res.rows.length) {
        counter = res.rows[0].pings
        console.log(`Counter initialized from DB: ${counter}`)
      } else {
        console.log('No row found in DB yet. Starting at 0.')
      }
    })
    .catch(err => {
      console.error('Error connecting to DB:', err.message)
      lastDbError = true
    })
}

// ---- User-facing increment endpoint ----
app.get('/pingpong', async (req, res) => {
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
    }
  }

  res.send(counter.toString())
})

// ---- Internal read-only endpoint ----
app.get('/pings', (req, res) => {
  res.json({
    counter,
    db_ok: !lastDbError
  })
})

const PORT = process.env.PINGPONG_PORT
app.listen(PORT, () => console.log(`Pingpong app running on port ${PORT}`))
