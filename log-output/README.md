# Shared Logging App (Ping-Pong + Log Output)

## Setup
- **Ping-Pong App** (`pingpong-app`) keeps a request counter in memory.  
- **Log Output** (`log-output`) Serves frontend with timestamped random string and the counter from pingpong-app.

## Create Cluster
```bash
k3d cluster create --port 8082:30080@agent:0 -p 8081:80@loadbalancer --agents 2
```

<!-- ## Create Persistent Volume
```bash
docker exec k3d-k3s-default-agent-0 mkdir -p /tmp/logs
kubectl apply -f persistent-volumes/
``` -->

## Deploy Apps
```bash
kubectl apply -f manifests/
```

## Open in Browser
- Log Output → [http://localhost:8081/logoutput](http://localhost:8081/logoutput)  
- Ping-Pong App → [http://localhost:8081/logoutput/pingpong](http://localhost:8081/logoutput/pingpong)
