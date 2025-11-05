# pyLogOutputApp

This repository is a multi-chapter Project as part of the DevOps with Kubernetes course (MOOC.fi). Also my first testing of uv + fastAPI workflow.

---

## Run Locally

```bash
uv run uvicorn main:app --reload
```

## Run with Docker

```bash
docker build -t pylogoutputapp .
docker run --rm -p 8000:8000 pylogoutputapp
```

## Endpoint

```
GET /
Returns current random string in JSON
```

## Logs

```
2025-11-05T20:09:14.185Z: kq8ra8
2025-11-05T20:09:19.188Z: kq8ra8
```

---

## Deployment

Works with k3d / Kubernetes. DockerHub image: `sunqen/pylogoutputapp`
