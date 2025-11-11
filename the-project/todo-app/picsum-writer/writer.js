require('dotenv').config()

const fs = require('fs')
const path = require('path')
const axios = require('axios')

const WORKDIR = process.env.WORKDIR || path.resolve(__dirname, '..')
const IMAGE_DIR = path.join(WORKDIR, 'image')
const IMAGE_PATH = path.join(IMAGE_DIR, 'image.jpg')

const IMAGE_URL = 'https://picsum.photos/200'
const INTERVAL = 10 * 60 * 1000 // 10 minutes

// Ensure image folder exists
fs.mkdirSync(IMAGE_DIR, { recursive: true })

async function downloadImage() {
  try {
    const res = await axios.get(IMAGE_URL, { responseType: 'arraybuffer' })
    fs.writeFileSync(IMAGE_PATH, res.data)
    console.log(new Date().toISOString(), 'Downloaded new image')
  } catch (err) {
    console.error('Failed to download image:', err.message)
  }
}

function getFileAge() {
  if (!fs.existsSync(IMAGE_PATH)) return Infinity
  return Date.now() - fs.statSync(IMAGE_PATH).mtimeMs
}

async function loop() {
  await downloadImage()
  setTimeout(loop, INTERVAL)
}

async function start() {
  const age = getFileAge()
  if (age > INTERVAL) {
    console.log('Old or missing image, downloading immediately')
    await downloadImage()
    setTimeout(loop, INTERVAL)
  } else {
    const wait = INTERVAL - age
    console.log(`Existing image age ${Math.round(age / 1000)}s, next update in ${Math.round(wait / 1000)}s`)
    setTimeout(loop, wait)
  }
}

console.log('Writer started')
start()
