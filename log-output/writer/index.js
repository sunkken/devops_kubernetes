const fs = require('fs')
const path = require('path')

require('dotenv').config()

const WORKDIR = process.env.WORKDIR || __dirname
const LOG_DIR = path.join(WORKDIR, 'logs')
const LOG_FILE = path.join(LOG_DIR, 'logoutput.txt')
const RANDOM_STRING = Math.random().toString(36).substring(2, 8)

console.log(`Writer started. Random string: ${RANDOM_STRING}`)
console.log(`Writing logs to: ${LOG_FILE}`)

// Ensure logs directory exists
fs.mkdirSync(path.dirname(LOG_FILE), { recursive: true })

// Append new line every 5 seconds
setInterval(() => {
  const line = `${new Date().toISOString()} ${RANDOM_STRING}\n`
  fs.appendFileSync(LOG_FILE, line)
  console.log(`Wrote: ${line.trim()}`)
}, 5000)
