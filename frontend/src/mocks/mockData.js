export const mockUser = {
  id: "usr_1",
  full_name: "Adeola Samuel",
  email: "adebusiness@gmail.com",
  phone: "+234 801 234 5678",
  business_name: "Adeola's Electronics",
  business_type: "Retail",
  address: "12 Kingsway Road, Lagos, Nigeria",
  initials: "AS",
  role: "Business Owner",
};

export const mockCategories = [
  { id: 1, name: "Food & Meals", kind: "expense", color: "#F97316" },
  { id: 2, name: "Inventory", kind: "expense", color: "#8B5CF6" },
  { id: 3, name: "Income", kind: "income", color: "#10B981" },
  { id: 4, name: "Utilities", kind: "expense", color: "#3B82F6" },
  { id: 5, name: "Transport", kind: "expense", color: "#EAB308" },
  { id: 6, name: "Fuel and Diesel", kind: "expense", color: "#EF4444" },
  { id: 7, name: "Rent", kind: "expense", color: "#6366F1" },
  { id: 8, name: "Salaries", kind: "expense", color: "#EC4899" },
  { id: 9, name: "Data and Airtime", kind: "expense", color: "#06B6D4" },
  { id: 10, name: "Other", kind: "expense", color: "#64748B" },
];

export const mockTransactions = [
  {
    id: 1,
    date: "2026-09-29",
    vendor: "GoodLife Mart",
    category: "Food & Meals",
    amount_kobo: 4500000, // ₦ 45,000
    type: "expense",
    status: "Confirmed",
    needs_review: false,
    confidence: 0.98,
    note: "Staff lunch provisions",
  },
  {
    id: 2,
    date: "2026-09-28",
    vendor: "Supplier",
    category: "Inventory",
    amount_kobo: 12000000, // ₦ 120,000
    type: "expense",
    status: "Confirmed",
    needs_review: false,
    confidence: 0.95,
    note: "Screen guards and cables wholesale",
  },
  {
    id: 3,
    date: "2026-09-24",
    vendor: "Client A",
    category: "Income",
    amount_kobo: 8000000, // ₦ 80,000
    type: "income",
    status: "Confirmed",
    needs_review: false,
    confidence: 1.0,
    note: "Electronics repair & battery replacement",
  },
  {
    id: 4,
    date: "2026-09-22",
    vendor: "PHCN",
    category: "Utilities",
    amount_kobo: 3000000, // ₦ 30,000
    type: "expense",
    status: "Confirmed",
    needs_review: false,
    confidence: 0.99,
    note: "September electricity bill prepaid token",
  },
  {
    id: 5,
    date: "2026-09-20",
    vendor: "Transport Co.",
    category: "Transport",
    amount_kobo: 1500000, // ₦ 15,000
    type: "expense",
    status: "Confirmed",
    needs_review: false,
    confidence: 0.94,
    note: "Logistics dispatch to Ikeja store",
  },
  {
    id: 6,
    date: "2026-09-18",
    vendor: "Client 1",
    category: "Income",
    amount_kobo: 12000000, // ₦ 120,000
    type: "income",
    status: "Confirmed",
    needs_review: false,
    confidence: 1.0,
    note: "Bulk phone accessory purchase",
  },
  {
    id: 7,
    date: "2026-09-15",
    vendor: "Total Filling Station",
    category: "Fuel and Diesel",
    amount_kobo: 6000000, // ₦ 60,000
    type: "expense",
    status: "Confirmed",
    needs_review: false,
    confidence: 0.97,
    note: "Generator fuel for store",
  },
  {
    id: 8,
    date: "2026-09-12",
    vendor: "MTN Business",
    category: "Data and Airtime",
    amount_kobo: 2500000, // ₦ 25,000
    type: "expense",
    status: "Confirmed",
    needs_review: false,
    confidence: 0.99,
    note: "Store 5G router renewal",
  },
];

