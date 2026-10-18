# Ledgerly — Samuel's Frontend Guide

Your guide to building the React side of Ledgerly: what matters most, how we will build it, and a step-by-step GitHub guide written for someone who has not worked with other people on GitHub before. Draft v1, October 16, 2026. Read it together with the Product Spec.

Don't worry if some words are new. Every technical word is explained the first time it shows up.

## 1. Your job in one paragraph

You build everything the user sees and touches: login, upload, the review screen, the transactions table, the dashboard, and the chat. Victor builds the server, the database and the AI. Your two halves talk to each other through an **API**, which is a list of web addresses your React app calls to get or send data. The AI is only impressive if the screens feel fast, clear and trustworthy, so honestly, the frontend is what makes people say wow.

## 2. What matters most on the frontend

### 2.1 Two moments get the most polish

The product has two demo moments, and people will judge the whole app by them.

1. **Upload and review.** The user drops in a receipt photo. A friendly 'Reading your receipt...' state appears. Then a draft record shows up with the fields the AI was unsure about highlighted in yellow, and a Confirm button.
2. **Streaming chat.** The user asks a question. A small status line appears ('Looking up your transport spending...'), the answer types out word by word, and a chart can appear inline.

Build everything else properly, but spend your extra time here.

### 2.2 Money is shown from kobo

The API sends money as whole numbers in **kobo** (100 kobo = 1 naira), to avoid tiny rounding errors. You divide by 100 only for display and never do other math on money yourself. Totals always come from the API. Put the formatter in one file and use it everywhere (code is in section 7).

### 2.3 Show trust

People trust apps that show their working. So: highlight uncertain fields, show the 'what I searched' note under chat answers, and give every screen four proper states: **loading** (a skeleton or spinner), **empty** (a helpful message such as 'No receipts yet. Upload your first one.'), **error** (a friendly message and a retry button) and **success**.

### 2.4 Phone first

Our users run their business from a phone. Design every screen at about 375 pixels wide first, then widen it for desktop. Use a bottom navigation bar on phones. Tables must scroll sideways inside their own box, never make the whole page scroll sideways. Tap targets (buttons, links) should be at least 44 pixels tall.

### 2.5 Login that does not randomly log people out

Login uses **JWT tokens**, which are long strings that prove who the user is. There are two: an **access token** (short-lived, about 15 minutes, sent with every request) and a **refresh token** (lives about 7 days, used only to get a new access token). When a request fails with status 401 (meaning 'not logged in'), your code should quietly use the refresh token to get a new access token and retry once. Only if that also fails should the user be sent to the login page. The code is in section 7.

### 2.6 Streaming chat handled correctly

The chat reply arrives through **Server-Sent Events (SSE)**: the server keeps one connection open and pushes small messages (`tool_start`, `tool_end`, `token`, `chart`, `done`, `error`) as they are ready. Important detail: the browser's built-in `EventSource` cannot send a login token and only supports GET requests, so it will not work for us. Use the small library `@microsoft/fetch-event-source` instead (code in section 7). The event shapes are in the Product Spec, section 12.

### 2.7 One API layer

Never scatter `fetch` calls across components. Put one configured **axios** client in `src/api/client.js` (axios is a popular library for making web requests), and put all calls in small functions in `src/api/`. When the API changes, you fix one file, not forty.

## 3. Recommended stack

- **Vite + React:** fast project setup and development server.
- **React Router:** moving between screens.
- **TanStack Query (React Query):** fetching, caching and refreshing server data, with loading and error states built in. It saves you from writing most `useEffect` fetching code.
- **axios:** the API client.
- **Tailwind CSS:** quick, consistent, mobile-first styling.
- **Recharts:** the charts.
- **react-dropzone:** drag-and-drop file upload.
- **@microsoft/fetch-event-source:** the streaming chat.
- **MSW (Mock Service Worker):** fakes the API in the browser while the real one is not ready (section 6).

TypeScript is your call. Use it if you are comfortable, and do not let it slow you down if you are not.

## 4. Folder structure

```
frontend/
  src/
    api/            client.js, transactions.js, documents.js, chat.js ...
    components/     buttons, cards, empty states, layout, charts
    features/
      auth/         login and signup
      transactions/ table and filters
      documents/    upload and review
      chat/         chat window and streaming
      dashboard/    totals, charts, insights
    lib/            money.js and small helpers
    mocks/          MSW handlers
    App.jsx
    main.jsx
  .env              (never committed)
  .env.example      (committed, fake values)
```

## 5. How React talks to Django, in plain English

