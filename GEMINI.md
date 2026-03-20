# Finance Tracker v1.0 — Agent Context

## Stack
- Frontend: React (Vite), Tailwind CSS, Recharts, react-query, react-hook-form
- Backend: Python FastAPI, SQLAlchemy (async), PostgreSQL, Alembic, JWT Auth
- Auth: JWT tokens in localStorage, Bearer header
- Icons: lucide-react | Toasts: react-hot-toast

## Project Structure
- /backend → FastAPI app (app/models, app/routers, app/schemas, app/utils)
- /frontend → Vite React app (src/pages, src/components, src/api, src/context)

## Rules
- ALL backend DB calls must be async (AsyncSession + asyncpg)
- UUID primary keys for all tables
- Tailwind CSS only — no other CSS frameworks
- Use react-query for all API calls on frontend
- CORS allow: http://localhost:5173
- Currency prefix: ₹ (Indian Rupee)

## Reference File
See finance_tracker_project_map.md for the full detailed spec.
