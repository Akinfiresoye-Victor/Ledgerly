import React, { useState } from "react";
import { AlertTriangle, Calendar, ChevronDown } from "lucide-react";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import { nairaToKobo, koboToNaira } from "../../lib/money";

export function ReceiptReviewForm({
  draft,
  categories = [],
  onConfirm,
  onCancel,
  isSubmitting = false,
}) {
  const [formData, setFormData] = useState({
    vendor: draft?.vendor || "GoodLife Mart",
    date: draft?.date || "2026-09-14",
    amountNaira: draft?.amount_kobo ? (draft.amount_kobo / 100).toLocaleString() : "45,000",
    category: draft?.category || "Food & Meals",
    note: draft?.note || "Food purchase",
  });

  const [warnings, setWarnings] = useState({
    vendor: draft?.vendor_confidence ? draft.vendor_confidence < 0.7 : true,
    amount: draft?.amount_confidence ? draft.amount_confidence < 0.7 : true,
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // If user edits the field, remove the warning highlight as it has been reviewed
    if (warnings[field]) {
      setWarnings((prev) => ({ ...prev, [field]: false }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanAmount = String(formData.amountNaira).replace(/[^0-9.]/g, "");
    const amountKobo = nairaToKobo(cleanAmount);

    onConfirm({
      vendor: formData.vendor,
      date: formData.date,
      amount_kobo: amountKobo,
      category: formData.category,
      note: formData.note,
    });
  };

  return (
    <Card className="p-6">
      <div className="mb-5">
        <h3 className="text-base font-bold text-slate-900">Review & Confirm</h3>
        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
          Please confirm the details below. Fields highlighted in yellow may need
          your attention.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Vendor Field (Yellow highlight when uncertain) */}
        <Input
          label="Vendor"
          required
          value={formData.vendor}
          onChange={(e) => handleChange("vendor", e.target.value)}
          warning={warnings.vendor}
          warningMessage="Please verify"
          placeholder="e.g. GoodLife Mart"
        />

        {/* Date Field */}
        <Input
          label="Date"
          required
          type="date"
          value={formData.date}
          onChange={(e) => handleChange("date", e.target.value)}
          placeholder="YYYY-MM-DD"
        />

        {/* Amount Field (Yellow highlight when uncertain) */}
        <div className="w-full flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
            <span>
              Amount <span className="text-emerald-700">*</span>
            </span>
            {warnings.amount && (
              <span className="text-amber-700 font-medium text-[11px] flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-amber-500" />
                Please verify
              </span>
            )}
          </label>
          <div className="relative flex items-center w-full">
            <span className="absolute left-3.5 text-xs font-bold text-slate-500 pointer-events-none">
              ₦
            </span>
            <input
              type="text"
              value={formData.amountNaira}
              onChange={(e) => handleChange("amount", e.target.value)}
              className={`w-full min-h-[44px] pl-8 pr-10 py-2.5 text-sm rounded-xl border transition-colors outline-none font-semibold ${
                warnings.amount
                  ? "bg-[#FEF08A]/35 border-amber-300 text-slate-900 focus:bg-[#FEF08A]/50 focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                  : "bg-white border-slate-200 text-slate-800 focus:border-[#0F3A2E] focus:ring-1 focus:ring-[#0F3A2E]"
              }`}
            />
            {warnings.amount && (
              <div className="absolute right-3.5 flex items-center text-amber-500 pointer-events-none">
                <AlertTriangle className="w-4 h-4" />
              </div>
            )}
          </div>
        </div>

        {/* Category Field */}
        <div className="w-full flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-700">
            Category <span className="text-emerald-700">*</span>
          </label>
          <div className="relative">
            <select
              value={formData.category}
              onChange={(e) => handleChange("category", e.target.value)}
              className="w-full min-h-[44px] px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-white text-slate-800 appearance-none focus:outline-none focus:border-[#0F3A2E] focus:ring-1 focus:ring-[#0F3A2E] font-medium"
            >
              {categories.map((cat) => (
                <option key={cat.id || cat.name} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Description / Note */}
        <div className="w-full flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-700">
            Description
          </label>
          <textarea
            rows={2}
            value={formData.note}
            onChange={(e) => handleChange("note", e.target.value)}
            placeholder="e.g. Food purchase"
            className="w-full p-3 text-sm rounded-xl border border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0F3A2E] focus:ring-1 focus:ring-[#0F3A2E] resize-none"
          />
        </div>

        {/* Buttons */}
        <div className="pt-4 flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={onCancel}
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
            Confirm
          </Button>
        </div>
      </form>
    </Card>
  );
}

export default ReceiptReviewForm;
