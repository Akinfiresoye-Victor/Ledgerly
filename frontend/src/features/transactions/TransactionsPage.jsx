import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Search,
  Plus,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Filter,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import { transactionsApi } from "../../api/transactions";
import { naira } from "../../lib/money";
import { formatDate } from "../../lib/date";
import Badge, { CategoryBadge } from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import { TableRowSkeleton } from "../../components/ui/Skeleton";
import EmptyState from "../../components/ui/EmptyState";
import ErrorState from "../../components/ui/ErrorState";
import AddTransactionModal from "./AddTransactionModal";
import { mockTransactions, mockCategories } from "../../mocks/mockData";

export function TransactionsPage() {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [dateFilter, setDateFilter] = useState("Last 30 days");
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch transactions with TanStack Query
  const {
    data: transactionsData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["transactions", { search, category: selectedCategory, page }],
    queryFn: async () => {
      try {
        const res = await transactionsApi.list({
          search,
          category: selectedCategory === "All Categories" ? undefined : selectedCategory,
          page,
        });
        return res.data;
      } catch {
        // Fallback to client-side filtering on mock data
        let filtered = [...mockTransactions];
        if (search) {
          filtered = filtered.filter((t) =>
            t.vendor.toLowerCase().includes(search.toLowerCase())
          );
        }
        if (selectedCategory !== "All Categories") {
          filtered = filtered.filter(
            (t) => t.category.toLowerCase() === selectedCategory.toLowerCase()
          );
        }
        return {
          count: filtered.length,
          total_pages: Math.max(1, Math.ceil(filtered.length / 6)),
          current_page: page,
          results: filtered.slice((page - 1) * 6, page * 6),
        };
      }
    },
    staleTime: 30 * 1000,
  });

  // Fetch categories
  const { data: categories = mockCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      try {
        const res = await transactionsApi.getCategories();
        return res.data;
      } catch {
        return mockCategories;
      }
    },
  });

  // Add transaction mutation
  const createMutation = useMutation({
    mutationFn: (newTx) => transactionsApi.create(newTx),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
    },
  });

  const transactions = transactionsData?.results || [];
  const totalPages = transactionsData?.total_pages || 4;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Transactions
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            View, search and manage all verified business transactions.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={Plus}
          onClick={() => setIsModalOpen(true)}
          className="self-start sm:self-auto font-semibold px-4"
        >
          Add Transaction
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <Card noPadding className="p-4">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search transactions..."
              className="w-full h-10 pl-10 pr-4 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#0F3A2E] focus:ring-1 focus:ring-[#0F3A2E] transition-all"
            />
          </div>

          {/* Category Dropdown Filter */}
          <div className="relative w-full md:w-48 shrink-0">
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setPage(1);
              }}
              className="w-full h-10 px-3.5 pr-8 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium appearance-none focus:outline-none focus:bg-white focus:border-[#0F3A2E] focus:ring-1 focus:ring-[#0F3A2E] transition-all cursor-pointer"
            >
              <option value="All Categories">All Categories</option>
              {categories.map((c) => (
                <option key={c.id || c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Date Filter Dropdown */}
          <div className="relative w-full md:w-44 shrink-0">
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full h-10 px-3.5 pr-8 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium appearance-none focus:outline-none focus:bg-white focus:border-[#0F3A2E] focus:ring-1 focus:ring-[#0F3A2E] transition-all cursor-pointer"
            >
              <option value="Last 30 days">Last 30 days</option>
              <option value="This month">This month</option>
              <option value="Last month">Last month</option>
              <option value="This year">This year</option>
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </Card>

      {/* Error State */}
      {isError && (
        <ErrorState
          title="Could not load transactions"
          message="We ran into a problem fetching your transactions list."
          onRetry={refetch}
        />
      )}

      {/* Transactions Table Card */}
      <Card noPadding className="overflow-hidden">
        {/* Sideways internal scroll wrapper - prevents whole page horizontal scrolling on mobile */}
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[680px]">
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-50/60 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-6">Date</th>
                <th className="py-3.5 px-6">Vendor</th>
                <th className="py-3.5 px-6">Category</th>
                <th className="py-3.5 px-6">Amount</th>
                <th className="py-3.5 px-6">Type</th>
                <th className="py-3.5 px-6 text-right">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-xs sm:text-sm text-slate-700">
              {isLoading ? (
                <>
                  <TableRowSkeleton columns={6} />
                  <TableRowSkeleton columns={6} />
                  <TableRowSkeleton columns={6} />
                  <TableRowSkeleton columns={6} />
                  <TableRowSkeleton columns={6} />
                </>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12">
                    <EmptyState
                      title="No transactions found"
                      description="Try adjusting your search query or filters to find what you're looking for."
                      actionLabel="Reset filters"
                      onAction={() => {
                        setSearch("");
                        setSelectedCategory("All Categories");
                      }}
                    />
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => {
                  const isExpense = tx.type === "expense";
                  return (
                    <tr
                      key={tx.id}
                      className="hover:bg-slate-50/70 transition-colors group"
                    >
                      {/* Date */}
                      <td className="py-4 px-6 text-xs text-slate-500 whitespace-nowrap font-medium">
                        {formatDate(tx.date)}
                      </td>

                      {/* Vendor */}
                      <td className="py-4 px-6 font-semibold text-slate-900 whitespace-nowrap">
                        {tx.vendor}
                      </td>

                      {/* Category */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <CategoryBadge category={tx.category} />
                      </td>

                      {/* Amount */}
                      <td className="py-4 px-6 font-bold text-slate-900 whitespace-nowrap">
                        {naira(tx.amount_kobo)}
                      </td>

                      {/* Type Badge */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <Badge variant={isExpense ? "expense" : "income"}>
                          {isExpense ? "Expense" : "Income"}
                        </Badge>
                      </td>

                      {/* Status Badge */}
                      <td className="py-4 px-6 text-right whitespace-nowrap">
                        <Badge variant="confirmed">Confirmed</Badge>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            Showing page <span className="font-semibold text-slate-800">{page}</span> of{" "}
            <span className="font-semibold text-slate-800">{totalPages}</span>
          </p>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {[1, 2, 3, 4].slice(0, totalPages).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPage(p)}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                  page === p
                    ? "bg-[#0F3A2E] text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {p}
              </button>
            ))}

            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </Card>

      {/* Manual Entry Modal */}
      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={(tx) => createMutation.mutateAsync(tx)}
        categories={categories}
      />
    </div>
  );
}

export default TransactionsPage;
