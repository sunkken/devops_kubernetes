# The Project

## Setup
- **Picsum Writer** (`todo-app/picsum-writer`) downloads a random picture every 10 minutes from picsum lorum and writes it to persistent volume.
- **Todo Backend** (`todo-backend`) Provides todo-functionality.
- **Todo App** (`todo-app`) Serves todo frontend and current picture.

## Create Cluster
```bash
k3d cluster create --port 8082:30080@agent:0 -p 8081:80@loadbalancer --agents 2
```

## Create Persistent Volume
```bash
docker exec k3d-k3s-default-agent-0 mkdir -p /tmp/image
kubectl apply -f persistent-volumes/
```

## Deploy Apps
```bash
kubectl apply -f manifests/
```

## Open in Browser
- Todo App → [http://localhost:8081](http://localhost:8081)  
- Todo Backend → [http://localhost:8081/api/todos](http://localhost:8081/api/todos)  