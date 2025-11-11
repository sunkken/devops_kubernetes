// todo-backend/index.js
const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.json())

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

// In-memory storage
let todos = [
  { id: 1, text: 'Learn JavaScript' },
  { id: 2, text: 'Learn React' },
  { id: 3, text: 'Build a project' },
]

// GET /todos
app.get('/todos', (req, res) => res.json(todos))

// POST /todos
app.post('/todos', (req, res) => {
  const { text } = req.body
  if (!text || !text.trim()) return res.status(400).json({ error: 'Todo text required' })
  const newTodo = { id: todos.length ? todos[todos.length - 1].id + 1 : 1, text: text.trim() }
  todos.push(newTodo)
  res.status(201).json(newTodo)
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Todo-backend running on port ${PORT}`))
