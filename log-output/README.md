# Shared Logging App (Ping-Pong + Log Output)

## Setup Overview
* **Ping-Pong App** (`pingpong-app`)
  Tracks a request counter and stores it in Postgres when available.
* **Log Output** (`log-output`)
  Serves a frontend that shows a timestamped random string and the current ping counter.
* **Postgres Database** (`logdb`)
  StatefulSet used by pingpong-app; optional for local dev (falls back to memory).

## Live Deployments (GKE)
* Temporary log-output endpoint: http://34.49.176.224/ (subject to change)
* Temporary ping-pong endpoint: http://34.49.176.224/pingpong (subject to change)
* Readiness: both services expose `/healthz` and wait for Postgres before becoming ready.

## Local Development (k3d)

### Create Cluster
```bash
k3d cluster create --port 8082:30080@agent:0 -p 8081:80@loadbalancer --agents 2
```

### Deploy Apps and Database
```bash
kubectl apply -f k3d-manifests/
```

### Open in Browser
- Log Output → [http://localhost:8081/logoutput](http://localhost:8081/logoutput)  
- Ping-Pong App → [http://localhost:8081/logoutput/pingpong](http://localhost:8081/logoutput/pingpong)
