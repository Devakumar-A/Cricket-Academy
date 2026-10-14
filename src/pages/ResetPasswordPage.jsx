import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import "./ResetPasswordPage.css";

const ACADEMY_LOGO_SRC = "/logoo.webp";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Initialize checking & session status from URL query or hash if available
  const [checkingSession, setCheckingSession] = useState(() => {
    if (typeof window === "undefined") return true;
    const hash = window.location.hash || "";
    const search = window.location.search || "";
    const params = new URLSearchParams(search || hash.replace(/^#/, "?"));
    return !params.get("error_description");
  });

  const [hasValidSession, setHasValidSession] = useState(false);
  const [message, setMessage] = useState(() => {
    if (typeof window === "undefined") return "";
    const hash = window.location.hash || "";
    const search = window.location.search || "";
    const params = new URLSearchParams(search || hash.replace(/^#/, "?"));
    const errorDesc = params.get("error_description");
    return errorDesc ? decodeURIComponent(errorDesc).replace(/\+/g, " ") : "";
  });
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const hash = typeof window !== "undefined" ? window.location.hash || "" : "";
    const search = typeof window !== "undefined" ? window.location.search || "" : "";
    const params = new URLSearchParams(search || hash.replace(/^#/, "?"));

    if (params.get("error_description")) {
      return;
    }

    // Check active session & recovery token
    async function verifyRecoverySession() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setHasValidSession(true);
        } else {
          // If hash contains access_token or code, Supabase client may be processing it asynchronously
          if (hash.includes("access_token") || search.includes("code")) {
            setHasValidSession(true);
          } else {
            setHasValidSession(false);
            setMessage(
              "No active password recovery session detected. Your reset link may have expired or already been used."
            );
          }
        }
      } catch {
        setHasValidSession(false);
        setMessage("Unable to verify reset link. Please request a new one.");
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

  const isMinLength = password.length >= 8;
  const isMatching = confirmPassword.length > 0 && password === confirmPassword;
  const canSubmit = isMinLength && isMatching && !loading;

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
      setMessage("Passwords do not match. Please verify both fields.");
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
      setMessage("Password updated successfully! Your account is now secured with your new password.");
      setPassword("");
      setConfirmPassword("");
    } catch {
      setMessage("Something went wrong while updating your password. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="reset-page-container">
      {/* Decorative ambient elements */}
      <div className="reset-bg-ambient" aria-hidden="true">
        <div className="reset-bg-circle-glow" />
        <div className="reset-bg-cricket-seam" />
      </div>

      <section className="reset-card" aria-labelledby="reset-heading">
        {/* Athletic gold accent line */}
        <div className="reset-card-accent-bar" aria-hidden="true" />

        {/* Brand Header */}
        <header className="reset-header">
          <div className="reset-logo-wrapper">
            <img
              src={ACADEMY_LOGO_SRC}
              alt="MG Cricketer's Den"
              width="48"
              height="48"
              decoding="async"
              className="reset-logo-img"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>

          <div className="reset-badge">
            <svg
              viewBox="0 0 24 24"
              className="reset-badge-icon"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
            <span>MG CRICKETER&apos;S DEN</span>
          </div>

          <h1 id="reset-heading" className="reset-title">
            {success ? "Password Updated" : "Reset Your Password"}
          </h1>
          <p className="reset-subtitle">
            {success
              ? "Your player credentials have been updated successfully."
              : "Choose a new, secure password for your player account."}
          </p>
        </header>

        {/* State 1: Verifying Session Loader */}
        {checkingSession ? (
          <div className="reset-state-screen" role="status">
            <div className="reset-spinner-gold" aria-hidden="true" />
            <p style={{ color: "#9ca3af", fontSize: "14px", margin: 0 }}>
              Verifying secure recovery link...
            </p>
          </div>
        ) : success ? (
          /* State 2: Success Confirmation Screen */
          <div className="reset-state-screen">
            <div className="reset-state-icon-circle success" aria-hidden="true">
              <svg
                viewBox="0 0 24 24"
                width="30"
                height="30"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <h2 className="reset-state-title">All Set!</h2>
            <p className="reset-state-desc">
              Your password has been changed. You can now use your new password to sign in and access your training portal and turf reservations.
            </p>
            <div className="reset-state-actions">
              <a href="/login" className="reset-submit-btn">
                Proceed to Sign In →
              </a>
            </div>
          </div>
        ) : !hasValidSession ? (
          /* State 3: Invalid or Expired Recovery Link */
          <div className="reset-state-screen">
            <div className="reset-state-icon-circle error" aria-hidden="true">
              <svg
                viewBox="0 0 24 24"
                width="28"
                height="28"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <h2 className="reset-state-title">Link Expired or Invalid</h2>
            <p className="reset-state-desc">
              {message ||
                "This password reset link is invalid or has already been used. Please request a fresh reset link."}
            </p>
            <div className="reset-state-actions">
              <a href="/forgot-password" className="reset-submit-btn">
                Request a New Reset Link →
              </a>
              <a href="/login" className="reset-secondary-btn">
                ← Return to Sign In
              </a>
            </div>
          </div>
        ) : (
          /* State 4: Reset Password Form */
          <form onSubmit={handleSubmit} className="reset-form" noValidate>
            {message && (
              <div role="alert" className="reset-alert reset-alert-error">
                <svg
                  viewBox="0 0 24 24"
                  className="reset-alert-icon"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <div className="reset-alert-content">{message}</div>
              </div>
            )}

            {/* Field 1: New Password */}
            <div className="reset-input-group">
              <label htmlFor="reset-new-password" className="reset-label">
                New Password
              </label>
              <div className="reset-input-wrapper">
                <input
                  id="reset-new-password"
                  name="new-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  placeholder="Enter new password (min. 8 chars)"
                  className="reset-input"
                  aria-describedby="reset-checklist-rules"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="reset-toggle-btn"
                  aria-label={showPassword ? "Hide new password" : "Show new password"}
                  disabled={loading}
                >
                  {showPassword ? (
                    <svg
                      viewBox="0 0 24 24"
                      className="reset-toggle-icon"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg
                      viewBox="0 0 24 24"
                      className="reset-toggle-icon"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Field 2: Confirm New Password */}
            <div className="reset-input-group">
              <label htmlFor="reset-confirm-password" className="reset-label">
                Confirm New Password
              </label>
              <div className="reset-input-wrapper">
                <input
                  id="reset-confirm-password"
                  name="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  minLength={8}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading}
                  placeholder="Re-enter your new password"
                  className="reset-input"
                  aria-describedby="reset-checklist-rules"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="reset-toggle-btn"
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                  disabled={loading}
                >
                  {showConfirmPassword ? (
                    <svg
                      viewBox="0 0 24 24"
                      className="reset-toggle-icon"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg
                      viewBox="0 0 24 24"
                      className="reset-toggle-icon"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Real-time validation cues */}
            <div id="reset-checklist-rules" className="reset-checklist" aria-live="polite">
              <div
                className={`reset-checklist-item ${
                  isMinLength ? "valid" : "invalid"
                }`}
              >
                <svg
                  viewBox="0 0 20 20"
                  className="reset-check-icon"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  {isMinLength ? (
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  ) : (
                    <circle cx="10" cy="10" r="4" fill="currentColor" opacity="0.5" />
                  )}
                </svg>
                <span>At least 8 characters</span>
              </div>

              <div
                className={`reset-checklist-item ${
                  isMatching ? "valid" : "invalid"
                }`}
              >
                <svg
                  viewBox="0 0 20 20"
                  className="reset-check-icon"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  {isMatching ? (
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  ) : (
                    <circle cx="10" cy="10" r="4" fill="currentColor" opacity="0.5" />
                  )}
                </svg>
                <span>Passwords match</span>
              </div>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={!canSubmit}
              className="reset-submit-btn"
              aria-busy={loading}
            >
              {loading ? (
                <>
                  <span className="reset-spinner" aria-hidden="true" />
                  <span>Updating Password...</span>
                </>
              ) : (
                <span>Update Password →</span>
              )}
            </button>
          </form>
        )}

        {/* Card Footer Return Link */}
        {!success && hasValidSession && !checkingSession && (
          <footer className="reset-footer">
            <a href="/login" className="reset-footer-link">
              ← Return to Sign In
            </a>
          </footer>
        )}
      </section>
    </main>
  );
}
