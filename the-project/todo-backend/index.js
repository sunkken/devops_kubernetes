const path = require('path')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: path.resolve(__dirname, '../.env') })
}

const express = require('express')
const morgan = require('morgan')
const { Pool } = require('pg')

const app = express()
app.use(express.json())

// ---- Morgan logging ----
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

// ---- Async helper ----
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}

// ---- Storage helpers ----
const getAllTodos = async () => {
  if (usingDb && db) {
    const result = await db.query('SELECT * FROM todos ORDER BY id ASC')
    return result.rows
  }
  return todos
}

const getTodoById = async (id) => {
  if (usingDb && db) {
    const result = await db.query('SELECT * FROM todos WHERE id = $1', [id])
    return result.rows[0] || null
  }
  return todos.find(t => t.id === id) || null
}

const createTodo = async (text) => {
  if (usingDb && db) {
    const result = await db.query('INSERT INTO todos (text) VALUES ($1) RETURNING *', [text])
    return result.rows[0]
  }
  const newTodo = { id: todos.length ? todos[todos.length - 1].id + 1 : 1, text }
  todos.push(newTodo)
  return newTodo
}

const deleteTodoById = async (id) => {
  if (usingDb && db) {
    const result = await db.query('DELETE FROM todos WHERE id = $1 RETURNING *', [id])
    return result.rows[0] || null
  }
  const index = todos.findIndex(t => t.id === id)
  if (index === -1) return null
  return todos.splice(index, 1)[0]
}

// ---- Routes ----
app.get('/todos/status', (req, res) => {
  res.status(200).json({ todos_count: todos.length, db_connected: usingDb })
})

app.get('/todos', asyncHandler(async (req, res) => {
  const allTodos = await getAllTodos()
  res.status(200).json(allTodos)
}))

app.get('/todos/:id', asyncHandler(async (req, res) => {
  const id = Number(req.params.id)
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' })

  const todo = await getTodoById(id)
  if (!todo) return res.status(404).json({ error: 'Todo not found' })
  res.status(200).json(todo)
}))

app.post('/todos', asyncHandler(async (req, res) => {
  const { text } = req.body
  if (!text || !text.trim()) return res.status(400).json({ error: 'Todo text required' })
  if (text.trim().length > 140) return res.status(400).json({ error: 'Todo text cannot exceed 140 characters' })

  const newTodo = await createTodo(text.trim())
  res.status(201).json(newTodo)
}))

app.delete('/todos/:id', asyncHandler(async (req, res) => {
  const id = Number(req.params.id)
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' })

  const deleted = await deleteTodoById(id)
  if (!deleted) return res.status(404).json({ error: 'Todo not found' })
  res.status(204).end()
}))

// ---- Error Handlers ----
const unknownEndpoint = (req, res) => {
  res.status(404).json({ error: 'unknown endpoint' })
}

const errorHandler = (err, req, res, next) => {
  console.error(err.message)
  if (err.name === 'CastError') return res.status(400).json({ error: 'malformatted id' })
  res.status(500).json({ error: 'Internal server error' })
}

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.TODO_BACKEND_PORT
if (!PORT) throw new Error('TODO_BACKEND_PORT environment variable is required')

app.listen(PORT, () => console.log(`Todo-backend running on port ${PORT}`))