# Ledgerly — Victor's Backend Guide

Your guide to building the Django side of Ledgerly: what matters most, how we will build it, and how to run the GitHub workflow with Samuel. Draft v1, October 16, 2026. Read it together with the Product Spec.

## 1. Your job in one paragraph

You own everything that runs on the server: the database, login, the receipt-reading pipeline, the AI agent, the streaming chat, and the API that Samuel's React app talks to. You also own the GitHub repository. That means you set it up, protect it, review Samuel's pull requests, and help him when git gets confusing. Samuel owns everything the user sees. The project succeeds when the two halves meet cleanly at the API.

## 2. The seven parts that must be right

If these seven are solid, the product is trustworthy and impressive. If any one of them is shaky, everything built on top of it wobbles.

### 2.1 Money is stored as whole numbers

**Why:** computers store decimals badly. In Python, `0.1 + 0.2` gives `0.30000000000000004`. Across hundreds of records, tiny errors like that add up to wrong totals, and a bookkeeping app with wrong totals is dead.

**How:** every amount is a `BigIntegerField` holding kobo (100 kobo = 1 naira). Name the field with a `_kobo` suffix, for example `amount_kobo`, so nobody ever forgets the unit. The API sends kobo. React divides by 100 only when displaying.

**Done when:** no float or decimal field exists in any money column, and a test adds up 1,000 records and gets the exact expected total.

### 2.2 One customer can never see another customer's data

The word for this is **tenant isolation**. A tenant is one customer's private space inside the app. If user A can ever see user B's receipts, the product is finished.

**How:** every queryset is filtered by the logged-in user's business. Put that filter in one shared mixin (see section 6) so you cannot forget it on a new endpoint. For the agent, the business is baked into the tools when they are built, so the AI has no way to ask for a different one.

**Done when:** automated tests prove that user A gets a 404 when trying to read, edit or delete user B's transaction by ID, and that when user A asks the agent about user B's data, nothing comes back.

### 2.3 The AI never does the math

AI models invent things with total confidence. The word for that is **hallucination**. So the model never adds, averages or compares numbers. It picks a **tool** (an ordinary Python function), Django runs a real database query with `Sum`, `Count` and `filter`, and the model only explains the exact result in friendly language.

**How:** keep the tool list small and sharp (the Product Spec lists the first seven). Each tool has a clear name, typed inputs, and a docstring that says exactly what it does, because the docstring is what the model reads to decide which tool to use. Every tool returns a `searched` field describing the filters it used, so the chat can show the user what was looked up. Tell the model today's date in the system prompt, and tell it to say it does not know whenever a tool returns nothing.

**Done when:** the golden question set (section 2.7) passes at 100%.

### 2.4 Receipt extraction that admits when it is unsure

**How:** send the image to a vision-capable model and demand **structured output**, meaning a reply in a fixed shape instead of free text. Define the shape as a **Pydantic** model (a Python class that checks fields and types). Include a confidence number for each field. Then:

- Reject replies that do not match the shape, and retry once.
- Validate after parsing: amount is above zero, date is real and not in the future, category is one of the business's categories.
- Fields with low confidence set `needs_review` to true so React can highlight them yellow.
- Save the model's full raw reply on the Document record for debugging.
- Shrink big phone photos (for example, longest side 1600 pixels) before sending. It is faster and cheaper, and accuracy barely changes.

**Done when:** on a test set of 30 real receipts (clear, blurry, crumpled, screenshots), at least 85% of fields are correct before the user edits anything.

### 2.5 Streaming chat with a fixed event format

The chat uses **Server-Sent Events (SSE)**: the server keeps one connection open and pushes small messages (`tool_start`, `tool_end`, `token`, `chart`, `done`, `error`) as they are ready. The exact shapes are in the Product Spec, section 12, and they are a contract. The `tool_start` labels (for example, 'Looking up your transport spending...') are what make the app feel intelligent, so write a friendly label for every tool.

**Done when:** Samuel's UI can render a complete conversation using only the events in the spec, and every stream always ends with either `done` or `error`, never silence.

### 2.6 A stable, documented API

Samuel can only move fast if he never has to guess. So:

