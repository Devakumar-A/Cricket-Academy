import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [hasValidSession, setHasValidSession] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Check URL parameters for explicit errors (e.g. expired link from Supabase)
    const hash = window.location.hash || "";
    const search = window.location.search || "";
    const params = new URLSearchParams(search || hash.replace(/^#/, "?"));

    const errorDesc = params.get("error_description");
    if (errorDesc) {
      setMessage(decodeURIComponent(errorDesc).replace(/\+/g, " "));
      setCheckingSession(false);
      setHasValidSession(false);
      return;
    }

    // Check active session & recovery token
    async function verifyRecoverySession() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setHasValidSession(true);
        } else {
          // If hash contains access_token, supabase might be parsing it asynchronously
          if (hash.includes("access_token") || search.includes("code")) {
            setHasValidSession(true);
          } else {
            setHasValidSession(false);
            setMessage("No active password recovery session detected. Your reset link may have expired or already been used.");
          }
        }
      } catch {
        setHasValidSession(false);
      } finally {
        setCheckingSession(false);
      }
    }

    verifyRecoverySession();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || (event === "SIGNED_IN" && session)) {
        setHasValidSession(true);
        setMessage("");
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (loading) return;

    setMessage("");
    setSuccess(false);

    if (password.length < 8) {
      setMessage("Password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        setMessage(
          error.message || "Your reset link may have expired. Please request a new one."
        );
        return;
      }

      setSuccess(true);
      setMessage("Password updated successfully! You can now sign in with your new password.");
      setPassword("");
      setConfirmPassword("");
    } catch {
      setMessage("Something went wrong while updating your password. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page auth-reset-page">
      <section className="auth-card auth-reset-card" style={{ maxWidth: "480px" }}>
        <div className="auth-modal-header" style={{ marginBottom: "20px" }}>
          <div className="auth-modal-badge" style={{ marginBottom: "8px" }}>
            MG CRICKETER&apos;S DEN
          </div>
          <h1>Reset Your Password</h1>
          <p>Choose a new, secure password for your player account.</p>
        </div>

        {checkingSession ? (
          <div style={{ textAlign: "center", padding: "24px 0", color: "#9ca3af" }}>
            Verifying secure reset link...
          </div>
        ) : !hasValidSession && !success ? (
          <div>
            <p
              role="alert"
              className="auth-message error"
              style={{
                padding: "14px",
                background: "rgba(239, 68, 68, 0.12)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                color: "#fca5a5",
                borderRadius: "8px",
                lineHeight: 1.5,
                fontSize: "0.9rem",
              }}
            >
              {message || "Your reset link is invalid or has expired."}
            </p>
            <div style={{ marginTop: "24px", display: "flex", flexDirection: "column", gap: "10px" }}>
              <a
                href="/forgot-password"
                className="auth-submit-btn"
                style={{ textAlign: "center", textDecoration: "none" }}
              >
                Request a New Reset Link →
              </a>
              <a
                href="/login"
                className="link-button"
                style={{ textAlign: "center", marginTop: "8px" }}
              >
                ← Return to Sign In
              </a>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="auth-modal-form">
            <div className="auth-input-group">
              <label htmlFor="reset-new-password">New Password (min. 8 characters)</label>
              <input
                id="reset-new-password"
                type="password"
                autoComplete="new-password"
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading || success}
                placeholder="Enter new password"
              />
            </div>

            <div className="auth-input-group">
              <label htmlFor="reset-confirm-password">Confirm New Password</label>
              <input
                id="reset-confirm-password"
                type="password"
                autoComplete="new-password"
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading || success}
                placeholder="Re-enter new password"
              />
            </div>

            {message && (
              <p
                role={success ? "status" : "alert"}
                className={success ? "auth-message success" : "auth-message error"}
                style={{
                  padding: "12px 14px",
                  borderRadius: "8px",
                  background: success ? "rgba(34, 197, 94, 0.12)" : "rgba(239, 68, 68, 0.12)",
                  border: success ? "1px solid rgba(34, 197, 94, 0.3)" : "1px solid rgba(239, 68, 68, 0.3)",
                  color: success ? "#86efac" : "#fca5a5",
                  fontSize: "0.9rem",
                  lineHeight: 1.5,
                  margin: "12px 0",
                }}
              >
                {message}
              </p>
            )}

            {success ? (
              <a
                className="auth-submit-btn"
                href="/login"
                style={{ textAlign: "center", textDecoration: "none", display: "block" }}
              >
                Proceed to Sign In →
              </a>
            ) : (
              <button
                type="submit"
                className="auth-submit-btn"
                disabled={loading}
                style={{ width: "100%", marginTop: "12px" }}
              >
                {loading ? "Updating Password..." : "Update Password →"}
              </button>
            )}
          </form>
        )}
      </section>
    </main>
  );
}