1. **Two programs, two addresses.** During development your React app runs at `http://localhost:5173` and Victor's Django server at `http://localhost:8000`.
2. **The base URL lives in an environment variable.** In `frontend/.env` write `VITE_API_URL=http://localhost:8000/api`. In code, read it with `import.meta.env.VITE_API_URL`. Commit a `.env.example` with the same line so everyone knows the variable exists.
3. **Data travels as JSON**, a plain-text format that looks like a JavaScript object. axios converts it for you.
4. **CORS errors are normal on day one.** If the browser console says a request was 'blocked by CORS policy', that is a server setting on Victor's side (it needs to allow your address). Message Victor the exact error text. It is not your bug.
5. **Trailing slashes matter.** Django's routes end with `/`, so call `/transactions/`, not `/transactions`.
6. **Lists come paginated.** List endpoints reply with `count`, `next`, `previous` and `results` (the actual items), 20 per page.
7. **Errors have one shape.** They look like `{error: {code, message}}`, so one helper can turn any failure into a friendly message.

**When something is wrong, check the Network tab.** In Chrome press F12, open Network, click the failing request, and look at the status code. 400 means the data you sent was invalid. 401 means you are not logged in. 403 means you are not allowed. 404 means not found. 500 means a bug in Victor's code. Screenshot the request and its response when you message Victor, and he can fix things quickly.

## 6. Building before the backend exists

Victor will ship endpoints week by week, so you should never wait for him. **MSW** (Mock Service Worker) intercepts your requests in the browser and answers with fake data you control. Write each handler to copy the shape in the Product Spec and in `/api/docs/` exactly. When the real endpoint goes live, delete that one handler and your code keeps working untouched.

```js
// src/mocks/handlers.js
import { http, HttpResponse } from "msw";

const API = import.meta.env.VITE_API_URL;

export const handlers = [
  http.get(`${API}/transactions/`, () =>
    HttpResponse.json({
      count: 1,
      next: null,
      previous: null,
      results: [
        {
          id: 1,
          type: "expense",
          amount_kobo: 450000,
          counterparty: "Total Filling Station",
          date: "2026-10-02",
          needs_review: false,
        },
      ],
    }),
  ),
];
```

The field names above are examples. The real shapes come from `/api/docs/`. Once Victor's `seed_demo` command exists, you can run his server on your own computer (the steps are in the README) and see realistic data.

## 7. Three code skeletons

These are shapes to build from, not finished code. Type them yourself and adapt them to your setup.

**A. The API client with automatic login handling**

```js
// src/api/client.js
import axios from "axios";

const BASE = import.meta.env.VITE_API_URL;
export const api = axios.create({ baseURL: BASE });

// attach the access token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// if we get a 401, try once to refresh the token, then retry the request
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retried) {
      original._retried = true;
      try {
        const { data } = await axios.post(`${BASE}/auth/refresh/`, {
          refresh: localStorage.getItem("refresh"),
        });
        localStorage.setItem("access", data.access);
        original.headers.Authorization = `Bearer ${data.access}`;
        return api(original);
      } catch {
        localStorage.clear();
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);
```

Storing tokens in `localStorage` is fine for v1. We will revisit it before real customers use the app.

**B. The money formatter**

```js
// src/lib/money.js
const formatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
});

export const naira = (kobo) => formatter.format(kobo / 100);
// naira(450000) gives the amount in naira, formatted for Nigeria
```

**C. The streaming chat**

Each event has a name and a JSON body. Update your chat state depending on which event arrives.

```js
// src/api/chat.js
import { fetchEventSource } from "@microsoft/fetch-event-source";

export async function streamChat({
  conversationId,
  message,
  onToken,
  onToolStart,
  onToolEnd,
  onChart,
  onDone,
  onError,
}) {
  await fetchEventSource(`${import.meta.env.VITE_API_URL}/chat/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("access")}`,
    },
    body: JSON.stringify({ conversation_id: conversationId, message }),
    onmessage(event) {
      const data = JSON.parse(event.data);
      if (event.event === "token") onToken(data.text);
      else if (event.event === "tool_start") onToolStart(data.label);
      else if (event.event === "tool_end") onToolEnd();
      else if (event.event === "chart") onChart(data);
      else if (event.event === "done") onDone(data.message_id);
      else if (event.event === "error") onError(data.message);
    },
    onerror(err) {
      onError("Connection lost. Please try again.");
      throw err; // stops the library from retrying forever
    },
  });
}
```

Two more snippets you will use constantly. Fetching a list with React Query, and uploading a file:

```js
const { data, isLoading, error } = useQuery({
  queryKey: ["transactions", filters],
  queryFn: () =>
    api.get("/transactions/", { params: filters }).then((r) => r.data),
});

const form = new FormData();
form.append("file", file);
await api.post("/documents/", form); // let axios set the multipart headers itself
```

