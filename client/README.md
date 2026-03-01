# Roam — Client

The frontend for Roam, an AI-powered end-to-end testing agent. Built with Next.js 15 and Tailwind CSS v4.

---

## Tech Stack

| Tool            | Purpose                           |
| --------------- | --------------------------------- |
| Next.js 15      | React framework with App Router   |
| TypeScript      | Type safety across all components |
| Tailwind CSS v4 | Utility-first styling             |
| Geist           | Font (sans + mono)                |

---

## Project Structure

```
client/
├── app/
│   ├── dashboard/
│   │   └── page.tsx          # Lists all flows
│   ├── flows/
│   │   ├── new/
│   │   │   └── page.tsx      # Create a new flow
│   │   └── [id]/
│   │       └── page.tsx      # Flow detail + run history
│   ├── runs/
│   │   └── [id]/
│   │       └── page.tsx      # Run results + screenshot replay
│   ├── globals.css           # CSS variables + Tailwind theme tokens
│   ├── layout.tsx            # Root layout, fonts, ThemeProvider, Navbar
│   └── page.tsx              # Redirects to /dashboard
├── components/
│   ├── Navbar.tsx            # Top nav with theme toggle
│   ├── ThemeProvider.tsx     # Dark/light mode context
│   └── ui/
│       ├── Badge.tsx         # Status badges (passed, failed, running, pending)
│       ├── Button.tsx        # Primary, secondary, ghost, danger variants
│       ├── Card.tsx          # Bordered container with glossy shadow
│       └── Input.tsx         # Labeled text input with hint support
└── lib/
    ├── api.ts                # All API calls to the backend
    └── types.ts              # TypeScript types for Flow, Run, StepResult
```

---

## Getting Started

### 1. Navigate to the client folder

```bash
cd Roam/client
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the dev server

```bash
npm run dev
```

The app will be running at `http://localhost:3000`.

Make sure the backend is also running at `http://localhost:8000` or API calls will silently fail.

---

## Pages

### `/dashboard`

Lists all flows. Each card shows the flow name, URL, and step count. Clicking a card navigates to the flow detail page.

### `/flows/new`

Form for creating a new flow. Takes a name, URL, and plain-English steps (one per line). Shows a live step preview as you type so you can verify what the agent will receive before submitting.

### `/flows/[id]`

Flow detail page. Shows the list of steps on the left and run history on the right. Has a **Run Flow** button that triggers the agent and redirects to the run results page when complete.

### `/runs/[id]`

Run results page. Split into a step list on the left and step detail on the right. Clicking a step shows the screenshot captured after that step executed, the JSON action the LLM decided to take, and any error message if the step failed.

---

## Theme System

The app supports dark and light mode. The theme is controlled by a `data-theme` attribute on the `<html>` element which activates different sets of CSS variables.

### How it works

1. CSS variables are defined in `globals.css` under `:root` (light) and `[data-theme="dark"]` (dark)
2. `@theme` in `globals.css` registers those variables as Tailwind tokens
3. `ThemeProvider` reads the user's OS preference on first load, then persists their choice to `localStorage`
4. The Navbar has a toggle button that calls `toggle()` from the `useTheme()` hook

### Using theme tokens in components

Because the CSS variables are registered via `@theme`, you can use them as standard Tailwind classes:

```tsx
// Colors
<p className="text-text-primary" />
<p className="text-text-secondary" />
<p className="text-text-tertiary" />

// Backgrounds
<div className="bg-bg" />
<div className="bg-bg-secondary" />
<div className="bg-bg-tertiary" />

// Borders
<div className="border border-border" />
<div className="border border-border-strong" />

// Accent
<span className="text-accent bg-accent-dim" />

// Status
<span className="text-passed bg-passed-dim" />
<span className="text-failed bg-failed-dim" />
<span className="text-running bg-running-dim" />
<span className="text-pending bg-pending-dim" />
```

### Adding a new color token

1. Add the CSS variable to both `:root` and `[data-theme="dark"]` in `globals.css`
2. Register it under `@theme` in `globals.css`
3. Use it in components as a Tailwind class

---

## UI Components

All components live in `components/ui/` and are theme-aware by default.

### Button

```tsx
import Button from "@/components/ui/Button";

// Primary (default) — indigo gradient
<Button onClick={handleClick}>Save</Button>

// Link button
<Button href="/flows/new">New Flow</Button>

// Variants
<Button variant="secondary">Cancel</Button>
<Button variant="ghost">Dismiss</Button>
<Button variant="danger">Delete</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>  // default

// Other props
<Button disabled={loading}>Loading...</Button>
<Button fullWidth>Full Width</Button>
<Button type="submit">Submit</Button>
```

### Badge

```tsx
import Badge from "@/components/ui/Badge";

<Badge>default</Badge>
<Badge variant="passed">passed</Badge>
<Badge variant="failed">failed</Badge>
<Badge variant="running">running</Badge>
<Badge variant="pending">pending</Badge>
```

### Card

```tsx
import Card from "@/components/ui/Card";

// Static card
<Card className="p-5">
  content here
</Card>

// Clickable card (adds hover state + cursor)
<Card onClick={() => router.push("/somewhere")}>
  content here
</Card>
```

### Input

```tsx
import Input from "@/components/ui/Input";

<Input
  label="Flow name"
  placeholder="User signup"
  value={name}
  onChange={setName}
/>

// With hint text
<Input
  label="URL"
  placeholder="https://yourapp.com"
  value={url}
  onChange={setUrl}
  hint="The page the agent will start from"
/>
```

---

## API Client

All backend calls go through `lib/api.ts`. Never write `fetch()` directly in a component.

```typescript
import { api } from "@/lib/api";

// Flows
await api.listFlows()
await api.getFlow(id)
await api.createFlow({ name, url, steps })
await api.updateFlow(id, { name?, url?, steps? })
await api.deleteFlow(id)
await api.getFlowRuns(id)

// Runs
await api.triggerRun(flowId)
await api.getRun(runId)
```

All methods throw an error if the response is not ok, so wrap calls in `try/catch`.

---

## Types

All shared TypeScript types live in `lib/types.ts`.

```typescript
Flow; // A saved flow with name, url, and steps[]
Run; // A single execution of a flow
StepResult; // The result of one step including screenshot, action, error
Action; // Discriminated union of all LLM action types
FlowStatus; // "passed" | "failed" | "running" | "pending"
```

---

## What's Coming Next

- **`/flows/[id]/edit`** — Edit an existing flow's name, URL, and steps
- **Real-time run progress** — Stream step results as the agent runs instead of waiting for completion
- **Run filtering** — Filter run history by status
- **Delete flow** — Add a delete button to the flow detail page
