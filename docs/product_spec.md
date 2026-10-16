# Ledgerly — Product Spec (v1 draft)

Written for Victor (Django and AI backend) and Samuel (React frontend). Draft v1, October 16, 2026. "Ledgerly" is a working name and can change.

This document is the single source of truth for what we are building. If something here is unclear, we fix the document first and then fix the code. Technical words are explained the first time they appear, and there is a glossary at the end.

## 1. What we are building

Ledgerly is an AI bookkeeper for small businesses and freelancers. A shop owner, trader or freelancer uploads a photo of a receipt, a bank statement PDF or a screenshot of a transfer. The AI reads it and turns it into clean, organised records. After that, the owner simply talks to the app in plain English:

- "How much did I spend on fuel last month?"
- "Who owes me money?"
- "Am I making more profit than in August?"

The app answers with exact numbers and draws charts right inside the chat. It also speaks up without being asked, for example: "Your diesel spending is up 38% this month."

**The ten-second demo that makes people say wow:** upload a blurry receipt photo, watch it turn into a neat row in a table, then ask a question about it and watch a chart appear while the answer types out live.

## 2. The problem and who it is for

Most small businesses keep their records in notebooks, WhatsApp chats and memory. At the end of the month the owner cannot say where the money went, who still owes them, or whether the business is actually growing. Accounting software exists, but it is built for accountants. It is slow to learn and assumes the user types every entry by hand.

Our first users are small shop owners and traders, freelancers who invoice clients, and small service businesses such as salons, mechanics and caterers. Think of someone who runs a business from their phone and has never opened a spreadsheet on purpose.

## 3. Goals and non-goals for version 1

**Goals**

- A user can go from zero to "my receipt is a record" in under a minute.
- Every number the app shows or says is exactly right, because it comes from the database and never from the AI's guess.
- Chat answers start appearing in under two seconds and feel alive.
- Samuel and Victor can work in parallel without blocking each other.

**Non-goals (we are deliberately not doing these in v1)**

- Tax filing or tax advice.
- Connecting directly to bank accounts.
- Multiple team members, roles and permissions on one business.
- Generating and sending invoices.
- A mobile app. The web app must work well on a phone browser, but it is a website.
- Taking payments from users.

## 4. Core user journeys

**Journey A: First upload.** The user signs up, names their business and lands on an empty dashboard. They drag in a receipt photo. A progress state says "Reading your receipt...". Within a few seconds a draft record appears with vendor, date, amount and category filled in. Any field the AI was unsure about is highlighted yellow. The user fixes it if needed and taps Confirm. The record joins their books.

**Journey B: Ask a question.** The user opens the chat and types "How much did I spend on transport in September?" The chat shows a small status line such as "Looking up your transport spending...", then types out the answer, and shows a small note of what it searched for (category: Transport, dates: Sept 1 to Sept 30) so the user can check it.

**Journey C: See the picture.** The user asks "Show me my spending by category this month." A chart appears inside the chat. The same data is also on the dashboard.

**Journey D: Get nudged.** Once a week the app creates an insights list such as "Diesel up 38% versus last month" or "3 customers have not paid you for over 14 days." These show in an insights feed on the dashboard.

## 5. Features by version

**v1 (the four-week build)**

- Sign up, log in and one business per user.
- Upload receipts, transfers and statements. AI extracts records. The user confirms or edits.
- Manual entry of a transaction (always needed as a fallback).
- Transactions table with filters.
- Dashboard with totals (income, expenses, profit) and a few charts.
- Streaming chat agent that answers questions and draws charts.
- Weekly insights feed.

**v1.5 (soon after)**

- Ask questions about the text inside documents ("what payment terms did Mr. Ade's invoice say?"), using RAG.
- Export to CSV and PDF reports.
- A Telegram or WhatsApp bot where users send receipt photos directly.

**Later**

- Bank statement bulk import.
- Team members with roles.
- Invoice creation and reminders.

## 6. How the system fits together

There are two separate programs that talk to each other over the internet, plus a database and an AI model behind Django.

