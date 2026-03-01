# Roam — Server

The backend for Roam, an AI-powered end-to-end testing agent. You define a flow in plain English, point it at a URL, and the agent runs through it in a real browser using GPT-4o to decide what to click, type, and verify at each step.

---

## Tech Stack

| Tool | Purpose |
|---|---|
| FastAPI | Web framework and API routes |
| Playwright | Headless browser automation |
| GPT-4o | Vision + reasoning for browser actions |
| SQLAlchemy | ORM for database interaction |
| Postgres | Primary database |
| Docker | Running Postgres locally |

---

## Project Structure

```
server/
├── app/
│   ├── agent/
│   │   ├── __init__.py       # Exposes run_flow
│   │   ├── browser.py        # Screenshot capture + action execution
│   │   ├── dom.py            # Prunes DOM to interactive elements only
│   │   ├── llm.py            # GPT-4o call + system prompt
│   │   └── runner.py         # Core agent loop
│   ├── api/
│   │   ├── flows.py          # CRUD routes for flows
│   │   └── runs.py           # Trigger runs + fetch results
│   ├── models/
│   │   ├── __init__.py       # Registers all models
│   │   ├── flow.py           # Flow table
│   │   └── run.py            # Run + StepResult tables
│   ├── config.py             # Environment variable settings
│   ├── database.py           # DB engine, session, Base
│   └── main.py               # FastAPI app entry point
├── .env.example              # Template for required env vars
├── .gitignore
├── docker-compose.yml        # Spins up Postgres locally
└── requirements.txt          # Python dependencies
```

---

## Getting Started

### 1. Clone and navigate to the server folder

```bash
cd Roam/server
```

### 2. Create and activate a virtual environment

```bash
python -m venv venv

# Mac/Linux
source venv/bin/activate

# Windows
venv\Scripts\activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
playwright install chromium
```

### 4. Set up environment variables

```bash
cp .env.example .env
```

Open `.env` and fill in your values:

```
POSTGRES_DB=""
POSTGRES_USER=""
POSTGRES_PASSWORD=""
DATABASE_URL=""
OPENAI_API_KEY=""
```

### 5. Start Postgres

```bash
docker-compose up -d
```

### 6. Start the server

```bash
uvicorn app.main:app --reload
```

The API will be running at `http://localhost:8000`.
Interactive docs available at `http://localhost:8000/docs`.

---

## API Routes

### Flows

| Method | Route | Description |
|---|---|---|
| `POST` | `/flows` | Create a new flow |
| `GET` | `/flows` | List all flows |
| `GET` | `/flows/{id}` | Get a single flow |
| `PATCH` | `/flows/{id}` | Update a flow |
| `DELETE` | `/flows/{id}` | Delete a flow |
| `GET` | `/flows/{id}/runs` | Get all runs for a flow |

### Runs

| Method | Route | Description |
|---|---|---|
| `POST` | `/runs/{flow_id}` | Trigger a run for a flow |
| `GET` | `/runs/{run_id}` | Get run results + step screenshots |

### Health

| Method | Route | Description |
|---|---|---|
| `GET` | `/health` | Check server is running |

---

## How a Run Works

1. You `POST /runs/{flow_id}` to trigger a run
2. A `Run` record is created in the database with `status: running`
3. Playwright opens a headless Chromium browser and navigates to the flow's URL
4. For each step in the flow:
   - A screenshot is taken
   - The DOM is pruned to only interactive elements
   - Both are sent to GPT-4o with the step description
   - GPT-4o returns a JSON action (`click`, `type`, `assert`, etc.)
   - Playwright executes the action
   - The result is saved as a `StepResult` row
5. If any step fails, the loop stops and the run is marked `failed`
6. If all steps pass, the run is marked `passed`
7. The full result is returned including per-step screenshots

---

## Example Flow

```json
{
  "name": "User Signup",
  "url": "https://yourapp.com",
  "steps": [
    "Click the sign up button",
    "Fill in the registration form with a test email and password",
    "Submit the form and confirm the success message appears",
    "Complete the onboarding form",
    "Log out and verify redirect to the home page"
  ]
}
```

---

## Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | Full Postgres connection string |
| `OPENAI_API_KEY` | Your OpenAI API key |
| `POSTGRES_DB` | Database name (used by Docker) |
| `POSTGRES_USER` | Postgres username (used by Docker) |
| `POSTGRES_PASSWORD` | Postgres password (used by Docker) |
