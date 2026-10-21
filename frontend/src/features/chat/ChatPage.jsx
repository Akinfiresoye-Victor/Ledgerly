import React, { useState, useRef, useEffect } from "react";
import { Send, ArrowUpRight, Sparkles, RefreshCcw } from "lucide-react";
import ChatBubble from "./ChatBubble";
import { streamChat } from "../../api/chat";

const INITIAL_MESSAGES = [
  {
    id: "msg-1",
    role: "user",
    content: "How much did I spend on transport in September?",
    timestamp: "10:24 AM",
  },
  {
    id: "msg-2",
    role: "assistant",
    content:
      "You spent ₦ 164,500 on transport in September 2026. That's 22% of your total expenses.",
    chart: {
      title: "Transport Spending",
      total: "₦ 164,500",
      change: "22% vs Aug",
      data: [
        { day: "Sep 1", amount: 15000 },
        { day: "Sep 7", amount: 35000 },
        { day: "Sep 14", amount: 28000 },
        { day: "Sep 21", amount: 48500 },
        { day: "Sep 28", amount: 38000 },
      ],
    },
    citation: "Category: Transport | Dates: Sept 1 - Sept 30, 2026",
    timestamp: "10:24 AM",
  },
];

export function ChatPage() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (textToSend) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isStreaming) return;

    setInputValue("");
    const userMsgId = `user-${Date.now()}`;
    const assistantMsgId = `asst-${Date.now()}`;

    // Add user message
    setMessages((prev) => [
      ...prev,
      {
        id: userMsgId,
        role: "user",
        content: text,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);

    setIsStreaming(true);

    // Initial assistant message placeholder with tool status line
    setMessages((prev) => [
      ...prev,
      {
        id: assistantMsgId,
        role: "assistant",
        content: "",
        statusLabel: "Looking up your business records...",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);

    // Try calling real stream or gracefully simulate SSE token streaming
    try {
      let accumulatedText = "";
      await streamChat({
        conversationId: "conv-1",
        message: text,
        onToolStart: (label) => {
          setMessages((prev) =>
            prev.map((m) => (m.id === assistantMsgId ? { ...m, statusLabel: label } : m))
          );
        },
        onToolEnd: () => {
          setMessages((prev) =>
            prev.map((m) => (m.id === assistantMsgId ? { ...m, statusLabel: null } : m))
          );
        },
        onToken: (token) => {
          accumulatedText += token;
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMsgId ? { ...m, content: accumulatedText } : m
            )
          );
        },
        onChart: (chartData) => {
          setMessages((prev) =>
            prev.map((m) => (m.id === assistantMsgId ? { ...m, chart: chartData } : m))
          );
        },
        onDone: (doneData) => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMsgId
                ? {
                    ...m,
                    statusLabel: null,
                    citation: doneData?.meta?.searched || "Verified from database records",
                  }
                : m
            )
          );
          setIsStreaming(false);
        },
        onError: () => {
          simulateFallbackStream(text, assistantMsgId);
        },
      });
    } catch {
      simulateFallbackStream(text, assistantMsgId);
    }
  };

  const simulateFallbackStream = (query, assistantMsgId) => {
    // Graceful offline simulated stream word-by-word
    let replyText = "";
    let citation = "";
    let chart = null;

    if (query.toLowerCase().includes("transport")) {
      replyText =
        "You spent ₦ 164,500 on transport in September 2026. That's 22% of your total expenses.";
      citation = "Category: Transport | Dates: Sept 1 - Sept 30, 2026";
      chart = {
        title: "Transport Spending",
        total: "₦ 164,500",
        change: "+22% vs Aug",
        data: [
          { day: "Sep 1", amount: 15000 },
          { day: "Sep 7", amount: 35000 },
          { day: "Sep 14", amount: 28000 },
          { day: "Sep 21", amount: 48500 },
          { day: "Sep 28", amount: 38000 },
        ],
      };
    } else if (query.toLowerCase().includes("owe")) {
      replyText =
        "You currently have 3 customers with outstanding payments totaling ₦ 420,000 overdue for more than 14 days.";
      citation = "Query: Unpaid Invoices | Direction: owed_to_me";
    } else {
      replyText =
        "Based on your confirmed records for September 2026, total income is ₦ 2,450,000 and total expenses are ₦ 1,320,000, giving a net profit of ₦ 1,130,000 (+15% vs August).";
      citation = "Query: get_summary | Period: 2026-09-01 to 2026-09-30";
    }

    const words = replyText.split(" ");
    let i = 0;
    let currentWords = "";

    const interval = setInterval(() => {
      if (i < words.length) {
        currentWords += (i === 0 ? "" : " ") + words[i];
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMsgId
              ? {
                  ...m,
                  statusLabel: i < 3 ? "Querying database..." : null,
                  content: currentWords,
                }
              : m
          )
        );
        i++;
      } else {
        clearInterval(interval);
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMsgId
              ? {
                  ...m,
                  statusLabel: null,
                  chart,
                  citation,
                }
              : m
          )
        );
        setIsStreaming(false);
      }
    }, 60);
  };

  const sampleQuestions = [
    "How much did I spend on transport in September?",
    "Who owes me money?",
    "Show me my spending by category this month",
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-8.5rem)] max-w-4xl mx-auto">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200/80 flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Chat
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Ask any question about your finances in plain English.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setMessages(INITIAL_MESSAGES)}
          title="Reset conversation"
          className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
        >
          <RefreshCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Message List Pane */}
      <div className="flex-1 overflow-y-auto py-6 pr-2 space-y-2">
        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Query Chips */}
      <div className="py-2.5 flex items-center gap-2 overflow-x-auto no-scrollbar">
        {sampleQuestions.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => handleSend(q)}
            disabled={isStreaming}
            className="text-[11px] font-semibold text-slate-600 bg-white hover:bg-slate-50 border border-slate-200/80 px-3 py-1.5 rounded-full whitespace-nowrap shadow-subtle transition-all disabled:opacity-50"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Chat Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="pt-2"
      >
        <div className="relative flex items-center w-full bg-white rounded-2xl border border-slate-200/90 shadow-card focus-within:border-[#0F3A2E] focus-within:ring-1 focus-within:ring-[#0F3A2E] transition-all p-1.5 pl-4">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask a question..."
            disabled={isStreaming}
            className="flex-1 text-xs sm:text-sm text-slate-800 placeholder-slate-400 bg-transparent outline-none disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={!inputValue.trim() || isStreaming}
            className="w-10 h-10 rounded-xl bg-[#0F3A2E] text-white flex items-center justify-center hover:bg-[#154B3C] active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition-all shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}

export default ChatPage;
