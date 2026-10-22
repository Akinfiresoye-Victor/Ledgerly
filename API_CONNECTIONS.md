# Ledgerly - API Integration Status

## 🟢 Live Connected Endpoints (Django Backend)
- `POST /auth/register/` - User registration (stores Knox Token)
- `POST /auth/login/` - User login (stores Knox Token)
- `GET /auth/profile/` - Fetches authenticated user info
- `POST /auth/logout/` - Token invalidation & local session clearing

## 🟡 Frontend Mocked / Fallback Endpoints (Awaiting Backend Deployment)
- `POST /auth/verify-otp/` - OTP submission fallback (simulated UI transition to "All Set!")
- `PATCH /auth/profile/` - Profile photo & details update
- `GET /api/transactions/` - Dashboard & transaction list data
- `POST /api/documents/upload/` - Receipt upload & AI extraction
- `GET /api/dashboard/insights/` - Spending category & income vs expense charts

## 🔐 Auth Protocol Summary
- **Base URL:** `http://localhost:8000`
- **Header:** `Authorization: Token <token>`
