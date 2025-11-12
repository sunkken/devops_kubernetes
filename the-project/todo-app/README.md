# The Project

## Setup
- **Picsum Writer** (`todo-app-writer`) downloads a picture every 10 minutes from picsum lorum and 
- **Todo Backend** (`log-output`) appends timestamped random strings to another file in the same volume.  
- **Reader** combines both outputs.

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
- Todo App → [http://localhost:8081/project](http://localhost:8081/project)  
- Todo Backend → [http://localhost:8081/project/todos](http://localhost:8081/project/todos)  