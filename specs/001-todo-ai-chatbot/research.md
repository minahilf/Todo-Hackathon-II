# Research Findings: Todo AI Chatbot (Stateless + MCP)

**Date**: 2025-12-26
**Feature**: [specs/001-todo-ai-chatbot/spec.md](specs/001-todo-ai-chatbot/spec.md)
**Plan**: [specs/001-todo-ai-chatbot/plan.md](specs/001-todo-ai-chatbot/plan.md)

## Resolution of NEEDS CLARIFICATION

### Frontend Testing Frameworks

**Question**: Specific testing frameworks to be used in frontend.
**Decision**: Jest (for unit testing) and React Testing Library (for component/integration testing).
**Rationale**: Jest is a widely adopted JavaScript testing framework known for its simplicity and performance, especially with React. React Testing Library focuses on testing component behavior in a way that mimics user interaction, encouraging more robust and user-centric tests. These two frameworks are industry standards for React/Next.js applications and provide comprehensive testing capabilities.
**Alternatives considered**: Cypress (for E2E testing, but not explicitly requested for initial phase), Enzyme (older alternative to React Testing Library).

## Other Research (if any)
[Any other research conducted]
