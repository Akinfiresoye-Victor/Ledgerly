import { http, HttpResponse, delay } from "msw";
import {
  mockUser,
  mockCategories,
  mockTransactions,
  mockDashboardSummary,
  mockInsights,
  mockDraftReceipt,
} from "./mockData";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

let transactionsList = [...mockTransactions];
let currentUser = { ...mockUser };

export const handlers = [
  // Auth: Register
  http.post(`${API}/auth/register/`, async ({ request }) => {
    const body = await request.json();
    currentUser = {
      ...currentUser,
      full_name: body.full_name || currentUser.full_name,
      email: body.email || currentUser.email,
      phone: body.phone || currentUser.phone,
      business_name: body.business_name || currentUser.business_name,
    };
    await delay(600);
    return HttpResponse.json({
      message: "Account created. Please verify your email.",
      email: currentUser.email,
      requires_verification: true,
    });
  }),

  // Auth: Verify OTP
  http.post(`${API}/auth/verify-otp/`, async ({ request }) => {
    const { code } = await request.json();
    await delay(1200); // Simulate realistic verification time
    if (code === "123450" || code === "000000") {
      // Simulate invalid code for testing the incorrect code screen
      return HttpResponse.json(
        { error: { code: "invalid_otp", message: "The code you entered is invalid. Please check and try again." } },
        { status: 400 }
      );
    }
    return HttpResponse.json({
      access: "mock_jwt_access_token_ledgerly_12345",
      refresh: "mock_jwt_refresh_token_ledgerly_67890",
      user: currentUser,
    });
  }),

  // Auth: Resend OTP
  http.post(`${API}/auth/resend-otp/`, async () => {
    await delay(400);
    return HttpResponse.json({ message: "A new 6-digit verification code has been sent." });
  }),

  // Auth: Login
  http.post(`${API}/auth/login/`, async ({ request }) => {
    const body = await request.json();
    await delay(500);
    if (body.password === "wrongpassword") {
      return HttpResponse.json(
        { error: { code: "invalid_credentials", message: "Invalid email or password." } },
        { status: 401 }
      );
    }
    return HttpResponse.json({
      access: "mock_jwt_access_token_ledgerly_12345",
      refresh: "mock_jwt_refresh_token_ledgerly_67890",
      user: currentUser,
    });
  }),

  // Auth: Refresh Token
  http.post(`${API}/auth/refresh/`, async () => {
    await delay(200);
    return HttpResponse.json({
      access: "mock_refreshed_jwt_access_token_" + Date.now(),
    });
  }),

  // Auth: Profile
  http.get(`${API}/auth/profile/`, () => {
    return HttpResponse.json(currentUser);
  }),

  http.patch(`${API}/auth/profile/`, async ({ request }) => {
    const updates = await request.json();
    currentUser = { ...currentUser, ...updates };
    await delay(300);
    return HttpResponse.json(currentUser);
  }),

  // Business
  http.get(`${API}/business/`, () => {
    return HttpResponse.json({
      name: currentUser.business_name,
      currency: "NGN",
      business_type: currentUser.business_type,
      address: currentUser.address,
    });
  }),

  http.patch(`${API}/business/`, async ({ request }) => {
    const updates = await request.json();
    if (updates.name) currentUser.business_name = updates.name;
    if (updates.business_type) currentUser.business_type = updates.business_type;
    if (updates.address) currentUser.address = updates.address;
    await delay(300);
    return HttpResponse.json({
      name: currentUser.business_name,
      currency: "NGN",
      business_type: currentUser.business_type,
      address: currentUser.address,
    });
  }),

  // Categories
  http.get(`${API}/categories/`, () => {
    return HttpResponse.json(mockCategories);
  }),

  // Transactions: List with filtering and pagination
  http.get(`${API}/transactions/`, ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get("search")?.toLowerCase();
    const category = url.searchParams.get("category");
    const type = url.searchParams.get("type");
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const pageSize = 6;

    let filtered = [...transactionsList];

    if (search) {
      filtered = filtered.filter(
        (t) =>
          t.vendor.toLowerCase().includes(search) ||
          t.category.toLowerCase().includes(search) ||
          (t.note && t.note.toLowerCase().includes(search))
      );
    }

    if (category && category !== "All Categories" && category !== "all") {
      filtered = filtered.filter((t) => t.category.toLowerCase() === category.toLowerCase());
    }

    if (type && type !== "all") {
      filtered = filtered.filter((t) => t.type === type);
    }

    const total = filtered.length;
    const startIndex = (page - 1) * pageSize;
    const results = filtered.slice(startIndex, startIndex + pageSize);

    return HttpResponse.json({
      count: total,
      total_pages: Math.max(1, Math.ceil(total / pageSize)),
      current_page: page,
      next: startIndex + pageSize < total ? page + 1 : null,
      previous: page > 1 ? page - 1 : null,
      results,
    });
  }),

  // Transactions: Create manual
  http.post(`${API}/transactions/`, async ({ request }) => {
    const body = await request.json();
    await delay(400);
    const newTx = {
      id: Date.now(),
      date: body.date || new Date().toISOString().slice(0, 10),
      vendor: body.vendor,
      category: body.category,
      amount_kobo: Number(body.amount_kobo),
      type: body.type || (body.category === "Income" ? "income" : "expense"),
      status: "Confirmed",
      needs_review: false,
      confidence: 1.0,
      note: body.note || "",
    };
    transactionsList.unshift(newTx);
    return HttpResponse.json(newTx, { status: 201 });
  }),

  // Transactions: Confirm draft
  http.post(`${API}/transactions/:id/confirm/`, async ({ params, request }) => {
    const id = Number(params.id);
    const body = await request.json().catch(() => ({}));
    await delay(300);
    let tx = transactionsList.find((t) => t.id === id);
    if (tx) {
      tx.status = "Confirmed";
      tx.needs_review = false;
      if (body.vendor) tx.vendor = body.vendor;
      if (body.amount_kobo) tx.amount_kobo = Number(body.amount_kobo);
      if (body.category) tx.category = body.category;
      if (body.date) tx.date = body.date;
      if (body.note) tx.note = body.note;
    } else {
      // Create confirmed from draft
      tx = {
        id: id || Date.now(),
        vendor: body.vendor || "GoodLife Mart",
        date: body.date || "2026-09-14",
        amount_kobo: Number(body.amount_kobo) || 4500000,
        category: body.category || "Food & Meals",
        type: "expense",
        status: "Confirmed",
        needs_review: false,
        confidence: 1.0,
        note: body.note || "Food purchase",
      };
      transactionsList.unshift(tx);
    }
    return HttpResponse.json(tx);
  }),

  // Transactions: Delete
  http.delete(`${API}/transactions/:id/`, async ({ params }) => {
    const id = Number(params.id);
    transactionsList = transactionsList.filter((t) => t.id !== id);
    await delay(200);
    return new HttpResponse(null, { status: 204 });
  }),

  // Summary (Dashboard)
  http.get(`${API}/summary/`, async () => {
    await delay(200);
    return HttpResponse.json(mockDashboardSummary);
  }),

  // Documents: Upload receipt
  http.post(`${API}/documents/`, async ({ request }) => {
    await delay(1500); // Simulate receipt vision model extraction
    return HttpResponse.json(mockDraftReceipt);
  }),

  // Insights
  http.get(`${API}/insights/`, async ({ request }) => {
    const url = new URL(request.url);
    const category = url.searchParams.get("category");
    await delay(200);
    if (!category || category.toLowerCase() === "all") {
      return HttpResponse.json(mockInsights);
    }
    const filtered = mockInsights.filter(
      (item) => item.category.toLowerCase() === category.toLowerCase()
    );
    return HttpResponse.json(filtered);
  }),

  // Conversations & Chat
  http.get(`${API}/conversations/`, () => {
    return HttpResponse.json([
      { id: "conv-1", title: "Transport spending in September", updated_at: "2026-10-02" },
    ]);
  }),
];
