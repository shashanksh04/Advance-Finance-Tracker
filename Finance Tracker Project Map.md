# 🏦 Advanced Finance Tracker v1.0 — Project Map

> **Stack:** React (Vite) · FastAPI · PostgreSQL · SQLAlchemy · JWT Auth  
> **Target:** Full-stack finance tracker with auth, dashboard, transactions, reports, and profile  
> **How to use:** Feed each section as a prompt to Gemini in VS Code in order.

---

## 📁 Final Project Structure

```
finance-tracker/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── database.py
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   ├── user.py
│   │   │   └── transaction.py
│   │   ├── schemas/
│   │   │   ├── __init__.py
│   │   │   ├── user.py
│   │   │   └── transaction.py
│   │   ├── routers/
│   │   │   ├── __init__.py
│   │   │   ├── auth.py
│   │   │   ├── transactions.py
│   │   │   ├── dashboard.py
│   │   │   └── profile.py
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── auth_service.py
│   │   │   └── transaction_service.py
│   │   └── utils/
│   │       ├── __init__.py
│   │       ├── jwt_handler.py
│   │       └── password_handler.py
│   ├── requirements.txt
│   ├── .env
│   └── alembic/
│       ├── env.py
│       └── versions/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── main.jsx
│   │   ├── App.jsx
│   │   ├── api/
│   │   │   ├── axiosInstance.js
│   │   │   ├── authApi.js
│   │   │   ├── transactionApi.js
│   │   │   └── profileApi.js
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── components/
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── AddTransactionModal.jsx
│   │   │   ├── TransactionTable.jsx
│   │   │   ├── SummaryCards.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── TransactionsPage.jsx
│   │   │   ├── ReportsPage.jsx
│   │   │   └── ProfilePage.jsx
│   │   └── styles/
│   │       └── global.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── .gitignore
└── README.md
```

---

## ⚙️ PHASE 1 — Environment & Database Setup

### 1.1 — PostgreSQL Database Setup

**Prompt for Gemini:**
> "Create a PostgreSQL database named `finance_tracker_db` with a user `finance_user` and password `securepassword123`. Give me the SQL commands to run in psql terminal."

**Manual Steps (run in psql or pgAdmin):**
```sql
CREATE DATABASE finance_tracker_db;
CREATE USER finance_user WITH ENCRYPTED PASSWORD 'securepassword123';
GRANT ALL PRIVILEGES ON DATABASE finance_tracker_db TO finance_user;
```

---

### 1.2 — Python Virtual Environment Setup

**Prompt for Gemini:**
> "Set up a Python virtual environment for a FastAPI project inside a folder called `backend`. Include commands for Windows and Linux/macOS."

