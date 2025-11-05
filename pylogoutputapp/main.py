import asyncio
import random
import string
from datetime import datetime, timezone
from fastapi import FastAPI
import logging

# Configure basic logging (message only, timestamp will be handled manually)
logging.basicConfig(level=logging.INFO, format="%(message)s")

app = FastAPI()

# Generate and store a random string at startup
RANDOM_STRING = "".join(random.choices(string.ascii_lowercase + string.digits, k=6))


def iso_utc_now():
    """Return current UTC time in ISO 8601 format with milliseconds and Z suffix."""
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.%f")[:-3] + "Z"


async def log_with_timestamp():
    while True:
        logging.info(f"{iso_utc_now()}: {RANDOM_STRING}")
        await asyncio.sleep(5)


@app.on_event("startup")
async def start_background_task():
    asyncio.create_task(log_with_timestamp())


@app.get("/")
async def root():
    return {"random_string": RANDOM_STRING}