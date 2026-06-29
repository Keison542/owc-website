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
- Express.js
- TypeScript

### Database
- PostgreSQL
- Drizzle ORM

### Deployment
- Ubuntu Server 24.04
- GitHub Actions
- Self-hosted GitHub Actions Runner
- PM2 Process Manager

---

## Project Structure

```
owc-website/
│
├── artifacts/
│   ├── owc-website/                 # Frontend application (React + Vite)
│   │   ├── src/
│   │   ├── public/
│   │   ├── package.json
│   │   └── vite.config.ts
│   │
│   └── api-server/                  # Backend API (Node.js + Express)
│       ├── src/
│       ├── tests/
│       ├── package.json
│       └── tsconfig.json
│
├── lib/
│   └── db/                          # Database configuration
│       ├── drizzle/
│       ├── schema/
│       ├── migrations/
│       └── drizzle.config.ts
│
├── .github/
│   └── workflows/
│       └── ci.yml                   # CI/CD pipeline configuration
│
├── deploy.sh                        # Automated deployment script
├── ecosystem.config.cjs             # PM2 process configuration
├── package.json                     # Root package.json (workspace)
├── pnpm-workspace.yaml              # pnpm workspace configuration
└── README.md
```

### Key Directories Explained

| Directory | Purpose |
|-----------|---------|
| `artifacts/owc-website/` | Frontend React application served to users |
| `artifacts/api-server/` | Backend API handling data requests |
| `lib/db/` | Database schema, migrations, and Drizzle ORM setup |
| `.github/workflows/` | GitHub Actions CI/CD pipeline definitions |
| `deploy.sh` | Script executed by the self-hosted runner for deployment |

---

## Local Development Setup

### Requirements

Install:

- Node.js 20+
- pnpm (package manager)
- PostgreSQL 15+

### Install Dependencies

```bash
pnpm install
```

### Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/owc_db

# Frontend
VITE_API_URL=http://localhost:5177

# Backend
PORT=5177
NODE_ENV=development
```

### Run Database Migrations

```bash
cd lib/db
pnpm drizzle-kit push
```

### Start Development Servers

**Frontend** (http://localhost:5173):
```bash
cd artifacts/owc-website
pnpm dev
```

**Backend API** (http://localhost:5177):
```bash
cd artifacts/api-server
pnpm dev
```

---

## CI/CD Pipeline

The project uses GitHub Actions for continuous integration and deployment.

**Workflow file**: `.github/workflows/ci.yml`

### Pipeline Triggers

| Event | Branch |
|-------|--------|
| Push | `main`, `staging` |
| Pull Request | `main` |

---

## Continuous Integration (CI)

The CI stage performs the following checks:

### 1. Checkout Source Code
```yaml
- uses: actions/checkout@v4
```

### 2. Setup Environment
- Node.js 20
- pnpm package manager

### 3. Install Dependencies
```bash
pnpm install --no-frozen-lockfile
```

### 4. Database Verification
A PostgreSQL 15 service container is started for testing:
```yaml
services:
  postgres:
    image: postgres:15
```

Schema is pushed using:
```bash
cd lib/db
pnpm drizzle-kit push
```

### 5. Type Checking
```bash
pnpm typecheck
```

### 6. API Tests
```bash
cd artifacts/api-server
pnpm test
```

### 7. Build Verification
```bash
pnpm build
```

---

## Continuous Deployment (CD)

Deployment runs automatically **after successful CI** and only from the **staging** branch.

### Deployment Architecture

```
┌─────────────────┐
│   GitHub Repo   │
│   (staging)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  GitHub Actions │
│   Runner        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  deploy.sh      │
└────────┬────────┘
         │
         ├── git pull origin staging
         ├── pnpm install
         ├── build frontend
         ├── build API
         └── PM2 reload
```

---

## Deployment Script

**File**: `deploy.sh`

```bash
#!/bin/bash
# OWC Website Deployment Script

echo "🚀 Starting deployment..."

# 1. Pull latest changes
git pull origin staging

# 2. Install dependencies
pnpm install

# 3. Build frontend
cd artifacts/owc-website
pnpm build

# 4. Build API
cd ../api-server
pnpm build

# 5. Reload applications
cd ../../
pm2 reload ecosystem.config.cjs

echo "✅ Deployment completed successfully!"
```

---

## PM2 Process Management

The application runs using PM2 for process management.

### Current Processes

| Process Name | Purpose | Port | Status |
|--------------|---------|------|--------|
| `owc-api` | Backend API Server | 5177 | Online |
| `owc-web` | Frontend Application | 5173 | Online |

### PM2 Commands

| Command | Description |
|---------|-------------|
| `pm2 list` | Show all running processes |
| `pm2 logs` | View logs for all processes |
| `pm2 logs owc-api` | View logs for API only |
| `pm2 status` | Check process status |
| `pm2 monit` | Monitor resource usage |

### PM2 Configuration

**File**: `ecosystem.config.cjs`

```javascript
module.exports = {
  apps: [
    {
      name: 'owc-api',
      script: 'artifacts/api-server/dist/index.js',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 5177
      }
    },
    {
      name: 'owc-web',
      script: 'artifacts/owc-website/dist/index.js',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 5173
      }
    }
  ]
};
```

---

## Zero Downtime Deployment

The deployment uses `pm2 reload` instead of stopping and starting applications.

**Benefits:**
- Existing requests finish processing
- New version starts without interruption
- Minimal service disruption

---

## Deployment Verification

After deployment, verify the services:

```bash
# Check PM2 status
pm2 list

# Expected output:
# ┌─────────┬──────┬─────────┬─────────┬──────────┐
# │ Name    │ mode │ status  │ restart │ uptime   │
# ├─────────┼──────┼─────────┼─────────┼──────────┤
# │ owc-api │ fork │ online  │ 0       │ 2h       │
# │ owc-web │ fork │ online  │ 0       │ 2h       │
# └─────────┴──────┴─────────┴─────────┴──────────┘

# Check logs for errors
pm2 logs --err --lines 20
```

---

## Git Workflow

```
┌─────────────────┐
│  Feature Branch │
│  (feature/xxx)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Pull Request   │
│  → main         │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│       main      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│     staging     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    Automatic    │
│   Deployment    │
└─────────────────┘
```

---

## Deployment Checklist

- [ ] GitHub Actions workflow passes
- [ ] All CI tests completed
- [ ] Build successful
- [ ] Self-hosted runner connected
- [ ] Deployment script executed
- [ ] PM2 processes are online
- [ ] Application accessible at production URL

---

## Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| Runner offline | Check runner service: `sudo systemctl status actions-runner` |
| PM2 processes offline | Check logs: `pm2 logs` |
| Build fails | Check Node.js version: `node -v` |
| Database connection | Verify DATABASE_URL in environment |

### View Runner Logs
```bash
sudo journalctl -u actions-runner -f
```

### Restart PM2 Processes
```bash
pm2 restart all
pm2 reload ecosystem.config.cjs
```

---

## Author

**Keison Tipiou**

---

## License

© OWC Website. All rights reserved.
```
