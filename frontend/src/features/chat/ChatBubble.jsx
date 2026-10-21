import React from "react";
import { Sparkles, Loader2, Search } from "lucide-react";
import ChatInlineChart from "./ChatInlineChart";

export function ChatBubble({ message }) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end mb-4 animate-in fade-in">
        <div className="max-w-md">
          <div className="bg-[#EBF5FB] text-slate-800 px-4 py-3 rounded-2xl rounded-tr-sm text-xs sm:text-sm font-medium shadow-subtle">
            {message.content}
          </div>
          <div className="text-[10px] text-slate-400 text-right mt-1 mr-1">
            {message.timestamp || "10:24 AM"}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 mb-6 animate-in fade-in">
      {/* Assistant Avatar */}
      <div className="w-8 h-8 rounded-xl bg-[#08281F] text-emerald-400 flex items-center justify-center shrink-0 shadow-sm mt-0.5">
        <Sparkles className="w-4 h-4 text-emerald-400" />
      </div>

      <div className="flex-1 max-w-xl">
        {/* Status Line (When tools are running during SSE) */}
        {message.statusLabel && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-600 text-xs font-medium mb-2.5 animate-pulse">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" />
            <span>{message.statusLabel}</span>
          </div>
        )}

        {/* Assistant Text Bubble */}
        {message.content && (
          <div className="bg-white border border-slate-200/80 px-4 py-3.5 rounded-2xl rounded-tl-sm text-xs sm:text-sm text-slate-800 leading-relaxed shadow-subtle">
            {message.content}
          </div>
        )}

        {/* Inline Chart */}
        {message.chart && (
          <ChatInlineChart
            title={message.chart.title}
            total={message.chart.total}
            change={message.chart.change}
            data={message.chart.data}
          />
        )}

        {/* Citation Metadata Badge */}
        {message.citation && (
          <div className="mt-2.5 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100/90 border border-slate-200/80 text-[11px] text-slate-600 font-medium">
            <Search className="w-3 h-3 text-slate-400" />
            <span>
              <strong className="text-slate-700">What I searched for:</strong>{" "}
              {message.citation}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatBubble;
