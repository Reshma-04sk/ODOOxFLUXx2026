# PlanLedger Contribution & Branching Guide

## 1. Branch Strategy

All developers branch from and merge into `main`:

```
main
├── feat/backend-*      (M1: Reshma Shaik)
├── feat/frontend-*     (M2: Gayathri Devi G)
├── feat/integration-*  (Shared feature branches)
├── fix/backend-*       (Backend bug fixes)
├── fix/frontend-*      (Frontend bug fixes)
└── docs/*              (Contract and guide updates)
```

## 2. Commit Message Standard (Conventional Commits)
Format: `<type>(<scope>): <subject>`

Examples:
- `feat(api): implement subscription creation and renewal logic`
- `feat(web): build modern subscription comparison table`
- `fix(billing): prevent duplicate invoice generation with period uniqueness`
- `docs(contract): document invoice refund endpoint schema`

## 3. Pull Request Requirements
- Complete the `.github/PULL_REQUEST_TEMPLATE.md`.
- All automated unit tests must pass (`python manage.py test tests`).
- Linter and TypeScript checks must pass (`npx tsc --noEmit && npm run lint`).
