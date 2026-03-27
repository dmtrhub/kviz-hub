# KvizHub

KvizHub is a full-stack quiz platform where users can solve quizzes, track progress, and compete on a leaderboard, while admins manage quiz content.

---

## Portfolio Highlights

- Full-stack project with clear layered backend architecture (`Api`, `Application`, `Infrastructure`, `Domain`)
- JWT authentication and role-based behavior (User/Admin)
- SQL Server + EF Core persistence with seeding and migrations
- Dockerized local environment (frontend + backend + database)
- Automated tests with practical split:
  - **70% Unit tests** (`Application`)
  - **20% Integration tests** (`API` pipeline)
  - **10% E2E smoke tests**

---

## Features

- Quiz browsing with filters (category, difficulty, keyword)
- Quiz solving flow with attempt tracking
- User results and history
- Global leaderboard
- Admin management for quizzes, questions, and categories

---

## Tech Stack

- **Frontend:** React, TypeScript, Vite
- **Backend:** ASP.NET Core (.NET 9), C#
- **Data:** Entity Framework Core, SQL Server 2022
- **Auth:** JWT Bearer tokens
- **Validation:** FluentValidation
- **Containerization:** Docker, Docker Compose
- **Testing:** xUnit, Moq, ASP.NET Core test host

---

## Project Structure

```text
kviz-hub/
├── backend/
│   ├── Api/
│   ├── Application/
│   ├── Infrastructure/
│   ├── Domain/
│   └── tests/
│       ├── KvizHub.Application.Tests/
│       ├── KvizHub.Api.IntegrationTests/
│       └── KvizHub.Api.E2ETests/
├── frontend/
│   └── kviz-hub-ui/
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## Screenshots

> Create folder: `docs/images/`

1. **Home / Quiz Catalog**
   - Suggested file: `docs/images/home-quiz-catalog.png`
   - Show filters and quiz cards

   `![Home - Quiz Catalog](docs/images/home-quiz-catalog.png)`

2. **Quiz Solving Screen**
   - Suggested file: `docs/images/quiz-attempt.png`
   - Show question UI and answer selection

   `![Quiz Attempt](docs/images/quiz-attempt.png)`

3. **Results Screen**
   - Suggested file: `docs/images/results-screen.png`
   - Show score, percentage, duration, and summary

   `![Results](docs/images/results-screen.png)`

4. **Leaderboard**
   - Suggested file: `docs/images/leaderboard.png`
   - Show ranking table

   `![Leaderboard](docs/images/leaderboard.png)`

5. **Admin Panel (optional but recommended)**
   - Suggested file: `docs/images/admin-panel.png`
   - Show quiz/question/category management

   `![Admin Panel](docs/images/admin-panel.png)`

---

## Getting Started (Docker)

### Prerequisites

- Docker Desktop
- Git

### 1) Clone repository

```bash
git clone https://github.com/dmtrhub/kviz-hub.git
cd kviz-hub
```

### 2) Create local `.env`

Linux/macOS:

```bash
cp .env.example .env
```

Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

### 3) Configure `.env`

Fill in real local values in `.env` (example keys):

- `SA_PASSWORD`
- `DATABASE_NAME`
- `JWT_KEY`
- `JWT_ISSUER`
- `JWT_AUDIENCE`
- `VITE_API_BASE_URL`
- `VITE_AVATAR_URL`

> `.env` contains real local secrets and **must not** be committed.
> `.env.example` is a sanitized template for GitHub.

### 4) Start services

```bash
docker compose up --build -d
```

### 5) Open app

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:7033`
- Swagger UI: `http://localhost:7033`

---

## Seeded Development Users

- Admin: `admin` / `Admin123!`
- User: `dmtr` / `User123!`
- User: `marija` / `User123!`

*(for local development/testing only)*

---

## Testing

Run all tests:

```bash
dotnet test backend/KvizHub.sln
```

Test projects:

- `backend/tests/KvizHub.Application.Tests` (unit)
- `backend/tests/KvizHub.Api.IntegrationTests` (integration)
- `backend/tests/KvizHub.Api.E2ETests` (e2e smoke)

---

## Notes for Recruiters / Reviewers

- This project demonstrates practical backend layering and clean separation of concerns.
- Test strategy is intentionally split to balance speed and confidence.
- Docker setup is included for reproducible local execution.

---

## License

This project is for portfolio and educational use.