## 8. Screens and when each is done

- **Sign up and log in:** works end to end, shows clear error messages, and survives a page refresh.
- **Business setup:** one short step after signup (business name and currency).
- **Dashboard:** totals for income, expenses and profit with a date-range picker; a spending-by-category chart; a trend chart; the insights feed; a prominent Upload button. Done when it looks good with the demo data.
- **Upload and review:** drag and drop (and tap to pick a photo on phones), progress state, draft record with yellow low-confidence fields, editable fields, Confirm button. Done when a real receipt photo becomes a confirmed record.
- **Transactions:** a table with filters (date, category, type, needs review), edit, delete, and pagination. Done when it works on a phone-width screen without sideways page scroll.
- **Chat:** message list, input box, status lines while tools run, text streaming, inline charts, and the 'what I searched' note. Done when a full conversation renders using only the events in the spec.
- **Settings:** edit business name and categories, and log out.

## 9. How we build it, week by week

**Week 1: setup and the first full round trip.** Day 1: do the GitHub setup in section 10 and make a tiny practice pull request (section 10.3). Then: create the Vite app inside `frontend/`, add React Router, the API client, MSW and Tailwind. Build login and signup, the app shell with phone navigation, and the transactions table. Done when you log in from the React app against Victor's real API and see a transaction he created.

**Week 2: upload and review.** The drag-and-drop upload, the 'reading...' state, the review screen and the Confirm flow.

**Week 3: chat.** The chat screen with streaming, status lines and inline charts.

**Week 4: dashboard and polish.** Dashboard charts, the insights feed, empty and error states everywhere, and a careful pass on how it feels on a real phone. Then we test it with a real small business owner together.

## 10. GitHub for Samuel: the guide that makes teamwork painless

The good news first: **you will only ever edit the `frontend/` folder, and Victor will only edit `backend/`.** Because you work in different folders, your changes almost never clash. That is deliberate. Everything below is just the routine that keeps it that way.

### 10.1 Words you need

- **Repository (repo):** the project folder that git tracks, plus its online copy on GitHub.
- **Clone:** download a copy of the repo to your computer. You do this once.
- **Commit:** a saved snapshot of your changes with a short message. Like pressing save in a video game: you can always return to it.
- **Branch:** a separate line of work. Your branch is your private workspace, so unfinished work never breaks anything for Victor.
- **`main`:** the official, working version of the project. Nobody works directly on it.
- **Push:** upload your commits from your computer to GitHub.
- **Pull:** download other people's latest work from GitHub to your computer.
- **Pull request (PR):** a request on GitHub that says 'please add the work on my branch to `main`.' Victor looks it over, then merges it.
- **Merge:** combining a branch into `main`.
- **Merge conflict:** git cannot tell how to combine two changes made to the same lines. Rare for us, and fixable (section 10.6).
- **Origin:** git's name for the GitHub copy of the repo.

### 10.2 One-time setup

1. Install Git from git-scm.com. Check it works by typing `git --version` in a terminal.
2. Tell git who you are (use the same email as your GitHub account):

```bash
git config --global user.name 'Samuel Your-Surname'
git config --global user.email 'you@example.com'
```

3. Accept Victor's invitation to the repository (it arrives by email and on GitHub).
4. Clone the repo. Copy the address from the green Code button on GitHub:

```bash
git clone https://github.com/<victors-username>/ledgerly.git
cd ledgerly
```

The first time you push, git will ask you to sign in to GitHub, usually by opening a browser window. Do that. If it ever asks for a password in the terminal, note that GitHub no longer accepts account passwords there. Ask Victor, who can help you set up a personal access token, or install the GitHub CLI and run `gh auth login`.

5. Open the `ledgerly` folder in VS Code and do all your work inside `frontend/`. To create the React app, run this inside `frontend/`. It may ask to confirm because the folder is not empty; choose to keep the existing files.

```bash
cd frontend
npm create vite@latest . -- --template react
npm install
```

### 10.3 Your daily routine

This is the whole loop. Do it the same way every time and it becomes automatic.

**Step 1: start the day with the latest work.**

```bash
git switch main
git pull origin main
```

**Step 2: start a new branch for ONE piece of work.** Name it `feat/` plus what you are building.

```bash
git switch -c feat/login-page
```

**Step 3: do your work.** Check what changed whenever you like:

```bash
git status
```

**Step 4: save a snapshot (commit) whenever something works.** Small and often is better than big and rare.

```bash
git add .
git commit -m 'feat(auth): add login page'
```