- **React app (Samuel).** Runs in the browser. Draws screens and sends requests.
- **Django REST API (Victor).** Runs on a server. Owns the data, the login, the AI agent and all the business logic. An **API** is simply a set of web addresses that return data instead of web pages. We use Django REST Framework (DRF) to build it.
- **PostgreSQL.** The database where all records live.
- **AI model (via Groq).** Used for two jobs only: reading receipts (a vision-capable model, meaning one that can look at images) and understanding chat questions.

The two sides exchange **JSON**, a plain-text format that looks like a Python dictionary. During development React runs on one address (for example port 5173) and Django on another (port 8000). Browsers block that by default for safety, so Victor must install `django-cors-headers` and allow Samuel's address. This is called **CORS**, and it is the first thing that will break on day one. That is normal.

## 7. The golden rule of the agent

AI models are bad at arithmetic, and they sometimes invent things with total confidence. The word for that is **hallucination**. In a bookkeeping product, one invented number destroys trust.

So the rule is: **the AI never does the math. Django does.**

The agent is given **tools**, which are ordinary Python functions it is allowed to call. When a user asks a question, the AI picks a tool, Django runs a real database query (sums, filters, grouping) and returns exact results, and the AI only explains those results in friendly language. If a tool returns nothing, the AI says it does not know instead of guessing.

Two more safety rules follow from this:

1. **The AI never chooses which business's data to look at.** The server decides that from the logged-in user. The tools receive the business identity from Django, never from the AI. This is called **tenant isolation**, meaning one customer can never see another customer's data, even if someone tries to trick the AI.
2. **Dates are resolved by Django, not guessed by the AI.** The system prompt includes today's date, and tools take real start and end dates.

## 8. Agent tools (version 1)

Each tool is a Python function with a clear name and clear inputs. The business is always injected by the server.

| Tool                                                 | What it does                                                                              |
| ---------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `get_spending_total(category, start_date, end_date)` | Exact total spent in a category over a period                                             |
| `list_transactions(filters, limit)`                  | A list of matching records                                                                |
| `get_summary(start_date, end_date)`                  | Income, expenses, profit, and breakdown by category                                       |
| `compare_periods(start_a, end_a, start_b, end_b)`    | Side-by-side totals for two periods with percentage change                                |
| `get_unpaid(direction)`                              | Who owes the business money (direction "owed_to_me") and what the business owes ("i_owe") |
| `top_vendors(start_date, end_date, limit)`           | Biggest places money goes                                                                 |
| `make_chart(chart_type, query)`                      | Returns chart data in the shape React can draw                                            |

Every answer ends with a small "what I searched" note (filters used), so the user can verify it.

## 9. Receipt reading flow

1. User uploads an image or PDF.
2. Django saves the file and creates a Document record.
3. Django sends the image to a vision-capable model and asks for **structured output**. That means we force the model to reply in a fixed shape instead of free text, for example vendor, date, total, category, and a confidence score for each field. We define that shape in a **Pydantic** model (a Python class that checks data has the right fields and types) and reject any reply that does not match.
4. Django saves the result as draft transactions marked as needing review. Fields with low confidence are flagged.
5. React shows the draft with flagged fields highlighted. The user confirms or edits. Only confirmed records count in totals and chart data.

In v1 extraction runs while the upload request waits, which is typically a few seconds. React shows a loading state. We avoid background job systems like Celery in v1 so there is less to learn at once. If it gets slow later, we move it to a background job.

## 10. Data model (first draft)

**Money rule:** all money is stored and sent as whole numbers in kobo (the smallest unit of the naira, where 100 kobo is 1 naira). Decimals can produce tiny rounding errors in computers, and whole numbers never do. React divides by 100 for display. This applies everywhere, including chart data.

