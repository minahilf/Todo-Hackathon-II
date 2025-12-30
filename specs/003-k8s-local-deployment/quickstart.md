# Quickstart: Local Kubernetes Deployment

This guide provides the commands to deploy, access, and tear down the application stack on your local Minikube cluster.

### Prerequisites

1.  Ensure Docker Desktop, Minikube, and Helm are installed.
2.  Start your Minikube cluster:
    ```bash
    minikube start
    ```
3.  Create a `.env` file in the root of the repository with the required secrets:
    ```bash
    # .env
    GEMINI_API_KEY="your-api-key-here"
    DATABASE_URL="your-database-url-here"
    ```

### Build and Load Docker Images

Ensure your Docker daemon is connected to Minikube:
```bash
eval $(minikube -p minikube docker-env)
```

Then, build the images into Minikube's Docker daemon:

```bash
docker build -t backend-app:0.1.0 -f backend/Dockerfile .
docker build -t frontend-app:0.1.0 -f frontend/Dockerfile .
```

### 1. Create Kubernetes Secrets

Before deploying, create the Kubernetes secret object from your `.env` file:

```bash
kubectl create secret generic todo-app-secrets --from-env-file=.env
```

### 2. Deploy the Application

Navigate to the repository root and deploy the application using the parent Helm chart:

```bash
# This command assumes the parent chart is located in 'charts/todo-app'
helm install todo-app-release ./charts/todo-app
```

### 3. Access the Application

In a **separate terminal**, start the Minikube tunnel to expose the application:

```bash
minikube tunnel
```

Minikube will provide a URL (usually `http://127.0.0.1`). Open this URL in your browser to access the frontend.

### 4. Tear Down the Deployment

To remove all deployed components from your cluster, uninstall the Helm release:

```bash
helm uninstall todo-app-release
```

To delete the secrets:
```bash
kubectl delete secret todo-app-secrets
```
