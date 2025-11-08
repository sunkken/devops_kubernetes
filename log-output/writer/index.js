const fs = require('fs')
const path = require('path')

const LOG_FILE = path.join('/usr/src/app/logs', 'output.txt')
const RANDOM_STRING = Math.random().toString(36).substring(2, 8)

console.log(`Writer started. Random string: ${RANDOM_STRING}`)

// Ensure logs directory exists
fs.mkdirSync(path.dirname(LOG_FILE), { recursive: true })

// Append new line every 5 seconds
setInterval(() => {
  const line = `${new Date().toISOString()} ${RANDOM_STRING}\n`
  fs.appendFileSync(LOG_FILE, line)
  console.log(`Wrote: ${line.trim()}`)
}, 5000)