- **Business:** owner (user), name, currency (default NGN).
- **Category:** business, name, kind (income or expense). Starter set for expenses: Fuel and Diesel, Transport, Stock and Inventory, Rent, Salaries, Electricity, Data and Airtime, Marketing, Bank Charges, Food, Supplies, Other. For income: Sales, Services, Other.
- **Document:** business, file, kind (receipt, transfer, statement), status (processing, ready, failed), uploaded time, raw extraction (the model's full reply, kept for debugging).
- **Transaction:** business, document (optional), type (income or expense), amount in kobo, category, counterparty (vendor or customer name), date, note, payment status (paid or unpaid), needs review (true or false), confidence, confirmed (true or false).
- **Conversation** and **Message:** chat history, including which tools were used.
- **Insight:** business, text, kind, created time, dismissed (true or false).

## 11. API contract (first draft, to be locked in week 1)

All endpoints start with `/api/`. Everything except auth needs a login token. Dates are `YYYY-MM-DD`. Money is in kobo.

| Method and path                                                       | Purpose                                                                             |
| --------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `POST /api/auth/register/`                                            | Create account                                                                      |
| `POST /api/auth/login/`                                               | Returns access token and refresh token                                              |
| `POST /api/auth/refresh/`                                             | New access token from refresh token                                                 |
| `GET, POST /api/business/`                                            | Read or create the user's business                                                  |
| `GET /api/categories/`                                                | List categories                                                                     |
| `POST /api/documents/`                                                | Upload a file (multipart). Returns the document and its draft transactions          |
| `GET /api/documents/{id}/`                                            | Document status and drafts                                                          |
| `GET /api/transactions/`                                              | List. Filters: `start`, `end`, `category`, `type`, `needs_review`, `payment_status` |
| `POST /api/transactions/`                                             | Create manually                                                                     |
| `PATCH /api/transactions/{id}/`                                       | Edit                                                                                |
| `POST /api/transactions/{id}/confirm/`                                | Confirm a draft                                                                     |
| `DELETE /api/transactions/{id}/`                                      | Delete                                                                              |
| `GET /api/summary/`                                                   | Totals and breakdowns for `start` and `end`                                         |
| `POST /api/chat/`                                                     | Send a message and receive a streamed reply                                         |
| `GET /api/conversations/` and `GET /api/conversations/{id}/messages/` | Chat history                                                                        |
| `GET /api/insights/`                                                  | Insights feed                                                                       |

Errors always look the same: `{"error": {"code": "...", "message": "..."}}` with a sensible HTTP status, so Samuel can show friendly messages with one piece of code. Victor generates the full interactive API page automatically with `drf-spectacular`, so Samuel can try every endpoint in the browser.

## 12. Chat streaming contract

Normally a page waits until the full answer is ready. For chat we use **Server-Sent Events (SSE)**: the server keeps one connection open and pushes small messages as they are ready, which is how the answer appears word by word. In Django this is `StreamingHttpResponse`. In React we read the stream as it arrives.

Each pushed message has an event name and a JSON body:

- `tool_start`: `{"name": "get_spending_total", "label": "Looking up your transport spending..."}`. React shows this as a status line.
- `tool_end`: `{"name": "get_spending_total"}`. React removes the status line.
- `token`: `{"text": "You spent "}`. React appends the text.
- `chart`: `{"type": "bar", "title": "Spending by category", "x": ["Fuel", "Rent"], "series": [{"name": "Amount", "values": [4500000, 12000000]}]}`. React draws a chart (Recharts is a good fit).
- `done`: `{"message_id": 123}`. Stream finished.
- `error`: `{"message": "..."}`. Something went wrong. Show a friendly message.

The `tool_start` labels are what make the chat feel intelligent, so Victor writes a human-friendly label for every tool.

## 13. Screens (for Samuel)

1. **Sign up and log in.**
2. **Business setup:** business name and currency, one short step.
3. **Dashboard:** total income, total expenses, profit for the selected period; a spending-by-category chart; a trend chart over time; the insights feed; a prominent upload button.
4. **Upload and review:** drag-and-drop area, "reading..." progress, then the draft with low-confidence fields highlighted and a Confirm button. This is the first demo moment and deserves the most polish.
5. **Transactions:** a filterable table with edit and delete. Filter by date range, category, type and needs-review.
6. **Chat:** message list, input box, status lines for tools, streaming text, inline charts. This is the second demo moment.
7. **Settings:** edit business name and categories, log out.

Design priorities: it must look good on a phone-width screen, it must feel fast, and empty states (no data yet) should explain what to do next.

## 14. Security and privacy

Financial data is sensitive, so these rules are not optional.

- Login uses **JWT** tokens (JSON Web Tokens, long random-looking strings that prove who you are). Use `djangorestframework-simplejwt`. Access tokens last about 15 minutes. Refresh tokens last about 7 days.
- Every database query filters by the logged-in user's business. A test must prove user A cannot read user B's records, including through the agent.
- Uploaded files are stored privately and served only to their owner.
- API keys live in environment variables, never in code or in the repository.
- Rate limits on login, upload and chat endpoints to prevent abuse and runaway AI costs.

## 15. Testing and quality

- **Golden question set:** a fixed set of 25 to 30 sample questions on seeded test data, each with a known correct answer. We rerun it after every agent change. Target is 100% correct numbers.
- **Extraction test set:** 30 real-world receipt photos of varying quality (clear, blurry, crumpled, screenshots). Target is at least 85% of fields correct before the user edits anything.
- **Isolation test:** an automated test that proves tenant isolation.
- **Speed:** first streamed token in under two seconds on a normal connection.

## 16. Milestones

**Week 1: Foundation and the first full round trip.** Victor: models, auth, transactions endpoints, CORS, generated API page. Samuel: project setup, login and signup, transactions table. Done when: Samuel logs in from the React app and sees a transaction created by Victor's API.

**Week 2: Upload and extraction.** Victor: document upload, vision extraction, structured output, confidence flags, confirm endpoint. Samuel: upload screen, progress state, review screen. Done when: a real receipt photo becomes a confirmed transaction through the UI.

**Week 3: The agent and streaming chat.** Victor: agent with tools, SSE streaming, chat history. Samuel: chat screen with streaming and status lines. Done when: the golden question set passes and chat feels live.

**Week 4: Charts, insights and polish.** Victor: summary endpoint, chart tool, weekly insights job. Samuel: dashboard charts, insights feed, empty states, phone layout. Done when: the full ten-second demo works end to end, and a real small business owner has tried it.

## 17. How Victor and Samuel work together

- This document and the generated API page are the contract. Nobody changes an endpoint's shape without telling the other person first.
- Victor ships each endpoint with sample data first, even before the logic is finished, so Samuel is never waiting. Samuel can use mock responses (for example with MSW, a tool that fakes API replies in the browser) whenever an endpoint is not ready.
- One branch per feature, small pull requests, and the other person looks at each one.
- A short weekly call to demo what works and to decide the next week's priorities.
- Bugs go in a shared list with the screen and the exact steps to reproduce.

## 18. Open questions

- Final product name.
- Which vision model gives the best accuracy and speed for Nigerian receipts and transfer screenshots (to be decided by testing in week 2).
- Whether the Telegram or WhatsApp bot should come before the weekly insights.
- Pricing and how to handle AI costs per user.
- Which hosting to use for the demo.

## 19. Glossary

- **API:** a set of web addresses a program can call to get or send data.
- **JSON:** a plain-text data format that looks like a Python dictionary.
- **CORS:** a browser safety rule that blocks a web page from calling a server on a different address unless that server allows it.
- **JWT:** a token (long string) that proves who a user is after they log in.
- **SSE (Server-Sent Events):** the server keeps a connection open and pushes messages as they are ready.
- **ORM:** Django's way of talking to the database using Python instead of raw SQL.
- **Kobo:** one hundredth of a naira. We store money in kobo to avoid rounding errors.
- **Hallucination:** when an AI states something false with confidence.
- **Tool calling:** letting the AI choose to run a normal Python function and use its result.
- **Structured output:** forcing an AI to reply in a fixed shape instead of free text.
- **Pydantic:** a Python library that checks data matches a defined shape.
- **RAG:** retrieval-augmented generation, where the AI first looks up relevant text and then answers using it.
- **Tenant isolation:** making sure one customer's data is never visible to another customer.
- **Golden set:** a fixed list of test questions with known correct answers.