**Manual Commands:**
```bash
cd finance-tracker
mkdir backend && cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

---

### 1.3 — Backend Dependencies (requirements.txt)

**Prompt for Gemini:**
> "Create a `requirements.txt` for a FastAPI project that uses PostgreSQL with SQLAlchemy (async), Alembic for migrations, JWT authentication with python-jose, password hashing with passlib[bcrypt], environment variables with python-dotenv, CORS support, and file upload support."

**File: `backend/requirements.txt`**
```
fastapi==0.111.0
uvicorn[standard]==0.29.0
sqlalchemy==2.0.30
asyncpg==0.29.0
alembic==1.13.1
psycopg2-binary==2.9.9
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-dotenv==1.0.1
python-multipart==0.0.9
pillow==10.3.0
httpx==0.27.0
pydantic[email]==2.7.1
pydantic-settings==2.2.1
```

**Install command:**
```bash
pip install -r requirements.txt
```

---

### 1.4 — Backend Environment File

**Prompt for Gemini:**
> "Create a `.env` file for a FastAPI backend with PostgreSQL connection string, JWT secret key, algorithm, and token expiry settings."

**File: `backend/.env`**
```env
DATABASE_URL=postgresql+asyncpg://finance_user:securepassword123@localhost:5432/finance_tracker_db
SECRET_KEY=your-super-secret-key-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
UPLOAD_DIR=uploads
```

---

## ⚙️ PHASE 2 — Backend: Database Models & Config

### 2.1 — Config & Database Connection

**Prompt for Gemini:**
> "Create `app/config.py` using pydantic-settings to load `.env` variables. Then create `app/database.py` with an async SQLAlchemy engine, sessionmaker, Base class, and a `get_db` dependency for FastAPI."

**Key Details to Include in Prompt:**
- Use `create_async_engine` from `sqlalchemy.ext.asyncio`
- `AsyncSession` with `expire_on_commit=False`
- `declarative_base()` for models
- `get_db` as an async generator with `yield`

---

### 2.2 — User Model

**Prompt for Gemini:**
> "Create `app/models/user.py` SQLAlchemy async model for a `users` table with the following columns: id (UUID, primary key), username (String, unique, not null), email (String, unique, not null), hashed_password (String, not null), profile_photo (String, nullable, stores file path), created_at (DateTime, server_default=now), updated_at (DateTime, onupdate=now). Add a relationship to transactions."

---

### 2.3 — Transaction Model

**Prompt for Gemini:**
> "Create `app/models/transaction.py` SQLAlchemy async model for a `transactions` table with the following columns: id (UUID, primary key, default uuid4), user_id (UUID, ForeignKey to users.id, not null), transaction_date (Date, not null), title (String(255), not null), note (Text, nullable), category (String(100), not null, e.g. Food, Transport, Salary, Entertainment, Healthcare, Education, Shopping, Investment, Others), credit (Numeric(12,2), default 0), debit (Numeric(12,2), default 0), created_at (DateTime, server_default=now). Add a ForeignKey relationship back to User."

**Transaction Categories (use as Enum or constants):**
```
Income: Salary, Freelance, Investment, Other Income
Expense: Food, Transport, Shopping, Entertainment, Healthcare, Education, Utilities, Rent, Others
```

---

### 2.4 — Alembic Setup

**Prompt for Gemini:**
> "Initialize Alembic in the `backend/` folder. Update `alembic/env.py` to use the async SQLAlchemy engine from `app/database.py`, import all models from `app/models`, and use `Base.metadata` as the target metadata. Provide all steps to create and run the first migration."

**Commands:**
```bash
cd backend
alembic init alembic
# (Edit alembic/env.py as described above)
alembic revision --autogenerate -m "initial_tables"
alembic upgrade head
```

---

## ⚙️ PHASE 3 — Backend: Schemas, Auth & Utilities

### 3.1 — Pydantic Schemas

**Prompt for Gemini:**
> "Create Pydantic v2 schemas in `app/schemas/user.py` and `app/schemas/transaction.py`.

> For User: `UserCreate` (username, email, password), `UserLogin` (email, password), `UserOut` (id, username, email, profile_photo, created_at), `Token` (access_token, token_type), `TokenData` (user_id).

> For Transaction: `TransactionCreate` (transaction_date, title, note, category, credit, debit), `TransactionUpdate` (all fields optional), `TransactionOut` (all fields + id + created_at), `TransactionFilter` query params (range: current_month | last_3_months | last_6_months | last_1_year | last_2_years | last_5_years)."

---

### 3.2 — JWT & Password Utilities

**Prompt for Gemini:**
> "Create `app/utils/jwt_handler.py` with functions: `create_access_token(data: dict)` using python-jose and settings from config, `verify_token(token: str)` that decodes and returns TokenData, and `get_current_user(token: Depends(oauth2_scheme), db)` async dependency that fetches the user from DB.

> Create `app/utils/password_handler.py` with `hash_password(password)` and `verify_password(plain, hashed)` using passlib bcrypt."

---

## ⚙️ PHASE 4 — Backend: Routers & Services

### 4.1 — Auth Router

**Prompt for Gemini:**
> "Create `app/routers/auth.py` FastAPI router with:
> - `POST /auth/register` — create new user, hash password, return UserOut
> - `POST /auth/login` — verify credentials, return JWT access token
> Both endpoints should use async SQLAlchemy session. Handle duplicate email/username with HTTPException 400."

---

### 4.2 — Transactions Router

**Prompt for Gemini:**
> "Create `app/routers/transactions.py` FastAPI async router (prefix `/transactions`) with JWT-protected routes:
> - `GET /` — list transactions for logged-in user with filter query param (current_month, last_3_months, last_6_months, last_1_year, last_2_years, last_5_years). Default: current_month. Filter by transaction_date. Order by transaction_date DESC.
> - `POST /` — create a new transaction for the logged-in user
> - `PUT /{transaction_id}` — update transaction (only owner can update)
> - `DELETE /{transaction_id}` — delete transaction (only owner)
> All return TransactionOut schema."

---

### 4.3 — Dashboard Router

**Prompt for Gemini:**
> "Create `app/routers/dashboard.py` FastAPI async router (prefix `/dashboard`) with JWT-protected route:
> - `GET /summary` — returns for the logged-in user:
>   - total_income (sum of all credit transactions of current month)
>   - total_expenses (sum of all debit transactions of current month)
>   - net_balance (total_income - total_expenses)
>   - category_expenses (dict of category -> sum of debits for current month, for bar chart)
>   - monthly_expenses (list of {month: 'YYYY-MM', total: float} for past 12 months, for line chart)"

---

### 4.4 — Profile Router

**Prompt for Gemini:**
> "Create `app/routers/profile.py` FastAPI async router (prefix `/profile`) with JWT-protected routes:
> - `GET /` — return current user profile (UserOut schema)
> - `POST /upload-photo` — accept multipart file upload, save image to `uploads/` folder with UUID filename, update user profile_photo field, return updated UserOut
> Mount the uploads directory as StaticFiles in main.py."

---

### 4.5 — Main App Entry Point

**Prompt for Gemini:**
> "Create `app/main.py` FastAPI app that:
> - Creates FastAPI instance with title `Finance Tracker API`
> - Adds CORS middleware allowing `http://localhost:5173` (Vite dev server)
> - Includes all routers: auth, transactions, dashboard, profile
> - Mounts `/uploads` as StaticFiles directory
> - Has a root `GET /` health check endpoint returning `{status: ok}`"

