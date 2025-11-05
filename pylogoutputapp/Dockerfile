FROM python:3.12-alpine
WORKDIR /usr/src/app

COPY pyproject.toml uv.lock* ./
RUN pip install --no-cache-dir uv && uv sync --frozen

COPY . .
CMD ["uv", "run", "uvicorn", "main:app", "--reload"]
