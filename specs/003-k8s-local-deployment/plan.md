# Implementation Plan: Local Kubernetes Deployment

**Branch**: `003-k8s-local-deployment` | **Date**: 2025-12-30 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `specs/003-k8s-local-deployment/spec.md`

## Summary

This plan details the steps to create a containerized, local Kubernetes deployment for the Todo Chatbot application. The primary goal is to enable developers to set up a full, secure development environment with a single command. The technical approach involves creating optimized Docker images for the frontend and backend, managed by a modular parent Helm chart, with secrets handled by Kubernetes, and local access provided by the Minikube tunnel.

## Technical Context

**Language/Version**: Python 3.11 (backend), TypeScript/Node.js (frontend)
**Primary Dependencies**: FastAPI (backend), Next.js (frontend), Docker, Helm, Minikube, kubectl
**Storage**: N/A for this feature (Database URL is treated as an external secret)
**Testing**: Manual testing via browser, `kubectl` checks, `helm lint`
**Target Platform**: Local Minikube Kubernetes cluster
**Project Type**: Web application (frontend + backend)
**Performance Goals**: A developer should be able to deploy the full stack in under 5 minutes after the initial image builds.
**Constraints**: The solution must run on a standard developer machine with Minikube and Docker Desktop installed. It must not require cloud-specific resources.
**Scale/Scope**: The scope is limited to a local, single-node Minikube deployment for development and testing purposes only.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

The project constitution is a template and does not contain specific principles to check against. This plan adheres to general software engineering best practices such as modularity (Helm sub-charts) and security (no hardcoded secrets).

## Project Structure

### Documentation (this feature)

```text
specs/003-k8s-local-deployment/
├── plan.md              # This file
├── research.md          # Research on Docker, Helm, and Minikube patterns
├── data-model.md        # States no data model changes
├── quickstart.md        # Developer-facing instructions
├── contracts/           # Contains placeholder openapi.yaml
│   └── openapi.yaml
└── tasks.md             # To be created by /sp.tasks
```

### Source Code (repository root)

A new top-level `charts` directory will be created to house the Helm charts.

```text
# New directory for Helm charts
charts/
└── todo-app/            # Parent chart for the application
    ├── Chart.yaml
    ├── values.yaml
    ├── templates/       # Common templates (if any)
    └── charts/          # Directory for sub-charts
        ├── backend/     # Backend sub-chart
        │   ├── Chart.yaml
        │   ├── values.yaml
        │   └── templates/
        │       ├── deployment.yaml
        │       ├── service.yaml
        │       └── secrets.yaml
        └── frontend/    # Frontend sub-chart
            ├── Chart.yaml
            ├── values.yaml
            └── templates/
                ├── deployment.yaml
                ├── service.yaml
                └── secrets.yaml

# Existing directories
backend/
└── Dockerfile           # To be created

frontend/
└── Dockerfile           # To be created
```

**Structure Decision**: A new `charts` directory will be added to the repository root. This is standard practice for Helm-based projects and keeps infrastructure-as-code separate from the application source code. The parent chart `todo-app` will manage the `backend` and `frontend` sub-charts.

## Implementation Phases

### Phase 1: Containerization

1.  **Task 1.1: Create Backend Dockerfile**: Generate a multi-stage `Dockerfile` in the `backend/` directory.
    *   Use a Python slim image as the base.
    *   The build stage will install dependencies from `requirements.txt`.
    *   The final stage will copy only the application code and the installed dependencies.
    *   Expose the application port (e.g., 8000).
    *   Use Docker's AI/`docker init` to generate an optimized starting point.

2.  **Task 1.2: Create Frontend Dockerfile**: Generate a multi-stage `Dockerfile` in the `frontend/` directory.
    *   Use a Node.js image for the build stage to compile the Next.js application (`npm run build`).
    *   The final stage will use a minimal web server (like the standalone Next.js server) to serve the static and server-rendered files.
    *   Expose the application port (e.g., 3000).
    *   Use Docker's AI/`docker init` to generate an optimized starting point.

3.  **Task 1.3: Local Image Building**: Add scripts or instructions to the `quickstart.md` on how to build these images and load them into Minikube's Docker daemon (`minikube image load <image-name>`).

### Phase 2: Helm Chart Creation

1.  **Task 2.1: Initialize Charts**: Use `helm create` to scaffold the parent chart (`todo-app`) and the two sub-charts (`backend`, `frontend`).
2.  **Task 2.2: Implement Backend Chart**:
    *   Create `deployment.yaml` to define the backend Pod specification.
    *   Create `service.yaml` to expose the backend internally within the cluster (Service type `ClusterIP`).
    *   Modify `values.yaml` to allow configuration of image name, tag, and port.
    *   Add logic to mount secrets from `todo-app-secrets`.
3.  **Task 2.3: Implement Frontend Chart**:
    *   Create `deployment.yaml` for the frontend Pod.
    *   Create `service.yaml` to expose the frontend. This will be of type `LoadBalancer` to be picked up by `minikube tunnel`.
    *   Modify `values.yaml` for image configuration.
    *   Ensure the backend service URL is passed as an environment variable to the frontend pods.
4.  **Task 2.4: Configure Parent Chart**:
    *   Modify the `Chart.yaml` of the `todo-app` chart to declare its dependencies on the `frontend` and `backend` sub-charts.
    *   Create a global `values.yaml` in the parent chart to allow easy configuration of the entire stack (e.g., image tags).
5.  **Task 2.5: Lint and Test**: Run `helm lint` and `helm template` to validate the chart syntax and output.

### Phase 3: Deployment and Verification

1.  **Task 3.1: Update Documentation**: Finalize the `quickstart.md` with the exact, tested commands for deployment.
2.  **Task 3.2: Full Deployment Test**: Execute the end-to-end workflow:
    *   `minikube start`
    *   `kubectl create secret ...`
    *   `helm install ...`
    *   `minikube tunnel`
    *   Verify application access in the browser.
3.  **Task 3.3: Teardown Test**: Run `helm uninstall` and `kubectl delete secret` to ensure a clean removal of all resources.
