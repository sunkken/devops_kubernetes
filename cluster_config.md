# To avoid using up the credits delete the cluster whenever you do not need it.

## Delete cluster:
```bash
gcloud container clusters delete dwk-cluster --zone=europe-north1-b
```

## Recreate cluster:
```bash
gcloud container clusters create dwk-cluster --zone=europe-north1-b --cluster-version=1.32 --disk-size=32 --num-nodes=3 --machine-type=e2-micro
```

## Enable Gateway API:
```bash
$ gcloud container clusters update dwk-cluster --location=europe-north1-b --gateway-api=standard
```

# Move over to two e2-medium nodes for better performance:
```bash
gcloud container node-pools create e2-medium-pool \
  --cluster=dwk-cluster \
  --zone=europe-north1-b \
  --machine-type=e2-medium \
  --num-nodes=2 \
  --disk-size=32
gcloud container node-pools delete default-pool --cluster=dwk-cluster --zone=europe-north1-b
```