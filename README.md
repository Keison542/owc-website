Here's the professionally organized documentation with proper formatting:

```markdown
# OWC Website

A full-stack web application with automated CI/CD deployment using GitHub Actions, a self-hosted Ubuntu server runner, and PM2 process management.

---

## Table of Contents

1. [Technology Stack](#technology-stack)
2. [Project Structure](#project-structure)
3. [Local Development Setup](#local-development-setup)
4. [CI/CD Pipeline](#cicd-pipeline)
5. [Deployment Script](#deployment-script)
6. [PM2 Process Management](#pm2-process-management)
7. [Zero Downtime Deployment](#zero-downtime-deployment)
8. [Git Workflow](#git-workflow)

---

## Technology Stack

### Frontend
- **React** - UI library
- **Vite** - Build tool
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling

### Backend
- **Node.js** - Runtime
- **API Server** - REST API
- **TypeScript** - Type safety

### Database
- **PostgreSQL** - Database
- **Drizzle ORM** - Database ORM

### Deployment
- **Ubuntu Server** - Host OS
- **GitHub Actions** - CI/CD
- **Self-hosted GitHub Actions Runner** - Deployment executor
- **PM2 Process Manager** - Process management

---

## Project Structure

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
```

---

## Local Development Setup

### Requirements

Install the following:

- **Node.js 20+**
- **pnpm** (package manager)
- **PostgreSQL** (database)

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/database
PORT=5177
```

### 3. Run Database Migration

```bash
cd lib/db
pnpm drizzle-kit push
```

### 4. Start Development Servers

**Frontend:**
```bash
cd artifacts/owc-website
pnpm dev
```

**Backend API:**
```bash
cd artifacts/api-server
pnpm dev
```

---

## CI/CD Pipeline

The project uses **GitHub Actions** for continuous integration and deployment.

**Workflow file:** `.github/workflows/ci.yml`

### Pipeline Triggers

| Event | Branch |
|-------|--------|
| Push | `main` |
| Push | `staging` |
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

A PostgreSQL service container is started:

```yaml
services:
  postgres:
    image: postgres:15
```

Database schema is pushed:

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

**Deployment runs after successful CI.**

### Deployment Branch

Deployment **only occurs** from the `staging` branch.

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
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Self-hosted     │
│ Ubuntu Runner   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   deploy.sh     │
└────────┬────────┘
         │
         ├── git pull staging
         ├── pnpm install
         ├── build frontend
         ├── build API
         └── PM2 reload
```

---

## Deployment Script

**File:** `deploy.sh`

### Script Steps

1. **Pull latest staging changes**
   ```bash
   git pull origin staging
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Build frontend**
   ```bash
   cd artifacts/owc-website
   pnpm build
   ```

4. **Build API**
   ```bash
   cd artifacts/api-server
   pnpm build
   ```

5. **Reload applications**
   ```bash
   pm2 reload ecosystem.config.cjs
   ```

---

## PM2 Process Management

The application runs using **PM2 Process Manager**.

### Current Processes

| Process | Purpose | Status |
|---------|---------|--------|
| `owc-api` | Backend API | Online |
| `owc-web` | Frontend | Online |

### PM2 Commands

| Command | Description |
|---------|-------------|
| `pm2 list` | Show all running processes |
| `pm2 logs` | View logs for all processes |
| `pm2 logs owc-api` | View logs for API only |
| `pm2 status` | Check process status |
| `pm2 monit` | Monitor resource usage |

### PM2 Configuration

**File:** `ecosystem.config.cjs`

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

The deployment uses **`pm2 reload`** instead of stopping and starting applications.

### Benefits

- ✅ Existing requests finish processing
- ✅ New version starts without interruption
- ✅ Minimal service disruption

### Before (Stop/Start)
```
Stop app → Downtime → Start app
```

### After (Reload)
```
Load new version → Switch → Zero downtime
```

---

## Deployment Verification

After deployment, verify the services are running:

```bash
pm2 list
```

**Expected output:**

```
┌─────────┬──────┬─────────┬─────────┬──────────┐
│ Name    │ mode │ status  │ restart │ uptime   │
├─────────┼──────┼─────────┼─────────┼──────────┤
│ owc-api │ fork │ online  │ 0       │ 2h       │
│ owc-web │ fork │ online  │ 0       │ 2h       │
└─────────┴──────┴─────────┴─────────┴──────────┘
```

---

## Git Workflow

```
┌─────────────────┐
│  Feature Branch │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Pull Request   │
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
│  Deploy to      │
│  Production     │
└─────────────────┘
```

---

## Deployment Checklist

- [ ] GitHub Actions workflow passes
- [ ] CI tests completed
- [ ] Build successful
- [ ] Self-hosted runner connected
- [ ] Deployment script executed
- [ ] PM2 processes online
- [ ] Application accessible

---

## Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| Runner offline | `sudo systemctl status actions-runner` |
| PM2 processes offline | `pm2 logs` |
| Build fails | Check Node.js version `node -v` |
| Database connection | Verify DATABASE_URL |

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

## Key Improvements Made:

1. **Added Table of Contents** - Easy navigation
2. **Organized sections** with consistent formatting
3. **Better visual hierarchy** using proper headings
4. **Added visual diagrams** for deployment architecture
5. **Improved tables** for process and command lists
6. **Added bullet points** for readability
7. **Consistent code blocks** with proper language identifiers
8. **Added benefits section** for zero downtime deployment
9. **Added deployment checklist**
10. **Added troubleshooting section** with common issues
