import { fetchEventSource } from "@microsoft/fetch-event-source";
import api from "./client";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export async function streamChat({
  conversationId,
  message,
  signal,
  onToken,
  onToolStart,
  onToolEnd,
  onChart,
  onDone,
  onError,
}) {
  const token = localStorage.getItem("access");

  try {
    await fetchEventSource(`${BASE}/chat/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        conversation_id: conversationId,
        message,
      }),
      signal,
      async onopen(response) {
        if (response.ok) {
          return; // everything's good
        } else if (response.status >= 400 && response.status < 500 && response.status !== 429) {
          // client-side errors usually aren't worth retrying
          throw new Error(`HTTP Error ${response.status}`);
        }
      },
      onmessage(event) {
        if (!event.data) return;
        try {
          const data = JSON.parse(event.data);
          if (event.event === "token") onToken?.(data.text);
          else if (event.event === "tool_start") onToolStart?.(data.label || "Looking up records...");
          else if (event.event === "tool_end") onToolEnd?.();
          else if (event.event === "chart") onChart?.(data);
          else if (event.event === "done") onDone?.(data);
          else if (event.event === "error") onError?.(data.message || "An error occurred");
        } catch (err) {
          console.error("Failed to parse SSE event data:", err);
        }
      },
      onerror(err) {
        onError?.("Connection lost or server unavailable. Please try again.");
        throw err; // Stop automatic retries
      },
    });
  } catch (err) {
    if (signal?.aborted) return;
    onError?.(err.message || "Failed to establish chat stream.");
  }
}

export const chatApi = {
  streamChat,
  getConversations: () => api.get("/conversations/"),
  getMessages: (conversationId) => api.get(`/conversations/${conversationId}/messages/`),
};

export default chatApi;
