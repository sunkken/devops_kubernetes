const path = require('path')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: path.resolve(__dirname, '../.env') })
}

const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const { Pool } = require('pg')

const app = express()
app.use(bodyParser.json())

const PORT = process.env.TODO_BACKEND_PORT
if (!PORT) throw new Error('TODO_BACKEND_PORT environment variable is required')

// ---- Logging ----
morgan.token('body', req => JSON.stringify(req.body))
app.use(
  morgan((tokens, req, res) => {
    if (req.method === 'POST') {
      return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms -',
        tokens.body(req, res)
      ].join(' ')
    }
    return null
  })
)

// ---- In-memory fallback todos ----
let todos = [
  { id: 1, text: 'Learn JavaScript' },
  { id: 2, text: 'Learn React' },
  { id: 3, text: 'Build a project' },
]

// ---- Postgres setup ----
const dbVars = ['TODO_DB_HOST', 'TODO_DB_PORT', 'TODO_DB_USER', 'TODO_DB_PASS', 'TODO_DB_NAME']
const missingVars = dbVars.filter(v => !process.env[v])

let db = null
let usingDb = false

if (missingVars.length) {
  console.warn(`Running without database, missing env vars: ${missingVars.join(', ')}`)
} else {
  db = new Pool({
    host: process.env.TODO_DB_HOST,
    port: process.env.TODO_DB_PORT,
    user: process.env.TODO_DB_USER,
    password: process.env.TODO_DB_PASS,
    database: process.env.TODO_DB_NAME,
  })

  db.query('SELECT * FROM todos ORDER BY id ASC')
    .then(res => {
      if (res.rows.length) {
        todos = res.rows
        usingDb = true
        console.log('Todos loaded from DB:', todos)
      } else {
        console.log('No todos in DB yet. Using in-memory defaults.')
      }
    })
    .catch(err => {
      console.error('Error querying DB:', err.message)
      console.log('Using in-memory todos only.')
    })
}

// ---- Endpoints ----

// Return ONLY DB todos if DB is active, otherwise return fallback todos
app.get('/todos', async (req, res) => {
  if (usingDb && db) {
    try {
      const result = await db.query('SELECT * FROM todos ORDER BY id ASC')
      return res.json(result.rows)
    } catch (err) {
      console.error('DB read failed:', err.message)
    }
  }
  return res.json(todos)
})

app.post('/todos', async (req, res) => {
  const { text } = req.body
  if (!text || !text.trim()) return res.status(400).json({ error: 'Todo text required' })

  const cleanText = text.trim()

  // DB path
  if (db) {
    try {
      const result = await db.query(
        'INSERT INTO todos (text) VALUES ($1) RETURNING *',
        [cleanText]
      )
      const newTodo = result.rows[0]
      usingDb = true
      console.log('Inserted into DB:', newTodo)
      return res.status(201).json(newTodo)
    } catch (err) {
      console.error('DB insert failed:', err.message)
      if (!usingDb) console.log('Using in-memory todos only.')
    }
  }

  // In-memory fallback
  const newTodo = {
    id: todos.length ? todos[todos.length - 1].id + 1 : 1,
    text: cleanText
  }
  todos.push(newTodo)
  res.status(201).json(newTodo)
})

// DB status endpoint
app.get('/todos/status', (req, res) => {
  res.json({ todos_count: todos.length, db_connected: usingDb })
})

app.listen(PORT, () => console.log(`Todo-backend running on port ${PORT}`))
