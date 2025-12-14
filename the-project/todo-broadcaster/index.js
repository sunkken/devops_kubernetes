import { connect, StringCodec } from 'nats'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
if (process.env.NODE_ENV !== 'production') {
  const dotenv = await import('dotenv')
  dotenv.config({ path: resolve(__dirname, '../.env') })
}

const NATS_URL = process.env.NATS_URL || 'nats://localhost:4222'
const SUBJECT = process.env.NATS_SUBJECT || 'todos.events'
const GROUP = process.env.GROUP_NAME || 'todo-broadcaster'
const WEBHOOK_URL = process.env.WEBHOOK_URL || ''
const DRY_RUN = (process.env.WEBHOOK_DRY_RUN || '').toLowerCase() === 'true'

if (!WEBHOOK_URL) {
  console.warn('WEBHOOK_URL not set; running in DRY RUN mode (no external posts)')
}

const sc = StringCodec()

async function sendWebhook(payload) {
  if (DRY_RUN || !WEBHOOK_URL) {
    console.log('DRY RUN: would post payload', payload)
    return
  }
  const isTelegram = WEBHOOK_URL.includes('api.telegram.org/bot')
  const isDiscord = WEBHOOK_URL.includes('discord.com/') || WEBHOOK_URL.includes('discord/webhooks/')
  const text = payload?.payload?.text || payload?.payload?.message || JSON.stringify(payload.payload || payload)
  let body
  if (isTelegram) {
    body = { text }
  } else if (isDiscord) {
    body = { content: text }
  } else {
    body = payload
  }
  const res = await fetch(WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Webhook failed: ${res.status} ${text}`)
  }
}

async function start() {
  console.log('Broadcaster starting')
  let nc
  for (let attempt = 1; attempt <= 10; attempt++) {
    try {
      nc = await connect({ servers: NATS_URL, reconnect: true, maxReconnectAttempts: -1 })
      break
    } catch (err) {
      console.warn(`NATS connect failed (attempt ${attempt}):`, err.message)
      await new Promise(r => setTimeout(r, 1000 * attempt))
    }
  }
  if (!nc) {
    throw new Error('Failed to connect to NATS')
  }
  console.log('Connected to NATS', NATS_URL)

  // Log minimal status changes
  ;(async () => {
    for await (const s of nc.status()) {
      console.log('nats:', s.type, s.data)
    }
  })()

  const sub = nc.subscribe(SUBJECT, { queue: GROUP })
  console.log(`Subscribed to ${SUBJECT} with group ${GROUP}`)

  for await (const m of sub) {
    try {
      const msg = sc.decode(m.data)
      let payload
      try { payload = JSON.parse(msg) } catch (_) { payload = { message: msg } }

      // Generic payload format adaptable to Discord/Slack/Telegram
      const data = {
        source: 'todo-broadcaster',
        subject: SUBJECT,
        timestamp: new Date().toISOString(),
        payload
      }

      await sendWebhook(data)
      console.log('Forwarded event', { seq: m.seq })
    } catch (err) {
      console.error('Failed to forward event:', err.message)
    }
  }
}

start().catch(err => {
  console.error('Broadcaster failed:', err)
  process.exit(1)
})