- Generate the interactive API page with `drf-spectacular` at `/api/docs/`.
- Every error uses the same shape: `{'error': {'code': '...', 'message': '...'}}`.
- List endpoints are paginated with DRF's `PageNumberPagination`, 20 per page, and reply with `count`, `next`, `previous` and `results`. Samuel needs to know this on day one.
- Adding a new field is fine at any time. Renaming or removing a field, or changing its type, is a breaking change and needs a message to Samuel first.

**Done when:** `/api/docs/` shows every endpoint, and Samuel never has to ask what a field means.

### 2.7 Demo data and tests

Create a management command, `python manage.py seed_demo`, that builds a demo business with about 200 realistic transactions over three months. This gives Samuel a dashboard that looks alive from day one, and it gives you known answers for the **golden set**: 25 to 30 sample questions on that seeded data, each with a known correct number, rerun after every agent change. Use `pytest-django` for all tests.

**Done when:** the seed command can be run twice without creating duplicates (use a `--wipe` flag), and the golden set runs with one command.

## 3. Tech stack

- `Django` and `djangorestframework`: the server and the API.
- `djangorestframework-simplejwt`: login with tokens (JWT, long strings that prove who the user is).
- `django-cors-headers`: lets Samuel's React app (on a different port) call your API. Without it the browser blocks every request.
- `drf-spectacular`: generates the interactive API documentation.
- `django-filter`: easy `?start=...&category=...` filtering on list endpoints.
- `psycopg`: talks to PostgreSQL.
- `Pillow`: image handling and resizing.
- `langgraph`, `langchain-groq`, `pydantic`: the agent, the model connection, and structured output.
- `python-dotenv`: loads secrets from a `.env` file.
- `pytest` and `pytest-django`: tests.

## 4. Project layout

One repository with three top-level folders. Each Django app has one job.

```
ledgerly/
  backend/
    manage.py
    config/        settings and root urls
    accounts/      user, business, register/login
    books/         categories, transactions, summary
    documents/     uploads and extraction
    agent/         tools, graph, streaming chat, conversations
    insights/      weekly insights
    tests/
  frontend/        Samuel's React app
  docs/            product spec, API notes
  README.md
  .gitignore
```

Why one repository: you only edit `backend/` and Samuel only edits `frontend/`, so your changes almost never touch the same files. That means almost no merge conflicts, which is exactly what we want while Samuel is new to teamwork on GitHub.

## 5. How we build it, week by week

**Settings checklist (do this first):** `TIME_ZONE = 'Africa/Lagos'` with `USE_TZ = True`; secrets and the database URL from `.env`; `CORS_ALLOWED_ORIGINS = ['http://localhost:5173']`; DRF default authentication set to JWT and default permission set to `IsAuthenticated`; `DEFAULT_SCHEMA_CLASS` set to drf-spectacular; `MEDIA_ROOT` set for uploads.

**Week 1: foundation and the first full round trip**

1. Create the repo and folder structure (section 8), then the Django project in `backend/`.
2. Models: `Business` (one-to-one with the user, so `request.user.business` works), `Category`, `Transaction`.
3. Auth endpoints: register, login, refresh.
4. Transactions CRUD using the tenant mixin, plus filters and pagination.
5. Write `seed_demo` and the first isolation test.
6. Turn on `/api/docs/`. Tell Samuel it is live.
7. Write the README section 'Run the backend' (section 7) so Samuel can run your server himself.

**Week 2: upload and extraction**

1. `Document` model and `POST /api/documents/` with multipart upload.
2. The extraction function: resize, call the vision model, parse with Pydantic, validate, save drafts with `needs_review` flags.
3. `POST /api/transactions/{id}/confirm/`.
4. Build your 30-receipt test set and measure accuracy. Improve the prompt until you hit 85%.

**Week 3: the agent and streaming chat**

1. Write the first three tools (`get_spending_total`, `get_summary`, `compare_periods`), then the rest.
2. Build the agent with LangGraph, with the business captured in the tools.
3. `Conversation` and `Message` models, so chat history persists.
4. The streaming endpoint (section 6) using the exact event names from the spec.
5. Write the golden set. Fix the tool descriptions until it passes at 100%.

**Week 4: charts, insights, polish**

1. `GET /api/summary/` for the dashboard.
2. The `make_chart` tool and the `chart` event.
3. Weekly insights as a management command (`python manage.py generate_insights`) that you can schedule later. Start with plain rules, for example 'category up more than 30% versus last month', and let the AI only word the message.
4. Rate limits on login, upload and chat. Final bug sweep with Samuel.

