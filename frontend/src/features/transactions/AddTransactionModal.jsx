import React, { useState } from "react";
import { ChevronDown, Calendar } from "lucide-react";
import Modal from "../../components/ui/Modal";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { nairaToKobo } from "../../lib/money";

export function AddTransactionModal({ isOpen, onClose, onSave, categories = [] }) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().slice(0, 10),
    vendor: "",
    category: "",
    amountNaira: "",
    note: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.vendor.trim()) newErrors.vendor = "Vendor is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.amountNaira || Number(formData.amountNaira.replace(/,/g, "")) <= 0) {
      newErrors.amountNaira = "Valid amount is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    const amountKobo = nairaToKobo(formData.amountNaira);
    const isIncome = formData.category.toLowerCase() === "income";

    await onSave({
      date: formData.date,
      vendor: formData.vendor,
      category: formData.category,
      amount_kobo: amountKobo,
      type: isIncome ? "income" : "expense",
      note: formData.note,
    });

    setIsSubmitting(false);
    setFormData({
      date: new Date().toISOString().slice(0, 10),
      vendor: "",
      category: "",
      amountNaira: "",
      note: "",
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Transaction"
      subtitle="Add a new transaction manually."
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Date Field */}
        <Input
          label="Date"
          required
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
        />

        {/* Vendor Field */}
        <Input
          label="Vendor"
          required
          placeholder="e.g. Supplier"
          value={formData.vendor}
          onChange={(e) => {
            setFormData({ ...formData, vendor: e.target.value });
            if (errors.vendor) setErrors({ ...errors, vendor: "" });
          }}
          error={errors.vendor}
        />

        {/* Category Field */}
        <div className="w-full flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-700">
            Category <span className="text-emerald-700">*</span>
          </label>
          <div className="relative">
            <select
              value={formData.category}
              onChange={(e) => {
                setFormData({ ...formData, category: e.target.value });
                if (errors.category) setErrors({ ...errors, category: "" });
              }}
              className={`w-full min-h-[44px] px-3.5 py-2.5 text-sm rounded-xl border appearance-none focus:outline-none focus:ring-1 ${
                errors.category
                  ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500"
                  : "border-slate-200 bg-white text-slate-800 focus:border-[#0F3A2E] focus:ring-[#0F3A2E]"
              }`}
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id || cat.name} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          {errors.category && (
            <span className="text-xs text-rose-600 font-medium">{errors.category}</span>
          )}
        </div>

        {/* Amount Field */}
        <div className="w-full flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-700">
            Amount (₦) <span className="text-emerald-700">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
              ₦
            </span>
            <input
              type="text"
              placeholder="e.g. 50,000"
              value={formData.amountNaira}
              onChange={(e) => {
                setFormData({ ...formData, amountNaira: e.target.value });
                if (errors.amountNaira) setErrors({ ...errors, amountNaira: "" });
              }}
              className={`w-full min-h-[44px] pl-8 pr-3.5 py-2.5 text-sm rounded-xl border font-semibold outline-none focus:ring-1 ${
                errors.amountNaira
                  ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500"
                  : "border-slate-200 bg-white text-slate-800 focus:border-[#0F3A2E] focus:ring-[#0F3A2E]"
              }`}
            />
          </div>
          {errors.amountNaira && (
            <span className="text-xs text-rose-600 font-medium">
              {errors.amountNaira}
            </span>
          )}
        </div>

        {/* Description Field */}
        <div className="w-full flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-700">
            Description
          </label>
          <textarea
            rows={2}
            placeholder="e.g. Stationery and office supplies"
            value={formData.note}
            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
            className="w-full p-3 text-sm rounded-xl border border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0F3A2E] focus:ring-1 focus:ring-[#0F3A2E] resize-none"
          />
        </div>

        {/* Action Buttons */}
        <div className="pt-4 flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isSubmitting}
            className="px-6 font-semibold"
          >
            Save Transaction
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default AddTransactionModal;