**Run Backend:**
```bash
cd backend
uvicorn app.main:app --reload --port 8000
```

---

## ⚙️ PHASE 5 — Frontend: Vite + React Setup

### 5.1 — Create Vite React Project

**Prompt for Gemini:**
> "Create a new Vite React project inside `finance-tracker/frontend`. Install the following packages: axios, react-router-dom v6, recharts (for charts), react-hook-form, @tanstack/react-query, react-hot-toast, lucide-react (icons), tailwindcss with postcss and autoprefixer."

**Commands:**
```bash
cd finance-tracker
npm create vite@latest frontend -- --template react
cd frontend
npm install axios react-router-dom react-hook-form @tanstack/react-query recharts react-hot-toast lucide-react
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

**Configure `tailwind.config.js`:**
```js
content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"]
```

---

### 5.2 — Axios Instance & API Modules

**Prompt for Gemini:**
> "Create `src/api/axiosInstance.js` with a base Axios instance pointing to `http://localhost:8000`. Add a request interceptor that reads `access_token` from localStorage and adds it as `Authorization: Bearer <token>` header. Add a response interceptor that redirects to `/login` on 401 errors.

> Create `src/api/authApi.js` with `loginUser(data)` and `registerUser(data)` functions.
> Create `src/api/transactionApi.js` with `getTransactions(range)`, `createTransaction(data)`, `updateTransaction(id, data)`, `deleteTransaction(id)` functions.
> Create `src/api/profileApi.js` with `getProfile()` and `uploadProfilePhoto(formData)` functions.
> Create `src/api/dashboardApi.js` with `getDashboardSummary()` function."

---

### 5.3 — Auth Context

