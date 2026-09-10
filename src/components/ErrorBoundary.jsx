import { Component } from "react";

/**
 * Catches uncaught React errors (including those thrown inside Suspense lazy chunks)
 * and shows a friendly recovery screen instead of a blank page.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("[ErrorBoundary] Caught error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: "60vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#04070c",
          color: "#e5e7eb",
          padding: "32px",
          textAlign: "center",
          gap: "16px",
        }}>
          <span style={{ fontSize: "48px" }}>🏏</span>
          <h2 style={{ color: "#d4a017", fontFamily: "Outfit, sans-serif", margin: 0 }}>
            Something went wrong
          </h2>
          <p style={{ color: "#9ca3af", maxWidth: "400px", margin: 0 }}>
            An unexpected error occurred. Please try refreshing the page.
          </p>
          {this.state.error && (
            <pre style={{
              fontSize: "12px",
              color: "#ef4444",
              background: "#111",
              padding: "12px 16px",
              borderRadius: "8px",
              maxWidth: "560px",
              overflowX: "auto",
              whiteSpace: "pre-wrap",
              textAlign: "left",
            }}>
              {this.state.error.message}
            </pre>
          )}
          <button
            type="button"
            onClick={() => window.location.reload()}
            style={{
              background: "#d4a017",
              color: "#04070c",
              border: "none",
              borderRadius: "8px",
              padding: "10px 24px",
              fontWeight: "700",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            🔄 Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
