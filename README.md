A professional documentation including the CI/CD + deployment documentation you completed.
```markdown
# OWC Website

A full-stack web application with automated CI/CD deployment using GitHub Actions, a self-hosted Ubuntu server runner, and PM2 process management.

---

## Technology Stack

### Frontend
- React
- Vite
- TypeScript
- Tailwind CSS

### Backend
- Node.js
- API Server
- TypeScript

### Database
- PostgreSQL
- Drizzle ORM

### Deployment
- Ubuntu Server
- GitHub Actions
- Self-hosted GitHub Actions Runner
- PM2 Process Manager

---

# Project Structure

```
owc-website/
│
├── artifacts/
│   ├── owc-website/        # Frontend application
│   └── api-server/         # Backend API
│
├── lib/
│   └── db/                 # Database configuration
│
├── .github/
│   └── workflows/
│       └── ci.yml          # CI/CD pipeline
│
├── deploy.sh               # Automated deployment script
├── ecosystem.config.cjs    # PM2 configuration
└── README.md

````

---

# Local Development Setup

## Requirements

Install:

- Node.js 20+
- pnpm
- PostgreSQL


## Install dependencies

```bash
pnpm install
````

---

## Configure environment variables

Create:

```
.env
```

Example:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/database
PORT=5177
```

---

## Run database migration

```bash
cd lib/db

pnpm drizzle-kit push
```

---

## Start development servers

Frontend:

```bash
cd artifacts/owc-website

pnpm dev
```

Backend:

```bash
cd artifacts/api-server

pnpm dev
```

---

# CI/CD Pipeline

The project uses GitHub Actions for continuous integration and deployment.

Workflow file:

```
.github/workflows/ci.yml
```

---

## Pipeline Trigger

The pipeline runs on:

* Push to `main`
* Push to `staging`
* Pull requests to `main`

---

# Continuous Integration (CI)

The CI stage performs:

### 1. Checkout source code

Uses:

```
actions/checkout@v4
```

---

### 2. Setup environment

* Node.js 20
* pnpm package manager

---

### 3. Install dependencies

```bash
pnpm install --no-frozen-lockfile
```

---

### 4. Database verification

A PostgreSQL service container is started:

```
postgres:15
```

Database schema is pushed using:

```bash
pnpm drizzle-kit push
```

---

### 5. Type checking

```bash
pnpm typecheck
```

---

### 6. API tests

```bash
cd artifacts/api-server

pnpm test
```

---

### 7. Build verification

The application build is tested:

```bash
pnpm build
```

---

# Continuous Deployment (CD)

Deployment runs after successful CI.

Deployment only occurs from:

```
staging branch
```

---

## Deployment Architecture

```
GitHub Repository

        |
        |
        v

GitHub Actions

        |
        |
        v

Self-hosted Ubuntu Runner

        |
        |
        v

deploy.sh

        |
        |
        +---- git pull staging
        |
        +---- pnpm install
        |
        +---- build frontend
        |
        +---- build API
        |
        +---- PM2 reload
```

---

# Deployment Script

File:

```
deploy.sh
```

The deployment script:

1. Pulls latest staging changes

```bash
git pull origin staging
```

2. Installs dependencies

```bash
pnpm install
```

3. Builds frontend

```bash
cd artifacts/owc-website

pnpm build
```

4. Builds API

```bash
cd artifacts/api-server

pnpm build
```

5. Reloads applications

```bash
pm2 reload ecosystem.config.cjs
```

---

# PM2 Process Management

The application runs using PM2.

Current processes:

| Process | Purpose     | Status |
| ------- | ----------- | ------ |
| owc-api | Backend API | Online |
| owc-web | Frontend    | Online |

Check status:

```bash
pm2 list
```

View logs:

```bash
pm2 logs
```

---

# Zero Downtime Deployment

The deployment uses:

```bash
pm2 reload
```

instead of stopping and starting applications.

This allows:

* Existing requests to finish
* New version to start
* Minimal service interruption

---

# Deployment Verification

After deployment:

```bash
pm2 list
```

Expected:

```
owc-api   online
owc-web   online
```

---

# Git Workflow

Development flow:

```
Feature branch
       |
       v
Pull Request
       |
       v
main
       |
       v
staging
       |
       v
Automatic Deployment
```

# Author

Keison Tipiou

```

This README now documents the exact system I built, matching actual setup:
- `staging` deployment
- self-hosted runner
- `deploy.sh`
- PM2 `owc-api` + `owc-web`
- GitHub Actions pipeline
```
