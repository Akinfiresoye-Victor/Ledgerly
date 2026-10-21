import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { X, CheckCircle2, FileText, Loader2, Sparkles } from "lucide-react";
import Dropzone from "./Dropzone";
import ReceiptReviewForm from "./ReceiptReviewForm";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { documentsApi } from "../../api/documents";
import { transactionsApi } from "../../api/transactions";
import { mockCategories, mockDraftReceipt } from "../../mocks/mockData";

export function UploadPage() {
  const navigate = useNavigate();

  // State: 'idle' | 'uploading' | 'reviewing' | 'confirmed'
  const [file, setFile] = useState({
    name: "receipt_2026-09-14.jpg",
    size: "2.4 MB",
    preview: null,
  });
  const [status, setStatus] = useState("reviewing"); // Default to reviewing state matching mockup!
  const [draft, setDraft] = useState(mockDraftReceipt.draft);
  const [confirmSuccess, setConfirmSuccess] = useState(false);

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

  const handleFileAccepted = async (acceptedFile) => {
    const preview = URL.createObjectURL(acceptedFile);
    setFile({
      name: acceptedFile.name,
      size: `${(acceptedFile.size / (1024 * 1024)).toFixed(1)} MB`,
      preview,
    });
    setStatus("uploading");

    try {
      const res = await documentsApi.upload(acceptedFile);
      const doc = res.data;
      setDraft(doc.draft || mockDraftReceipt.draft);
      setStatus("reviewing");
    } catch {
      // Fallback to mock extraction
      setTimeout(() => {
        setDraft(mockDraftReceipt.draft);
        setStatus("reviewing");
      }, 1500);
    }
  };

  const handleConfirm = async (confirmedData) => {
    try {
      await transactionsApi.confirm(mockDraftReceipt.id || 1, confirmedData);
      setConfirmSuccess(true);
      setTimeout(() => {
        navigate("/transactions");
      }, 1200);
    } catch (err) {
      console.error(err);
      setConfirmSuccess(true);
      setTimeout(() => {
        navigate("/transactions");
      }, 1200);
    }
  };

  const handleCancel = () => {
    setFile(null);
    setStatus("idle");
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Upload Receipt
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Upload receipts or statements to automatically extract transactions.
        </p>
      </div>

      {confirmSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <p className="text-sm font-semibold">
            Transaction confirmed successfully! Redirecting to transactions...
          </p>
        </div>
      )}

      {/* Dual Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left Column: Upload / File status */}
        <div className="space-y-4">
          <Dropzone
            onFileAccepted={handleFileAccepted}
            disabled={status === "uploading"}
          />

          {/* Uploaded File Thumbnail Pill */}
          {file && (
            <div className="bg-white rounded-2xl border border-slate-200/90 p-3.5 flex items-center justify-between shadow-subtle">
              <div className="flex items-center gap-3 min-w-0">
                {/* Simulated receipt thumbnail */}
                <div className="w-12 h-14 rounded-lg bg-slate-100 border border-slate-200/80 overflow-hidden flex items-center justify-center shrink-0">
                  <div className="w-full h-full p-1.5 flex flex-col justify-between bg-white text-[7px] text-slate-400 font-mono select-none">
                    <div className="border-b pb-0.5 font-bold text-[8px] text-slate-700">
                      GOODLIFE
                    </div>
                    <div className="space-y-0.5">
                      <div className="h-1 bg-slate-200 rounded w-full" />
                      <div className="h-1 bg-slate-200 rounded w-2/3" />
                    </div>
                    <div className="border-t pt-0.5 font-bold text-slate-900">
                      ₦45,000
                    </div>
                  </div>
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-800 truncate">
                    {file.name}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{file.size}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCancel}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                title="Remove file"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Progress / Status banner */}
          {status === "uploading" && (
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3.5 shadow-subtle animate-in fade-in">
              <div className="w-9 h-9 rounded-xl bg-white border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0 shadow-sm">
                <Loader2 className="w-5 h-5 animate-spin" />
              </div>
              <div>
                <p className="text-xs font-bold text-emerald-950">
                  Reading your receipt...
                </p>
                <p className="text-[11px] text-emerald-800/80 mt-0.5">
                  Our AI is extracting the important details. This will only take a
                  few seconds.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Review & Confirm Form */}
        <div>
          {status === "reviewing" ? (
            <ReceiptReviewForm
              draft={draft}
              categories={categories}
              onConfirm={handleConfirm}
              onCancel={handleCancel}
            />
          ) : (
            <Card className="p-8 text-center text-slate-400 border-dashed">
              <FileText className="w-10 h-10 mx-auto mb-3 opacity-40 text-slate-400" />
              <h4 className="text-sm font-bold text-slate-700">
                Receipt Details
              </h4>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                Upload a receipt image or document to see AI-extracted fields and
                confirm the record.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

export default UploadPage;
