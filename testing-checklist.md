# Local k3d Testing Workflow

**Reminder:** Ensure `imagePullPolicy: IfNotPresent` is set in deployment YAMLs.

**Namespace:** `testing`

1️⃣ **Test locally**

* Run `npm run dev` and `docker-compose build && docker-compose up`
* Uses `.env` and `env/`
* Verify in terminal or browser

2️⃣ **Create k3d testing namespace**

* `kubectl create namespace testing`

3️⃣ **Import images into k3d**

* `k3d image import <image>:<tag>`

4️⃣ **Apply manifests to testing namespace**

* `kubectl -n testing apply -f manifests/`

5️⃣ **Verify and debug**

* Verify in browser and terminal/Freelens

6️⃣ **Cleanup after testing**

* `kubectl delete namespace testing`
* `k3d image rmi <image>:<tag>`

7️⃣ **Push to production**

* Push to Git and DockerHub
