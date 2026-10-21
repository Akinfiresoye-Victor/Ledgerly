# Ledgerly — Frontend Application

Welcome to the frontend application for **Ledgerly**, the AI bookkeeper for small businesses and freelancers.

Built with **React**, **Vite**, **Tailwind CSS**, **TanStack Query**, **React Router**, **Recharts**, **axios**, **@microsoft/fetch-event-source**, and **MSW (Mock Service Worker)**.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
A `.env` file is prepared with default development settings:
```env
VITE_API_URL=http://localhost:8000/api
VITE_ENABLE_MSW=true
```

- When `VITE_ENABLE_MSW=true`, MSW intercepts requests with realistic demo data, allowing you to develop and test every flow without waiting for the backend.
- When the Django backend is running at `http://localhost:8000/api`, set `VITE_ENABLE_MSW=false` to talk directly to Django.

### 3. Run Development Server
```bash
npm run dev
```
The application will launch at `http://localhost:5173/`.

### 4. Build for Production
```bash
npm run build
```

---

## 📁 Directory Organization

Following the structure outlined in `docs/sammuel_guide.md`:

```
frontend/
  src/
    api/            client.js, auth.js, transactions.js, documents.js, chat.js, dashboard.js
    components/
      layout/       AppLayout.jsx, Sidebar.jsx, TopNavbar.jsx, MobileNav.jsx
      ui/           Button.jsx, Input.jsx, Card.jsx, Badge.jsx, Modal.jsx, Skeleton.jsx, EmptyState.jsx, ErrorState.jsx, BrandLogo.jsx
    features/
      auth/         SignupPage.jsx, OtpVerificationPage.jsx, LoginPage.jsx, AuthContext.jsx
      dashboard/    DashboardPage.jsx, MetricCard.jsx, IncomeExpenseChart.jsx, CategoryDonutChart.jsx, RecentActivityFeed.jsx, AiInsightBanner.jsx
      documents/    UploadPage.jsx, Dropzone.jsx, ReceiptReviewForm.jsx
      transactions/ TransactionsPage.jsx, AddTransactionModal.jsx
      chat/         ChatPage.jsx, ChatBubble.jsx, ChatInlineChart.jsx
      insights/     InsightsPage.jsx
      settings/     SettingsPage.jsx
    lib/            money.js, date.js
    mocks/          handlers.js, browser.js, mockData.js
    App.jsx
    main.jsx
    index.css
```

---

## 💎 Core Architecture Highlights

1. **Financial Precision (Kobo Rule):**
   All money amounts travel across the API as whole number integers in **kobo** (100 kobo = 1 naira). Formatted with `src/lib/money.js` via `Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" })`.
2. **Centralized API Client & JWT Refresh:**
   `src/api/client.js` attaches access tokens and quietly refreshes expired tokens upon receiving a `401 Unauthorized` before retrying the failed request once.
3. **Four UI States Everywhere:**
   Every view implements **Loading** (skeletons), **Empty** (clear guidance), **Error** (retry actions), and **Success** states.
4. **Streaming SSE Chat:**
   `@microsoft/fetch-event-source` powers the AI chat, displaying `tool_start` status lines, typing tokens word-by-word, and rendering inline Recharts graphs and search citations.
5. **Mobile-First Responsiveness:**
   Designed starting at 375px width with bottom navigation on phones, expanding into the desktop sidebar layout. Tables scroll horizontally within their containers to prevent page-level horizontal overflow.
