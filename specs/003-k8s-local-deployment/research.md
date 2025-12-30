# Research & Decisions for Local Kubernetes Deployment

This document outlines the decisions and best practices for containerizing and deploying the application stack to a local Minikube cluster.

## 1. Containerization Strategy

### Decision
We will create multi-stage Dockerfiles for both the Next.js frontend and the FastAPI backend. This approach separates build-time dependencies from the final runtime image, resulting in smaller, more secure, and more efficient production images. For local development, the Dockerfiles will be optimized for fast rebuilds, utilizing layer caching. We will leverage Docker's AI capabilities (as requested via the "Gordon" persona) to generate the initial, optimized Dockerfiles.

### Rationale
- **Smaller Images**: Multi-stage builds dramatically reduce the final image size by discarding build tools and intermediate artifacts.
- **Improved Security**: The final image contains only the necessary runtime components, reducing the attack surface.
- **Faster Builds**: Proper layer caching ensures that only changed layers are rebuilt, speeding up development cycles.

### Alternatives Considered
- **Single-stage builds**: This is simpler to write but results in large, bloated images containing unnecessary build dependencies. Rejected for inefficiency and poor security posture.

## 2. Helm Chart Structure

### Decision
We will adopt a **parent chart** architecture. A single parent chart, located at `charts/todo-app`, will manage the deployment of the entire application. This parent chart will have two sub-charts in its `charts/` directory: one for the `frontend` and one for the `backend`.

- `charts/todo-app/` (Parent Chart)
  - `Chart.yaml`
  - `values.yaml` (Global values)
  - `templates/`
  - `charts/`
    - `frontend-0.1.0.tgz` (Packaged sub-chart)
    - `backend-0.1.0.tgz` (Packaged sub-chart)

This structure allows developers to deploy the entire stack with `helm install my-release ./charts/todo-app` while still allowing independent configuration and deployment of the frontend and backend if needed.

### Rationale
- **Modularity**: Encapsulates the configuration for each service, making them easier to manage.
- **Reusability**: Sub-charts can be independently versioned and potentially reused.
- **Simplified Management**: A single parent chart provides a single entry point for deploying and managing the entire application stack.

### Alternatives Considered
- **Monolithic Chart**: A single Helm chart containing templates for all services. Rejected because it becomes difficult to manage as the number of services grows and offers less separation of concerns.

## 3. Secret Management

### Decision
All sensitive data (Gemini API Key, Database URL) will be managed using Kubernetes Secrets. A local `.env` file will be created (and added to `.gitignore`) to hold these values. A script or manual `kubectl` command will be used to create a Kubernetes Secret object from this `.env` file *before* deploying the Helm chart.

Example command: `kubectl create secret generic my-app-secrets --from-env-file=.env`

The Helm chart templates will then reference this secret and mount its key-value pairs as environment variables into the application pods.

### Rationale
- **Security**: This completely decouples secrets from the application source code and deployment artifacts (Docker images, Helm charts), adhering to security best practices.
- **Flexibility**: The same Helm chart can be used in different environments by creating secrets with the same name but different values.

### Alternatives Considered
- **Helm Secrets (SOPS)**: This is a more advanced solution for encrypting secrets directly within the Git repository. It's an excellent tool but adds complexity (GPG/KMS keys) that is overkill for a local development setup.
- **Injecting plaintext values into Helm**: Passing secrets via `helm --set` or in `values.yaml` is insecure and leaks sensitive data in CI/CD logs and shell history. Rejected.

## 4. Local Accessibility (Tunneling)

### Decision
The frontend service will be defined as type `LoadBalancer` in its Helm chart template. After deployment, the developer will run the `minikube tunnel` command in a separate terminal. Minikube will then intercept the `LoadBalancer` service and expose it on the developer's host machine (e.g., `http://127.0.0.1`).

### Rationale
- **Native Kubernetes Experience**: Uses a standard Kubernetes service type (`LoadBalancer`), which is the same pattern used in cloud environments.
- **Simplicity**: `minikube tunnel` is a single, simple command that handles the networking complexities automatically.
- **Stable IP Address**: The tunnel provides a stable IP and port for the developer to use.

### Alternatives Considered
- **NodePort**: This exposes the service on a high-numbered port on the Minikube VM's IP. It requires the developer to first find the Minikube IP (`minikube ip`) and then construct the URL. It's less convenient than `tunnel`.
- **kubectl port-forward**: This is useful for temporary debugging of a specific pod but is not designed for exposing a permanent service. It's less resilient as it terminates if the pod restarts.