## 6. Three code skeletons

These are shapes to build from, not finished code. Type them out yourself and adapt them.

**A. The tenant-safe mixin.** Put it on every ViewSet that touches business data.

```python
# books/mixins.py
class BusinessScopedMixin:
    def get_queryset(self):
        return super().get_queryset().filter(business=self.request.user.business)

    def perform_create(self, serializer):
        serializer.save(business=self.request.user.business)
```

**B. Tools built per request, with the business baked in.** Because `business` lives inside the function that builds the tools, the AI can never choose a different one.

```python
# agent/tools.py
from django.db.models import Sum
from langchain_core.tools import tool


def build_tools(business):
    @tool
    def get_spending_total(category: str, start_date: str, end_date: str) -> dict:
        '''Exact total spent in one category between two dates (YYYY-MM-DD).'''
        qs = business.transactions.filter(
            confirmed=True,
            type='expense',
            category__name__iexact=category,
            date__range=(start_date, end_date),
        )
        return {
            'total_kobo': qs.aggregate(total=Sum('amount_kobo'))['total'] or 0,
            'count': qs.count(),
            'searched': {'category': category, 'from': start_date, 'to': end_date},
        }

    return [get_spending_total]
```

**C. The streaming response.** Wrap this in a DRF `APIView` so JWT authentication still applies. For the agent side, look at LangGraph's streaming (`stream_mode='messages'`) to receive tokens and tool activity as they happen.

```python
# agent/views.py
import json
from django.http import StreamingHttpResponse


def sse(event, data):
    return f'event: {event}\ndata: {json.dumps(data)}\n\n'


def stream_reply(business, message):
    def generate():
        try:
            yield sse('tool_start', {'name': 'get_spending_total', 'label': 'Looking up your spending...'})
            # run the agent here, yield 'token' and 'chart' events as they happen
            yield sse('done', {'message_id': 123})
        except Exception:
            yield sse('error', {'message': 'Something went wrong. Please try again.'})

    response = StreamingHttpResponse(generate(), content_type='text/event-stream')
    response['Cache-Control'] = 'no-cache'
    response['X-Accel-Buffering'] = 'no'  # stops proxies like nginx from holding the stream back
    return response
```

## 7. Unblocking Samuel

The fastest way to lose a week is Samuel waiting on you. So:

- In week 1, ship each endpoint with sample data first, even before the logic is finished.
- Keep `seed_demo` and `requirements.txt` up to date (`pip freeze > requirements.txt` after installing anything).
- Keep a README section called 'Run the backend' with exactly these steps: create a virtual environment and activate it; `pip install -r requirements.txt`; copy `.env.example` to `.env` and fill it in; `python manage.py migrate`; `python manage.py seed_demo`; `python manage.py runserver`. Test it on a clean folder yourself before you tell Samuel it works.
- Before an endpoint changes shape, message Samuel and update `docs/` in the same pull request.

## 8. GitHub: your role as repo owner

### 8.1 One-time setup

1. Create a private repository named `ledgerly` (or the final product name) on GitHub.
2. On your computer, clone it, create `backend/`, `frontend/` and `docs/`, add a README and the root `.gitignore` below, and make the first commit straight to `main`. This is the only time anyone commits to `main` directly.
3. Invite Samuel: repository Settings, then Collaborators, then Add people. He needs write access.
4. Protect `main`: in the repository settings, under Branches or Rules, add a rule for `main` that requires a pull request before merging, requires 1 approval, and blocks force pushes. As owner you can still use the admin override if Samuel is unavailable, but ask him to look at any pull request that changes the API.
5. In Settings, General, Pull Requests: allow only squash merging (it turns each pull request into one clean commit) and turn on 'Automatically delete head branches'.
6. Add `.github/pull_request_template.md` so every pull request asks the same four questions:

```
## What does this change?
## How do I test it?
## Screenshot (frontend) or example response (backend)
## Does this change the API? (yes / no)
```

7. Pin the Product Spec and this guide in `docs/` or link them from the README.

### 8.2 Root .gitignore

```
# Python / Django
venv/
env/
__pycache__/
*.pyc
db.sqlite3
media/

# Secrets
.env

# Node / React
node_modules/
dist/

# Editors and OS
.vscode/
.idea/
.DS_Store
```

