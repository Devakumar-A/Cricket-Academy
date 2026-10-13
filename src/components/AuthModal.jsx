import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { sendPasswordResetEmail } from "../utils/authResetHelper";
import "./AuthModal.css";

export default function AuthModal({
  isOpen,
  onClose,
  onSuccess,
  initialView = "login",
  targetAction = "book or apply",
}) {
  const [view, setView] = useState(initialView);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Google sign-in
  async function handleGoogleSignIn() {
    if (loading) return;
    setMessage("");
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setMessage(error.message);
        setMessageType("error");
        setLoading(false);
      }
    } catch {
      setMessage("Unable to connect to Google. Please try again.");
      setMessageType("error");
      setLoading(false);
    }
  }

  // Send password reset email using shared helper
  async function handleForgotPassword(e) {
    e.preventDefault();
    if (loading) return;

    setMessage("");
    setResetEmailSent(false);
    setLoading(true);

    const result = await sendPasswordResetEmail(email);
    setLoading(false);

    if (result.success) {
      setResetEmailSent(true);
      setMessage(result.message);
      setMessageType("success");
    } else {
      setMessage(result.message);
      setMessageType("error");
    }
  }

  // Email/Password login
  async function handleLogin(e) {
    e.preventDefault();
    if (loading) return;

    setMessage("");
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setMessage(error.message);
        setMessageType("error");
        return;
      }

      onSuccess(data.user);
    } catch {
      setMessage("Unable to sign in. Please verify your credentials and try again.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }

  // Email/Password registration
  async function handleSignup(e) {
    e.preventDefault();
    if (loading) return;

    setMessage("");
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: { name: name.trim() },
        },
      });

      if (error) {
        setMessage(error.message);
        setMessageType("error");
        return;
      }

      if (data.session && data.user) {
        onSuccess(data.user);
      } else {
        setMessage(
          "Account created! Please check your email to verify or sign in now."
        );
        setMessageType("success");
        setView("login");
      }
    } catch {
      setMessage("Unable to create your account. Please try again.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }

  function openView(nextView) {
    setView(nextView);
    setMessage("");
    setMessageType("");
    setResetEmailSent(false);
  }

  return (
    <div
      className="auth-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div
        className="auth-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle decorative gold top accent bar */}
        <div className="auth-modal-accent-bar" aria-hidden="true" />

        <button
          className="auth-modal-close"
          onClick={onClose}
          aria-label="Close dialog"
          type="button"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            width="18"
            height="18"
            stroke="currentColor"
            strokeWidth="2.2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="auth-modal-header">
          <div className="auth-modal-badge">MG CRICKETER&apos;S DEN</div>

          <h2 id="auth-modal-title">
            {view === "login" && "Welcome Back"}
            {view === "signup" && "Create Account"}
            {view === "forgot" && "Reset Password"}
          </h2>

          <p className="auth-modal-subtitle">
            {view === "login" && "Sign in to access your member account."}
            {view === "signup" && `Register to ${targetAction} and access player features.`}
            {view === "forgot" && "Enter your registered email to receive a password reset link."}
          </p>
        </div>

        {message && (
          <div
            className={`auth-modal-msg ${messageType}`}
            role={messageType === "error" ? "alert" : "status"}
            aria-live="polite"
          >
            {message}
          </div>
        )}

        {/* ================= LOGIN VIEW ================= */}
        {view === "login" && (
          <form onSubmit={handleLogin} className="auth-modal-form">
            <div className="auth-input-group">
              <label htmlFor="auth-modal-email">Email Address</label>
              <input
                id="auth-modal-email"
                type="email"
                autoComplete="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="auth-input-group">
              <div className="auth-password-header">
                <label htmlFor="auth-modal-password">Password</label>
                <button
                  type="button"
                  className="auth-forgot-link"
                  onClick={() => openView("forgot")}
                >
                  Forgot password?
                </button>
              </div>

              <input
                id="auth-modal-password"
                type="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

            <div className="auth-divider">
              <span>OR CONTINUE WITH</span>
            </div>

            <button
              type="button"
              className="auth-google-btn"
              onClick={handleGoogleSignIn}
              disabled={loading}
            >
              <svg
                className="auth-google-icon"
                aria-hidden="true"
                viewBox="0 0 24 24"
                width="18"
                height="18"
              >
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.33 24 12 24Z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27a7.18 7.18 0 0 1 0-4.54V6.58H1.24a11.97 11.97 0 0 0 0 10.84l4.04-3.15Z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98Z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="auth-switch-view">
              Don&apos;t have an account?{" "}
              <button
                type="button"
                className="auth-accent-link"
                onClick={() => openView("signup")}
              >
                Create One
              </button>
            </div>
          </form>
        )}

        {/* ================= SIGNUP VIEW ================= */}
        {view === "signup" && (
          <form onSubmit={handleSignup} className="auth-modal-form">
            <div className="auth-input-group">
              <label htmlFor="auth-modal-signup-name">Full Name</label>
              <input
                id="auth-modal-signup-name"
                type="text"
                autoComplete="name"
                placeholder="Player / Guardian Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="auth-input-group">
              <label htmlFor="auth-modal-signup-email">Email Address</label>
              <input
                id="auth-modal-signup-email"
                type="email"
                autoComplete="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="auth-input-group">
              <label htmlFor="auth-modal-signup-password">Password</label>
              <input
                id="auth-modal-signup-password"
                type="password"
                autoComplete="new-password"
                placeholder="Create a password (min. 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>

            <div className="auth-divider">
              <span>OR CONTINUE WITH</span>
            </div>

            <button
              type="button"
              className="auth-google-btn"
              onClick={handleGoogleSignIn}
              disabled={loading}
            >
              <svg
                className="auth-google-icon"
                aria-hidden="true"
                viewBox="0 0 24 24"
                width="18"
                height="18"
              >
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.33 24 12 24Z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27a7.18 7.18 0 0 1 0-4.54V6.58H1.24a11.97 11.97 0 0 0 0 10.84l4.04-3.15Z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98Z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="auth-switch-view">
              Already have an account?{" "}
              <button
                type="button"
                className="auth-accent-link"
                onClick={() => openView("login")}
              >
                Sign In
              </button>
            </div>
          </form>
        )}

        {/* ================= FORGOT PASSWORD VIEW ================= */}
        {view === "forgot" && (
          <form onSubmit={handleForgotPassword} className="auth-modal-form">
            <div className="auth-input-group">
              <label htmlFor="auth-reset-email">Email Address</label>
              <input
                id="auth-reset-email"
                type="email"
                autoComplete="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setResetEmailSent(false);
                }}
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loading || resetEmailSent}
            >
              {loading
                ? "Sending Reset Link..."
                : resetEmailSent
                  ? "Reset Link Sent"
                  : "Send Password Reset Link"}
            </button>

            <div className="auth-switch-view">
              Remember your password?{" "}
              <button
                type="button"
                className="auth-accent-link"
                onClick={() => openView("login")}
              >
                Back to Sign In
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
