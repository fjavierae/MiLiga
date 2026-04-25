# 🏆 League Management System

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Bun](https://img.shields.io/badge/Bun-%23000000.svg?style=for-the-badge&logo=bun&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app), designed to manage football leagues, teams, players, and matches using **Server Actions** and a robust **PostgreSQL** backend.

## Getting Started

### 1. Prerequisites
Ensure you have [Docker](https://www.docker.com/) and [Bun](https://bun.sh/) installed.

### 2. Infrastructure Setup
Launch the dual-database environment (Development & Testing) using Docker Compose:

```bash
docker-compose up -d
```

This will initialize:

* PostgreSQL (Dev) on port 5432.

* PostgreSQL (Test) on port 5433.

* Automatic schema application via database_schema.sql.

### 3. Development Server
Install dependencies and start the local server:

```bash
bun install
bun dev
```
Open http://localhost:3000 with your browser to see the result.

### Project Structure
The project follows a modular architecture for data management using Server Actions:


```text
my-league/
├── app/                # Next.js App Router (Pages, Layouts, and API)
├── src/
│   ├── actions/        # Server Actions for Database CRUD operations
│   │   ├── league.ts   # League management
│   │   ├── match.ts    # Match scheduling
│   │   ├── player.ts   # Player roster & profile updates
│   │   └── team.ts     # Team registration & deletion
│   ├── lib/
│   │   └── db.ts       # Database connection pool & query utility
│   ├── tests/          # Integration tests (Vitest)
│   │   └── actions.test.ts
│   └── types/          # TypeScript interfaces and definitions
├── database_schema.sql # PostgreSQL initial schema
├── docker-compose.yml  # Docker container configuration
└── package.json        # Project dependencies and scripts
```

Key Directories Description

* src/actions/: Contains the core business logic. These are "Server Actions" that interact directly with PostgreSQL.

* src/lib/: Contains the database driver configuration (pg) to manage connections to the Docker containers.

* src/tests/: Contains integration tests that run against the postgres_test container to ensure API reliability without polluting production data.

* src/types/: Centralized TypeScript definitions used across the entire application for type safety.

### 🔑 Authentication Standards
* **Credential Validation:** Always use `bcrypt.compare` to verify passwords. Do not implement custom comparison logic.
* **Session Security:** Cookies must be set with `httpOnly: true` and `sameSite: "lax"` as a project standard.
* **Async Cookies:** Since Next.js 15, `cookies()` is an async function. Always `await` it before performing `get` or `set` operations.