Commit a `.env.example` listing every variable name with fake values, so Samuel and future you know what is needed without ever seeing real secrets.

### 8.3 Your daily loop

You follow the same rules as Samuel. Never commit directly to `main`.

```bash
git switch main
git pull origin main            # get everyone's latest work
git switch -c feat/documents-upload   # a new branch for one piece of work
# ... write code ...
git status                      # what changed?
git add .
git commit -m 'feat(documents): add upload endpoint'
git push -u origin feat/documents-upload
```

Then open a pull request on GitHub, get it reviewed, squash-and-merge it, and go back to `git switch main` and `git pull origin main`.

### 8.4 Reviewing Samuel's pull requests

A **pull request** (PR) is a proposal: 'please merge the work on my branch into main.' Your review routine:

1. Open the PR and click 'Files changed'.
2. Check that he only touched `frontend/` (and `docs/` if it is an API note). If he changed something in `backend/`, ask why.
3. Check that no secrets or junk got in: `.env`, `node_modules`, huge files.
4. Pull his branch and run it if the change is big: `git fetch origin`, then `git switch feat/his-branch`.
5. Leave comments on specific lines for questions or suggestions. Be kind and specific; he is learning the workflow, so thank him for small PRs.
6. Click 'Approve', then 'Squash and merge'.

Keep pull requests small, about 300 changed lines or fewer, and merge at least every couple of days. Small and often is the whole secret to painless collaboration.

### 8.5 When Samuel gets stuck

Ask him to run `git status` and send a screenshot. Then the three most common fixes:

**He committed on `main` by mistake** (and has not pushed). First save the work on a new branch, then reset `main`:

```bash
git switch -c feat/rescued-work   # the new branch now holds his commits
git switch main
git reset --hard origin/main      # main is clean again
```

Only run `reset --hard` after the new branch exists, because it throws away anything on the current branch that has not been saved elsewhere.

**His push is rejected** because the branch is behind. On his branch:

```bash
git fetch origin
git merge origin/main
```

**A merge conflict.** Git marks the clashing lines with `<<<<<<<`, `=======` and `>>>>>>>`. Open the file, keep the correct version, delete the marker lines, then `git add .` and `git commit`. Because you each stay in your own folder, this should be rare, and it will mostly happen in shared files like `docs/`.

### 8.6 Commit and pull request style

Use short, clear messages in the form `type(area): what changed`. The types: `feat` (new thing), `fix` (bug), `docs`, `refactor`, `test`, `chore` (setup, packages). Examples: `feat(auth): add login endpoint`, `fix(agent): handle empty tool result`. Branch names follow the same idea: `feat/login-endpoint`, `fix/empty-tool-result`.

### 8.7 Rules we both follow

1. Nobody commits directly to `main`.
2. One branch per piece of work, and one pull request per branch.
3. Pull `main` every morning before starting.
4. Push at the end of every working day, even if the work is unfinished (open it as a Draft PR).
5. Never force-push (`git push --force`). Never commit secrets.
6. API changes are announced in chat and written in `docs/` in the same pull request.
7. If git confuses you, stop and ask before running commands you do not understand.

## 9. Common traps

- **CORS errors:** the browser says the request was blocked. Check `CORS_ALLOWED_ORIGINS` includes Samuel's exact address, with the port and without a trailing slash.
- **Trailing slashes:** Django REST routes end in `/`. A missing slash causes redirects that break POST requests. Agree on the slash style and keep it.
- **Token loops:** a refresh endpoint that also requires a valid access token will lock users out forever. Refresh must work without an access token.
- **Dates and time zones:** keep `USE_TZ = True`, and treat a receipt's date as a plain date. Do not let a late-night upload slip into the next day.
- **Invalid JSON from the model:** it will happen. Retry once, then fail gracefully with `needs_review`.
- **Streams that stall:** if text arrives all at once at the end, something between Django and the browser is buffering. Keep the `X-Accel-Buffering` and `Cache-Control` headers.
- **AI costs:** log token usage per request from day one and rate-limit chat and upload.

## 10. Definition of done for the backend in v1

- All endpoints in the Product Spec exist and appear on `/api/docs/`.
- The isolation tests, the golden set and the extraction test set all pass.
- `seed_demo` works on a clean setup, and the README steps work for Samuel on his own computer.
- First streamed token appears in under two seconds.
- No secrets in the repository, and `.env.example` is complete.
