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
$ gcloud container clusters update clustername --location=europe-north1-b --gateway-api=standard
```