**Prompt for Gemini:**
> "Create `src/context/AuthContext.jsx` with React Context that:
> - Stores `user` state and `isAuthenticated` boolean
> - `login(token, userData)` — saves token to localStorage, sets user state
> - `logout()` — clears localStorage, resets state, redirects to /login
> - On mount, reads token from localStorage and fetches user profile to restore session
> - Exports `useAuth()` custom hook"

---

## ⚙️ PHASE 6 — Frontend: Layout Components

### 6.1 — App.jsx & Routing

**Prompt for Gemini:**
> "Create `src/App.jsx` with React Router v6 routes:
> - `/login` → LoginPage (public)
> - `/register` → RegisterPage (public)
> - `/dashboard` → DashboardPage (protected)
> - `/transactions` → TransactionsPage (protected)
> - `/reports` → ReportsPage (protected)
> - `/profile` → ProfilePage (protected)
> - `/` redirects to `/dashboard`
> Wrap app with AuthContext provider, QueryClientProvider (react-query), and Toaster (react-hot-toast).
> Protected routes should use a `ProtectedRoute` component that redirects to `/login` if not authenticated."

---

### 6.2 — Sidebar Component

**Prompt for Gemini:**
> "Create `src/components/Sidebar.jsx` — a collapsible sidebar component using Tailwind CSS:
> - Expanded width: 240px, collapsed width: 64px (icons only)
> - Toggle button (hamburger/arrow icon using lucide-react) to collapse/expand
> - Navigation links with lucide-react icons:
>   - Dashboard (LayoutDashboard icon) → /dashboard
>   - Transactions (Receipt icon) → /transactions
>   - Reports (BarChart2 icon) → /reports
>   - Profile (User icon) → /profile
> - Active link highlighted with accent color
> - Smooth CSS transition for expand/collapse
> - Dark sidebar background (#1e1e2e or similar dark color)"

---

### 6.3 — Header Component

**Prompt for Gemini:**
> "Create `src/components/Header.jsx` with Tailwind CSS:
> - Left side: Text `Finance Tracker` in bold, large font
> - Right side: `Add Transaction` button (green, with Plus icon from lucide-react) and `Logout` button (red/outline, with LogOut icon)
> - `Add Transaction` button opens `AddTransactionModal` via a prop callback `onAddTransaction`
> - `Logout` button calls `logout()` from AuthContext
> - Fixed top header with shadow, white background, height 64px"

---

### 6.4 — Add Transaction Modal

**Prompt for Gemini:**
> "Create `src/components/AddTransactionModal.jsx` — a modal popup using Tailwind CSS and react-hook-form:
> - Overlay with dark backdrop
> - Form fields:
>   - Transaction Date (date input, required)
>   - Title (text input, required, max 255 chars)
>   - Note (textarea, optional)
>   - Category (select dropdown with: Salary, Freelance, Investment, Other Income, Food, Transport, Shopping, Entertainment, Healthcare, Education, Utilities, Rent, Others)
>   - Credit (number input, min 0, default 0)
>   - Debit (number input, min 0, default 0)
> - Submit button calls `createTransaction(data)` API, shows toast on success/error
> - Close button (X icon) to dismiss modal
> - On success: close modal and refetch transactions"

---

### 6.5 — Summary Cards Component

**Prompt for Gemini:**
> "Create `src/components/SummaryCards.jsx` that accepts `{ total_income, total_expenses, net_balance }` as props:
> - Render 3 cards in a responsive grid (3 cols on desktop, 1 col on mobile)
> - Card 1: Total Income (green color, TrendingUp icon)
> - Card 2: Total Expenses (red color, TrendingDown icon)
> - Card 3: Net Balance (blue color, Wallet icon) — green text if positive, red if negative
> - Each card shows the title, icon, and formatted currency value (₹ prefix)"

---

### 6.6 — Transaction Table Component

**Prompt for Gemini:**
> "Create `src/components/TransactionTable.jsx` that accepts `{ transactions, onDelete, onEdit }` props:
> - Render a responsive HTML table with Tailwind CSS
> - Columns: Date, Title, Note, Category, Credit (green text), Debit (red text), Timestamp, Actions
> - Actions column: Edit (pencil icon, opens edit modal) and Delete (trash icon, shows confirm then deletes)
> - Category shown as a colored badge/pill
> - Empty state message if no transactions
> - Timestamp formatted as `DD MMM YYYY HH:mm`
> - Paginate if > 20 rows (show 20 per page with Prev/Next buttons)"

---

## ⚙️ PHASE 7 — Frontend: Pages

### 7.1 — Login & Register Pages

**Prompt for Gemini:**
> "Create `src/pages/LoginPage.jsx` and `src/pages/RegisterPage.jsx` with Tailwind CSS:
> - Centered card layout on a gradient background
> - Login: email + password fields, submit calls `loginUser()`, saves token via AuthContext, redirects to /dashboard
> - Register: username + email + password fields, submit calls `registerUser()`, redirects to /login
> - Show error messages from API response using react-hot-toast
> - Links between login and register pages
> - Finance Tracker title/logo at top of form card"

---

### 7.2 — Dashboard Page

**Prompt for Gemini:**
> "Create `src/pages/DashboardPage.jsx`:
> - Fetch dashboard summary using `getDashboardSummary()` (react-query)
> - Fetch transactions using `getTransactions(selectedRange)` (react-query)
> - Render `SummaryCards` with income/expense/balance data at the top
> - Below: a filter bar with 6 buttons (Current Month, Last 3 Months, Last 6 Months, Last 1 Year, Last 2 Years, Last 5 Years) — active filter highlighted
> - Below filter: `TransactionTable` showing filtered transactions
> - Page uses shared layout with Sidebar + Header
> - Loading skeleton while data is fetching"

---

### 7.3 — Transactions Page

**Prompt for Gemini:**
> "Create `src/pages/TransactionsPage.jsx`:
> - Same filter bar as Dashboard (Current Month, Last 3 Months, Last 6 Months, Last 1 Year, Last 2 Years, Last 5 Years)
> - Full `TransactionTable` with edit and delete functionality
> - Edit opens `AddTransactionModal` pre-filled with existing data (update mode)
> - Page title: `All Transactions`
> - Total count of transactions shown above table
> - Uses react-query for data fetching and auto-refetch on mutation"

---

### 7.4 — Reports Page

**Prompt for Gemini:**
> "Create `src/pages/ReportsPage.jsx` using Recharts:
> - Fetch dashboard summary data with getDashboardSummary()
> - **Chart 1 — Current Month Expenses by Category (Bar Chart):**
>   - Use `BarChart` from Recharts
>   - X-axis: category names, Y-axis: amount in ₹
>   - Bar color: coral/red (#ef4444)
>   - Title: `Current Month — Expenses by Category`
>   - Tooltip showing category and amount
>   - Responsive container width 100%
> - **Chart 2 — Monthly Expenses (Past 12 Months) (Line Chart):**
>   - Use `LineChart` from Recharts
>   - X-axis: month (e.g. Jan 25, Feb 25...), Y-axis: total expenses in ₹
>   - Line color: blue (#3b82f6) with dots
>   - Title: `Monthly Expenses — Past 12 Months`
>   - Tooltip and grid lines
>   - Responsive container width 100%
> - Both charts in cards with padding, arranged in a 2-column grid on desktop, 1 column on mobile"

---

### 7.5 — Profile Page

**Prompt for Gemini:**
> "Create `src/pages/ProfilePage.jsx`:
> - Fetch profile using `getProfile()` react-query
> - Display:
>   - Profile photo (circular, 120px) — show default avatar icon if no photo
>   - Username (large, bold)
>   - Email
>   - Member since date
> - Upload new profile photo:
>   - Hidden file input triggered by clicking the profile photo or an `Change Photo` button
>   - On file select: call `uploadProfilePhoto(formData)` API, show success toast, refetch profile
> - Styled as a centered card with clean layout
> - Edit username functionality (optional — inline edit with save)"

---

## ⚙️ PHASE 8 — Layout Wrapper & Final Integration

### 8.1 — Main Layout Wrapper

**Prompt for Gemini:**
> "Create `src/components/Layout.jsx` — a wrapper component for all authenticated pages:
> - Renders `Sidebar` on the left
> - Renders `Header` at the top
> - Main content area adjusts its left margin based on sidebar expanded/collapsed state
> - Pass `onAddTransaction` callback to Header that opens AddTransactionModal
> - Modal state (open/close) managed in Layout
> - All protected pages should be wrapped inside `<Layout>`"

---

### 8.2 — Global Styles & Theme

**Prompt for Gemini:**
> "Update `src/styles/global.css` and `tailwind.config.js`:
> - Font: Inter (import from Google Fonts)
> - Color palette: white background (#ffffff), sidebar dark (#1a1a2e), accent blue (#3b82f6), success green (#22c55e), danger red (#ef4444)
> - Custom scrollbar styles (thin, matching accent color)
> - Smooth transitions on all interactive elements"

---

## ⚙️ PHASE 9 — Testing & Final Steps

### 9.1 — API Testing Checklist

**Prompt for Gemini:**
> "Generate a Postman collection JSON (or HTTPie commands) to test all the following endpoints of the Finance Tracker API:
> - POST /auth/register
> - POST /auth/login
> - GET /dashboard/summary (with Bearer token)
> - GET /transactions?range=current_month (with Bearer token)
> - POST /transactions (with Bearer token)
> - PUT /transactions/{id} (with Bearer token)
> - DELETE /transactions/{id} (with Bearer token)
> - GET /profile (with Bearer token)
> - POST /profile/upload-photo (multipart, with Bearer token)"

---

### 9.2 — .gitignore

**Prompt for Gemini:**
> "Create a `.gitignore` file for a monorepo with Python FastAPI backend (venv, __pycache__, .env, .pyc, uploads/) and React Vite frontend (node_modules, dist, .env.local)."

---

### 9.3 — README.md

**Prompt for Gemini:**
> "Create a `README.md` for the Finance Tracker v1.0 project with sections: Project Overview, Tech Stack, Features, Prerequisites, Backend Setup, Frontend Setup, Environment Variables, Running the App, API Documentation link (Swagger at /docs), Screenshots placeholder."

---

## 📋 Build Order Checklist

- [ ] **Phase 1** — PostgreSQL DB + Python venv + install requirements
- [ ] **Phase 2** — SQLAlchemy models + Alembic migrations (run `alembic upgrade head`)
- [ ] **Phase 3** — Pydantic schemas + JWT/password utilities
- [ ] **Phase 4** — All FastAPI routers + test with `/docs`
- [ ] **Phase 5** — Vite React setup + Axios instance + AuthContext
- [ ] **Phase 6** — Layout components (Sidebar, Header, Modal, Table, Cards)
- [ ] **Phase 7** — All pages (Login, Register, Dashboard, Transactions, Reports, Profile)
- [ ] **Phase 8** — Layout wrapper integration + global styles
- [ ] **Phase 9** — End-to-end testing + git setup

---

## 🔑 Key Technical Notes for Gemini

1. **All backend DB calls must be async** using `await session.execute()` and `AsyncSession`
2. **JWT tokens** stored in `localStorage` on frontend, sent as `Authorization: Bearer <token>`
3. **UUID** primary keys for both users and transactions
4. **CORS** must allow `http://localhost:5173` (Vite default port)
5. **Profile photos** stored in `backend/uploads/` folder, served as static files at `/uploads/`
6. **react-query** used for all API calls on frontend for caching and refetching
7. **react-hook-form** for all form handling and validation
8. **Recharts** for all data visualization (BarChart, LineChart)
9. **react-hot-toast** for all success/error notifications
10. **Tailwind CSS** for all styling — no custom CSS except global font and scrollbar
11. **Date filtering** on backend using SQLAlchemy `func.date()` comparisons
12. **Category** field is a plain String — no separate categories table needed for v1.0
13. **Credit/Debit** are separate Numeric fields — a transaction can have both but typically one is 0

---

*Generated for Shashank Kumar — Finance Tracker v1.0 Project Map*
