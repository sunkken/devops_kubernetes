# Todo Broadcaster

Subscribes to NATS `todos.events` and forwards messages to a generic webhook (Discord/Slack/Telegram). Uses a queue group to prevent duplicate deliveries when scaled.

## Env Vars
- `NATS_URL`: NATS server URL (e.g. `nats://my-nats.dev.svc.cluster.local:4222`).
- `NATS_SUBJECT`: Subject to subscribe to (default `todos.events`).
- `GROUP_NAME`: Queue group name for scaling (default `todo-broadcaster`).
- `WEBHOOK_URL`: Destination webhook URL. Optional for local.
- `WEBHOOK_DRY_RUN`: Set `true` to log payloads locally without posting.

## Run locally
```bash
export NATS_URL=nats://localhost:4222
# Optional: provide WEBHOOK_URL, or use DRY RUN
export WEBHOOK_DRY_RUN=true
npm install
npm start
```

## Docker
```bash
docker build -t sunqen/todo-broadcaster:latest .
docker run --rm \
  -e NATS_URL=nats://localhost:4222 \
  -e WEBHOOK_URL=https://example.com/webhook \
  sunqen/todo-broadcaster:latest
```