export const mockDashboardSummary = {
  metrics: {
    total_income_kobo: 245000000, // ₦ 2,450,000
    income_change_pct: "+12%",
    total_expenses_kobo: 132000000, // ₦ 1,320,000
    expenses_change_pct: "+8%",
    net_profit_kobo: 113000000, // ₦ 1,130,000
    profit_change_pct: "+15%",
  },
  income_vs_expenses: [
    { name: "Sep 1", income: 1800000, expenses: 900000 },
    { name: "Sep 7", income: 2100000, expenses: 1200000 },
    { name: "Sep 14", income: 2300000, expenses: 1100000 },
    { name: "Sep 21", income: 2600000, expenses: 1400000 },
    { name: "Sep 28", income: 2450000, expenses: 1320000 },
  ],
  spending_by_category: [
    { name: "Transport", value: 38, amount_kobo: 50160000, color: "#10B981" },
    { name: "Feed & Meals", value: 22, amount_kobo: 29040000, color: "#F59E0B" },
    { name: "Utilities", value: 12, amount_kobo: 15840000, color: "#3B82F6" },
    { name: "Stock & Inventory", value: 8, amount_kobo: 10560000, color: "#8B5CF6" },
    { name: "Others", value: 20, amount_kobo: 26400000, color: "#64748B" },
  ],
  total_spending_display: "₦ 1.32M",
  ai_insight: {
    title: "AI Insight",
    text: "Your transport spending is up 38% this month compared to last month.",
    action_label: "View details →",
    action_url: "/insights",
  },
  recent_activity: [
    {
      id: "act-1",
      title: "Receipt from GoodLife Mart",
      amount_kobo: 4500000,
      type: "expense",
      date: "Sep 30, 2026",
      icon: "receipt",
    },
    {
      id: "act-2",
      title: "Transfer to Supplier",
      amount_kobo: 12000000,
      type: "expense",
      date: "Sep 29, 2026",
      icon: "transfer",
    },
    {
      id: "act-3",
      title: "Payment from Chinenwa Ltd",
      amount_kobo: 8000000,
      type: "income",
      date: "Sep 27, 2026",
      icon: "payment",
    },
    {
      id: "act-4",
      title: "Fuel Expense",
      amount_kobo: 6000000,
      type: "expense",
      date: "Sep 26, 2026",
      icon: "fuel",
    },
  ],
};

export const mockInsights = [
  {
    id: "ins-1",
    category: "Spending",
    title: "Diesel spending is up 38%",
    amount_kobo: 4000000,
    date: "Sep 26, 2026",
    description: "Your transport costs are 38% higher than last month.",
    icon_type: "trend",
    badge: "+38%",
  },
  {
    id: "ins-2",
    category: "Customers",
    title: "3 customers owe you money",
    amount_kobo: 42000000,
    date: "Sep 27, 2026",
    description: "Total outstanding is ₦ 420,000 (over 14 days).",
    icon_type: "users",
    badge: "Attention",
  },
  {
    id: "ins-3",
    category: "Revenue",
    title: "Your profit is up 15%",
    amount_kobo: 113000000,
    date: "Sep 25, 2026",
    description: "You're making more profit than last month. Keep it up!",
    icon_type: "coin",
    badge: "+15%",
  },
  {
    id: "ins-4",
    category: "Spending",
    title: "Inventory is running low",
    date: "Sep 22, 2026",
    description: "Consider restocking your top 3 items.",
    icon_type: "alert",
    badge: "Low stock",
  },
];

export const mockDraftReceipt = {
  id: "doc-receipt-914",
  fileName: "receipt_2026-09-14.jpg",
  fileSize: "2.4 MB",
  uploadedAt: "Sep 14, 2026",
  status: "ready",
  draft: {
    vendor: "GoodLife Mart",
    vendor_confidence: 0.62, // Flagged low confidence!
    date: "2026-09-14",
    date_confidence: 0.98,
    amount_kobo: 4500000, // ₦ 45,000
    amount_confidence: 0.58, // Flagged low confidence!
    category: "Food & Meals",
    category_confidence: 0.91,
    note: "Food purchase",
    needs_review: true,
  },
};
