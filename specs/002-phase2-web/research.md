# Research & Decisions for Phase 2 Web App

## Technology Stack

The following technologies were selected based on the feature specification and user request.

- **Backend Framework**: FastAPI
- **Frontend Framework**: Next.js
- **Styling**: Tailwind CSS
- **Database ORM**: SQLModel
- **Database**: PostgreSQL (hosted on Neon)

## Key Decisions

### Decision 1: Database Connection Management

- **Decision**: The PostgreSQL database connection string will not be hardcoded. It will be managed via an environment variable.
- **Rationale**: This is a security best practice. It decouples the application from a specific database instance and avoids committing sensitive credentials to version control. For local development, this variable will be loaded from a `.env` file, which will be listed in `.gitignore`.
- **Alternatives Considered**:
  - Hardcoding the string: Insecure and inflexible.
  - Storing in a config file: Better than hardcoding, but still risks committing credentials. Using environment variables is the standard.

### Decision 2: Backend Project Structure

- **Decision**: A simple, single-file structure (`backend/main.py`) will be used initially.
- **Rationale**: For the scope of the current feature (a single `Task` entity), a single file is sufficient and easy to understand. The project can be refactored into a more complex structure (e.g., using FastAPI's routers and a service layer) if more features are added.
- **Alternatives Considered**:
  - A full-fledged structure with routers, services, and models separated: Over-engineering for the current requirements.

### Decision 3: Frontend State Management

- **Decision**: Initially, React's built-in state management (e.g., `useState`, `useEffect`) will be used.
- **Rationale**: The application's state is simple and doesn't warrant a more complex solution like Redux or Zustand at this stage. We can rely on component-level state and fetching data on component mount.
- **Alternatives Considered**:
  - Redux/Zustand: Adds unnecessary complexity for the current scope. Can be introduced later if the application grows.
