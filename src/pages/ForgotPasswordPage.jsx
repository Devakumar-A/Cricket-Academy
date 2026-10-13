import { useState } from "react";
import { sendPasswordResetEmail } from "../utils/authResetHelper";

export default function ForgotPasswordPage({ onBack, onLogin }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (loading) return;

    setMessage("");
    setIsSuccess(false);
    setLoading(true);

    const result = await sendPasswordResetEmail(email);
    setLoading(false);

    if (result.success) {
      setIsSuccess(true);
      setMessage(result.message);
    } else {
      setIsSuccess(false);
      setMessage(result.message);
    }
  }

  const handleReturnToLogin = () => {
    if (onLogin) {
      onLogin();
    } else if (onBack) {
      onBack();
    } else {
      window.location.href = "/login";
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-modal-badge" style={{ marginBottom: "12px" }}>
          MG CRICKETER&apos;S DEN
        </div>
        <h1>Account Recovery</h1>
        <h2>Forgot Your Password?</h2>
        <p>
          Enter your registered email address to receive secure instructions to reset your password.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="auth-input-group">
            <label htmlFor="forgot-page-email">Registered Email Address</label>
            <input
              id="forgot-page-email"
              type="email"
              autoComplete="email"
              placeholder="e.g. player@mgcricketersden.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (isSuccess) setIsSuccess(false);
              }}
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading || (isSuccess && !message)}
            style={{ width: "100%", marginTop: "12px" }}
          >
            {loading ? "Sending Reset Link..." : "Send Reset Instructions →"}
          </button>
        </form>

        {message && (
          <p
            role={isSuccess ? "status" : "alert"}
            className={isSuccess ? "auth-message success" : "auth-message error"}
            style={{
              marginTop: "16px",
              padding: "12px 14px",
              borderRadius: "8px",
              background: isSuccess ? "rgba(34, 197, 94, 0.12)" : "rgba(239, 68, 68, 0.12)",
              border: isSuccess ? "1px solid rgba(34, 197, 94, 0.3)" : "1px solid rgba(239, 68, 68, 0.3)",
              color: isSuccess ? "#86efac" : "#fca5a5",
              fontSize: "0.9rem",
              lineHeight: 1.5,
            }}
          >
            {message}
          </p>
        )}

        <div style={{ marginTop: "24px", textAlign: "center" }}>
          <button
            type="button"
            className="link-button"
            onClick={handleReturnToLogin}
          >
            ← Return to Sign In
          </button>
        </div>
      </div>
    </div>
  );
}
