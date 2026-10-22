# Guide: How to Run the Frontend Application

A simple and plain guide to get the Ledgerly React frontend running locally on your computer.

---

## 📋 1. Prerequisites

Before starting, make sure you have installed:
- **Node.js** (v18 or higher recommended): [Download Node.js](https://nodejs.org/)
- **npm** (comes automatically with Node.js)
- **Git**

To verify your installation, run these commands in your terminal:
```bash
node -v
npm -v
```

---

## 🚀 2. Quick Start Steps

### Step 1: Open Terminal & Navigate to the Frontend Folder
From the project root (`Ledgerly/`), switch into the `frontend` directory:
```bash
cd frontend
```

### Step 2: Install Dependencies
Install all required packages:
```bash
npm install
```

### Step 3: Configure Environment Variables
In the `frontend` directory, ensure you have a `.env` file (you can copy `.env.example` if needed):
```bash
cp .env.example .env
```

Your `frontend/.env` file should look like this:
```env
VITE_API_URL=http://localhost:8000
VITE_ENABLE_MSW=false
```

#### Choose Your Mode:
- **Mode A: Connected to Django Backend (Default)**
  - Set `VITE_ENABLE_MSW=false`.
  - The frontend connects directly to your local Django server running on `http://localhost:8000`.
- **Mode B: Standalone / Demo Mock Mode**
  - Set `VITE_ENABLE_MSW=true`.
  - The frontend runs completely standalone with mock data without needing the Django backend or database running.

---

## 💻 3. Start the Development Server

Run the development server:
```bash
npm run dev
```

Once started, open your web browser and visit:
👉 **http://localhost:5173**

---

## 🔑 4. Navigation & Testing Guide

| Page | URL | Description |
| :--- | :--- | :--- |
| **Login** | `http://localhost:5173/login` | Sign in with username or email |
| **Signup** | `http://localhost:5173/signup` | Create an account |
| **OTP Verification** | `http://localhost:5173/verify-otp` | 6-digit code entry (Try `123450` for error state; any other code succeeds) |
| **Dashboard** | `http://localhost:5173/` | Business metrics, profit/expense charts, recent transactions |
| **Transactions** | `http://localhost:5173/transactions` | Filter, search, and paginate transactions |
| **Upload Receipt** | `http://localhost:5173/upload` | Drag & drop receipts with AI extraction simulation |
| **AI Bookkeeper Chat** | `http://localhost:5173/chat` | Natural language business analytics |
| **Insights** | `http://localhost:5173/insights` | Weekly automated business tips |
| **Settings** | `http://localhost:5173/settings` | Profile, company details, photo upload |

---

## 📦 5. Building for Production

To test or generate a production build:
```bash
# Build the production bundle into dist/
npm run build

# Preview the production build locally
npm run preview
```

---

## 🛠️ 6. Troubleshooting

- **Port `5173` is already in use:** Vite will automatically suggest port `5174` or you can stop the existing process.
- **Login fails or 401 error:** Verify that the Django backend server is running at `http://localhost:8000` or switch `VITE_ENABLE_MSW=true` in `.env` to test offline.
- **Clear session:** Open browser DevTools (`F12`), go to **Application > Local Storage**, and click **Clear** to reset auth tokens and test a fresh login.