**Step 5: upload your branch.** The first time for each new branch, use this form:

```bash
git push -u origin feat/login-page
```

After the first time on that branch, plain `git push` is enough.

**Step 6: open a pull request.** After you push, GitHub shows a yellow bar with a 'Compare & pull request' button. Click it. Write a short title and fill in the questions (what changed, how to test it, a screenshot). Add Victor as reviewer. Click Create pull request.

**Step 7: respond to the review.** If Victor leaves comments, fix the code on the same branch, commit and push again. The pull request updates itself. You do not need a new one.

**Step 8: after Victor merges it, clean up and start fresh.**

```bash
git switch main
git pull origin main
```

Then go back to Step 2 for the next piece of work.

**Your very first pull request is a practice run.** On day 1, add one line to `frontend/README.md`, and go through all eight steps with it. It is better to make your first mistakes on a throwaway line than on real work.

### 10.4 The seven rules

1. **Never work directly on `main`.** Always make a branch first. (GitHub will actually block you from pushing to `main`, so this protects you.)
2. **One branch, one job, one pull request.** 'login-page' is a job. 'everything for week 1' is not.
3. **Keep pull requests small.** If it changes more than about 300 lines, split it. Small ones get reviewed fast and rarely cause conflicts.
4. **Pull `main` every morning** before you start.
5. **Push at the end of every day, even if unfinished.** Open it as a Draft pull request (there is a dropdown next to the green button). That way your work is safe on GitHub and Victor can see progress.
6. **Never use `git push --force`, and never run `git reset --hard` unless Victor tells you to.** Those are the two commands that can destroy work.
7. **If git confuses you, stop and ask.** Run `git status`, take a screenshot, and send it to Victor. Asking takes two minutes and fixing a mess takes two hours. Everyone gets stuck with git, including experienced developers.

### 10.5 Commit messages

Write them as `type(area): what changed`. Types: `feat` (a new thing), `fix` (a bug fix), `style` (look only), `refactor` (cleanup), `docs`, `chore` (setup, packages). Examples: `feat(chat): stream tokens into message bubble`, `fix(upload): show error when file is too large`.

### 10.6 Staying up to date, and merge conflicts

If you work on a branch for more than a day or two, other work may land on `main` in the meantime. Bring it into your branch like this:

```bash
git fetch origin
git merge origin/main
```

If git says there is a conflict, do not panic. Open the files it lists. You will see something like this:

```
<<<<<<< HEAD
your version of the lines
=======
the other version of the lines
>>>>>>> origin/main
```

Decide which version is right (or combine them), delete the three marker lines, save the file, then run:

```bash
git add .
git commit -m 'chore: resolve merge conflict'
```

Because you and Victor work in different folders, conflicts will mostly happen in shared files such as those in `docs/`. If you need to change something in `backend/`, ask Victor rather than editing it yourself. If you need to edit `docs/`, keep the change small and put it in its own pull request.

### 10.7 Panic recipes

**'I made commits on `main` by mistake.'** (and have not pushed). Save the work on a new branch first, then reset `main`. Ask Victor to watch you do it the first time:

```bash
git switch -c feat/rescued-work
git switch main
git reset --hard origin/main
```

**'I added a file I should not have.'** (before committing):

```bash
git restore --staged path/to/file
```

**'I want to undo my last commit but keep my work.'**

```bash
git reset --soft HEAD~1
```

**'I want to throw away my unsaved changes in one file.'** (this cannot be undone, so be sure):

```bash
git restore path/to/file
```

**'I need to switch branches but I am halfway through something.'** Put your work aside, switch, then bring it back:

```bash
git stash
git switch main
# ... later ...
git switch feat/your-branch
git stash pop
```

**'My push was rejected.'** Your branch is behind. Run the two commands in section 10.6, then push again.

### 10.8 What never goes into GitHub

Victor's `.gitignore` already blocks these, but know why: `.env` files (they hold secrets such as API keys), `node_modules/` (huge, and anyone can recreate it with `npm install`), and `dist/` (build output). Before every commit, glance at `git status`. If you see one of those listed, stop and ask. If you ever commit a secret by accident, tell Victor immediately, because the key must be replaced even if you delete the file afterwards.

## 11. Definition of done for the frontend in v1

- Every screen in section 8 works on a phone-width screen and on desktop.
- Loading, empty, error and success states exist everywhere.
- The upload-to-review flow and the streaming chat work against the real API.
- No `fetch` calls outside `src/api/`, and no hardcoded API addresses (everything uses `VITE_API_URL`).
- All your work is merged to `main` through pull requests, `.env.example` is complete, and the frontend README explains how to run the app.
