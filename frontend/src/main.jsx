import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

async function enableMocking() {
  if (import.meta.env.VITE_ENABLE_MSW === "true" || import.meta.env.DEV) {
    try {
      const { worker } = await import("./mocks/browser");
      return worker.start({
        onUnhandledRequest: "bypass",
        quiet: true,
      });
    } catch (err) {
      console.warn("MSW failed to initialize, falling back to live network:", err);
    }
  }
}

enableMocking().finally(() => {
  ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});
