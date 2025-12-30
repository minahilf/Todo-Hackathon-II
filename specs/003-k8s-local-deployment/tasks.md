# Tasks: Local Kubernetes Deployment

**Input**: Design documents from `specs/003-k8s-local-deployment/`
**Prerequisites**: `plan.md`, `spec.md`

## Phase 1: Foundational Setup

**Purpose**: Create the core infrastructure artifacts that all other tasks depend on.

- [x] **T001**: Create the top-level `charts/` directory in the repository root.
- [x] **T002**: Initialize the parent Helm chart by running `helm create todo-app` inside the `charts/` directory.
- [x] **T003**: Initialize the backend sub-chart by running `helm create backend` inside the `charts/todo-app/charts/` directory.
- [x] **T004**: Initialize the frontend sub-chart by running `helm create frontend` inside the `charts/todo-app/charts/` directory.
- [x] **T005**: Clean up placeholder templates in all three newly created charts (remove default `.tpl` files, deployments, services, etc.).
- [x] **T006**: Configure the `todo-app` parent chart's `Chart.yaml` to list `backend` and `frontend` as dependencies.

---

## Phase 2: Containerization (Developer Story 1)

**Goal**: Package the frontend and backend applications into optimized container images.
**Independent Test**: Build both images successfully using `docker build`. Load images into minikube using `minikube image load <image-name>:<tag>`.

- [x] **T007** [US1]: Generate an initial `Dockerfile` for the FastAPI backend in `backend/Dockerfile` using Docker's AI or `docker init`.
- [x] **T008** [US1]: Refine the backend `Dockerfile` to be a multi-stage build. The final stage should be based on a python-slim image and contain only the necessary dependencies and application code.
- [x] **T009** [US1]: Generate an initial `Dockerfile` for the Next.js frontend in `frontend/Dockerfile`.
- [x] **T010** [US1]: Refine the frontend `Dockerfile` to be a multi-stage build. The final stage should use a minimal server (e.g., standalone Next.js server) to serve the production build artifacts.
- [x] **T011** [US1]: Add a build script or update `quickstart.md` with commands to build both Docker images and load them into Minikube.

---

## Phase 3: Helm Chart Implementation (Developer Stories 1, 2, 3)

**Goal**: Define the Kubernetes resources needed to run the application stack via Helm.
**Independent Test**: Deploy the chart successfully using `helm install`. Verify pods and services are created correctly with `kubectl get all`.

- [x] **T012** [US1]: Implement the backend Helm chart:
    - [ ] Create `charts/todo-app/charts/backend/templates/deployment.yaml`.
    - [ ] Create `charts/todo-app/charts/backend/templates/service.yaml` (Type: `ClusterIP`).
    - [ ] Update `charts/todo-app/charts/backend/values.yaml` with `image.repository` and `image.tag`.
- [x] **T013** [US3]: Implement the frontend Helm chart:
    - [ ] Create `charts/todo-app/charts/frontend/templates/deployment.yaml`.
    - [ ] Create `charts/todo-app/charts/frontend/templates/service.yaml` (Type: `LoadBalancer`).
    - [ ] Update `charts/todo-app/charts/frontend/values.yaml` with image settings.
- [x] **T014** [US2]: Implement secret management:
    - [ ] Modify the backend `deployment.yaml` to mount secrets from `todo-app-secrets` as environment variables.
    - [ ] Modify the frontend `deployment.yaml` to accept the backend URL as an environment variable (from the parent chart's `values.yaml`).
- [x] **T015** [US1]: Configure the parent `values.yaml` (`charts/todo-app/values.yaml`) to pass global values (like the backend service URL) to the sub-charts.
- [x] **T016** [US1]: Run `helm lint charts/todo-app` to ensure there are no syntax errors.
- [x] **T017** [US1]: Run `helm template charts/todo-app` and visually inspect the output to ensure the Kubernetes manifests are generated as expected.

---

## Phase 4: Documentation & Verification (Developer Stories 1, 2, 3)

**Goal**: Ensure the entire process is documented and works end-to-end.
**Independent Test**: Follow the `quickstart.md` from a clean state and successfully access the application in a browser.

- [x] **T018** [US2]: Finalize instructions in `quickstart.md` for creating the `.env` file and running `kubectl create secret`.
- [x] **T019** [US1]: Finalize the `helm install` command in `quickstart.md`.
- [x] **T020** [US3]: Finalize the `minikube tunnel` command and access instructions in `quickstart.md`.
- [x] **T021** [US1]: Finalize the `helm uninstall` and `kubectl delete secret` teardown commands in `quickstart.md`.
- [x] **T022** [US1, US2, US3]: Perform a full, end-to-end test of the entire workflow described in the final `quickstart.md`.
