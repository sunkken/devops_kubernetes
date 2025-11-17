# The Project

## Setup Overview
* **Picsum Writer** (`todo-app/picsum-writer`)
  Downloads a random picture every 10 minutes from Picsum Lorem and writes it to a persistent volume.
* **Todo Backend** (`todo-backend`)
  Provides todo functionality and stores todos either in memory or in Postgres.
* **Todo App** (`todo-app`)
  Serves the todo frontend and current picture.
* **Todo CronJob** (`todo-cronjob`)
  Automatically generates a random "Read <Wikipedia URL>" todo every hour and posts it to the backend.
* **Postgres Database** (`tododb`)
  StatefulSet that stores todos persistently.

## Create Cluster
```bash
k3d cluster create --port 8082:30080@agent:0 -p 8081:80@loadbalancer --agents 2
```

## Create Persistent Volume
```bash
docker exec k3d-k3s-default-agent-0 mkdir -p /tmp/image
kubectl apply -f persistent-volumes/
```

## Deploy Apps and Database
```bash
kubectl apply -f manifests/
```

## Open in Browser
- Todo App → [http://localhost:8081](http://localhost:8081)  
- Todo Backend → [http://localhost:8081/api/todos](http://localhost:8081/api/todos)  