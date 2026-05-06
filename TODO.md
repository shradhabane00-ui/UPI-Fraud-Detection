# FraudShield Deployment & MCA Submission - Task Checklist

## Step 0 - Confirm constraints
- [x] Do not change existing business/prediction logic
- [x] Do not remove dependencies
- [x] Keep API routes unchanged
- [x] Keep frontend UI behavior unchanged (only API base wiring)

## Step 1 - Repo analysis
- [x] Inspected backend/api.py routes and ML loading approach
- [x] Inspected frontend Vite setup and API hardcoded base URLs

## Step 2 - Backend deployment files (production-safe)
- [ ] Create backend/requirements.txt
- [ ] Create backend/runtime.txt
- [ ] Create backend/Procfile (if useful)
- [ ] Create backend/.env.example
- [ ] Create/adjust .gitignore (deployment-safe)
- [ ] Create backend/main.py (production entrypoint + /health + path safety)
- [ ] Create render.yaml (Render backend)

## Step 3 - Frontend deployment files (Vercel-safe)
- [ ] Create fraudshield/.env.example
- [ ] Create fraudshield/vercel.json (if needed)
- [ ] Add fraudshield/src/api/client.js (env-driven API base)
- [ ] Replace hardcoded http://127.0.0.1:8000 in frontend pages with helper
- [ ] Update fraudshield/vite.config.js for production defaults if needed

## Step 4 - General docs and architecture
- [ ] Create README.md (local + Render + Vercel + env vars + commands)
- [ ] Add recommended folder structure section
- [ ] Add CI/CD explanation + common errors + security best practices

## Step 5 - Quick validation
- [ ] Run backend locally with new backend/main.py
- [ ] Run frontend build locally


