import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./styles/globals.css";
import "./firebase/seed.js"; // registers window.__novaSeed() in dev mode

class RootErrorBoundary extends React.Component {
  state = { error: null };
  static getDerivedStateFromError(e) { return { error: e }; }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 40, fontFamily: "monospace", background: "#fff1f2", minHeight: "100vh" }}>
          <h2 style={{ color: "#b91c1c", marginBottom: 12 }}>⚠ App Error</h2>
          <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word", color: "#1e293b", fontSize: 13, background: "#fee2e2", padding: 16, borderRadius: 8 }}>
            {this.state.error?.message}
            {"\n\n"}
            {this.state.error?.stack}
          </pre>
          <button onClick={() => window.location.reload()}
            style={{ marginTop: 16, padding: "8px 20px", background: "#000", color: "#fff", border: "none", cursor: "pointer", fontFamily: "monospace" }}>
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function Cursor() {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const el = ref.current;
    const move = (e) => {
      if (!el) return;
      el.style.transform = `translate(${e.clientX - 9}px, ${e.clientY - 9}px)`;
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);
  return <div id="nova-cursor" ref={ref} />;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <RootErrorBoundary>
        <App />
      </RootErrorBoundary>
      <Cursor />
    </BrowserRouter>
  </React.StrictMode>
);
