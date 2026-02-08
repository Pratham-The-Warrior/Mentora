# Backend Architecture: Mentora (Proposed)

## Goal
Establish a robust, scalable backend architecture for Mentora that supports:
1.  **AI-Driven Mentorship**: High-performance data processing for personalized roadmap generation.
2.  **Structured Data**: Relational management of Users, Careers, Colleges, and Mentorship Content.
3.  **Security**: Industry-standard authentication and data protection.
4.  **Extensibility**: Modular design to easily add new features (e.g., real-time chat, video booking).

## Recommended Technology Stack

| Component | Choice | Justification |
| :--- | :--- | :--- |
| **Runtime** | **Node.js (TypeScript)** | Unified language with frontend; huge ecosystem. |
| **Framework** | **Express.js** | Minimalist, flexible, and widely used. Perfect for rapid development. |
| **Database** | **PostgreSQL** | Reliable, ACID-compliant, great for structured user profiles. |
| **ORM** | **Prisma** | Other-level DX, interactive migrations, type-safe queries. |
| **Auth** | **JWT + Passport** | Stateless authentication; secure and standard. |
| **AI Integration** | **Gemini API (via Google AI SDK)** | Powerful, cost-effective multimodal AI for generating roadmaps. |
| **Caching** | **Redis** (Optional later) | For caching API responses and AI results. |

## High-Level System Design

```mermaid
graph TD
    Client[React Frontend] -->|REST API| API_Server[Express.js Server]
    
    subgraph "Backend Structure (Layered)"
        API_Server --> Routes[Routes]
        Routes --> Controllers[Controllers]
        Controllers --> Services[Services (Business Logic)]
    end
    
    Auth_Module --> DB[(PostgreSQL)]
    User_Module --> DB
    Content_Module --> DB
    
    AI_Module --> LLM_Provider[OpenAI / Gemini API]
    AI_Module --> DB
```

## Database Schema Design (Key Entities)

*   **Users**: 
    *   `id`: UUID
    *   `email`: String (Unique)
    *   `password_hash`: String
    *   `role`: Enum (STUDENT, ADMIN)
    *   `createdAt`: Timestamp

*   **Profiles**: 
    *   `userId`: UUID (Foreign Key)
    *   `class`: Integer
    *   `stream`: String
    *   `goals`: String
    *   `interests`: JSONB
    *   `learningStyle`: String

*   **Roadmaps**: 
    *   `id`: UUID
    *   `userId`: UUID (Foreign Key)
    *   `status`: Enum (GENERATING, COMPLETED, FAILED)
    *   `content`: JSONB (Stores full roadmap structure)
    *   `createdAt`: Timestamp
    *   `updatedAt`: Timestamp

## Critical Logic Flows for Robustness

### 1. Robust Roadmap Generation Logic
**Challenge**: Roadmap generation involves multiple steps (AI call -> Parsing -> Saving to DB). If any step fails, we don't want a "broken" roadmap.
**Solution**: Transactional Logic.
1.  **Frontend**: User clicks "Generate" -> Show loading spinner (no need for complex background queues).
2.  **Backend**:
    *   Start a *Database Transaction*.
    *   Create `Roadmap` entry with status `GENERATING`.
    *   Call AI Service. **Try/Catch block is critical here.**
    *   If AI fails: Rollback transaction, delete the partial `Roadmap` entry, return error to user.
    *   If AI succeeds: Parse JSON, save `RoadmapSteps` in same transaction, update status to `COMPLETED`.
    *   Commit Transaction.
3.  **Result**: The database never has "half-created" roadmaps. It's all or nothing.

### 2. Data Integrity Rules
*   **Foreign Keys**: Use `ON DELETE CASCADE`. If a User is deleted, their Profile and Roadmap mock data should automatically vanish.
*   **Unique Constraints**: A user should only have *one* active Profile at a time to avoid logic conflicts.
*   **Validation**: Even simple projects need strict input validation (e.g. `class` cannot be "13"). We will use DTOs to ensure data improved quality.

### 3. Graceful Error Handling
*   Instead of crashing the server, wrap async logic in `try/catch`.
*   Return standard HTTP codes:
    *   `400` for bad input (e.g. missing fields).
    *   `401` for unauthorized access.
    *   `500` for server errors (but log the actual error internally).

## API Structure (REST)

### Auth
*   `POST /auth/signup`: Create new user.
*   `POST /auth/login`: Authenticate and return JWT.
*   `GET /auth/profile`: Get current user info (Guarded).

### Onboarding & Profile
*   `POST /profile`: Create/Update user profile.
*   `GET /profile`: Get full profile details.

### Roadmap
*   `POST /roadmap/generate`: Trigger AI generation (Async).
*   `GET /roadmap`: Get current user's roadmap.
*   `PATCH /roadmap/step/:id`: Update step status.

## Phase-Wise Implementation Plan

Since the **Frontend UI is already complete**, our backend implementation strategy is "API-First" to match the existing frontend needs.

### Phase 1: Foundation & Database Setup (Week 1)
*   **Goal**: Get the server running and connected to a database.
*   **Tasks**:
    1.  Initialize Express project (`npm init`, install `express`, `typescript`, etc.).
    2.  Set up **PostgreSQL** (locally or via Docker).
    3.  Define **Prisma Schema** matching our `auth-navbar.tsx` and `Onboarding.tsx` data shapes.
    4.  Implement Global Error Handling Middleware & Zod Validation.

### Phase 2: Authentication & User Profiles (Week 1-2)
*   **Goal**: Replace `localStorage` mock auth with real JWTs.
*   **Tasks**:
    1.  Implement `auth.service.ts` (Signup, Login, Validate User).
    2.  Create `authenticateJWT` middleware to protect routes.
    3.  Build `profile.controller.ts` to save/fetch:
        *   `class` (11/12)
        *   `stream` (PCM/PCB/Commerce)
        *   `interests` (JSON array)

### Phase 3: Core Data APIs (Week 2)
*   **Goal**: Serve dynamic content for Colleges and Careers.
*   **Tasks**:
    1.  Create `Career` and `College` tables in Postgres.
    2.  Write a **Seeding Script** to populate the DB with the static data currently in `src/data/*.ts`.
    3.  Build GET endpoints with filtering (e.g., `GET /colleges?region=USA`).

### Phase 4: AI Roadmap Generation with Gemini (Week 3)
*   **Goal**: Connect the `RoadmapCreatorModal` to real AI.
*   **Tasks**:
    1.  Get **Google Gemini API Key**.
    2.  Create `gemini.service.ts`.
    3.  Design the **System Prompt**:
        *   *Input*: User Profile (Class 12, PCM, Interest: Robotics).
        *   *Output*: JSON structure matching our `Roadmap` frontend component.
    4.  Implement `POST /roadmap/generate`:
        *   Calls Gemini API.
        *   Validates JSON response.
        *   Saves to DB.
        *   Returns result to Frontend.

### Phase 5: Frontend wiring (Week 3-4)
*   **Goal**: Connect React to Express.js.
*   **Tasks**:
    1.  Replace `fakeLogin()` in `Login.tsx` with `axios.post('/auth/login')`.
    2.  Update `Dashboard.tsx` to fetch data from `/profile`.
    3.  Update `RoadmapCreatorModal.tsx` to call `/roadmap/generate`.
