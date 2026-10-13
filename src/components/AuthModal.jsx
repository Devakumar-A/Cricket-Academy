
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

  // Existing email login
  async function handleLogin(e) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setMessage(error.message);
        setMessageType("error");
        return;
      }

      onSuccess(data.user);
    } catch {
      setMessage("Unable to sign in. Please try again.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }

  // Existing email signup
  async function handleSignup(e) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
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
        <button
          className="auth-modal-close"
          onClick={onClose}
          aria-label="Close dialog"
          type="button"
        >
          ✕
        </button>

        <div className="auth-modal-header">
          <div className="auth-modal-badge">MG CRICKETER'S DEN</div>

          <h2 id="auth-modal-title">
            {view === "login" && "Member Sign In"}
            {view === "signup" && "Create Player Account"}
            {view === "forgot" && "Forgot Password?"}
          </h2>

          <p>
            {view === "login" &&
              `Please sign in to ${targetAction}.`}
            {view === "signup" &&
              `Register to ${targetAction} and access player features.`}
            {view === "forgot" &&
              "Enter your email to receive a secure password reset link."}
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

        {/* LOGIN */}
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
              />
            </div>

            <div className="auth-input-group">
              <div className="auth-password-heading">
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
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In to Continue →"}
            </button>

            <div className="auth-divider">
              <span>OR</span>
            </div>

            <button
              type="button"
              className="auth-google-btn"
              onClick={handleGoogleSignIn}
              disabled={loading}
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 48 48"
                width="20"
                height="20"
              >
                <path
                  fill="#4285F4"
                  d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11a9.4 9.4 0 0 1-4.1 6.2v5h6.6c3.9-3.6 6.1-8.8 6.1-14.9Z"
                />
                <path
                  fill="#34A853"
                  d="M24 44c5.5 0 10.1-1.8 13.5-4.7l-6.6-5c-1.8 1.2-4.1 2-6.9 2-5.3 0-9.8-3.6-11.4-8.4H5.8v5.2A20 20 0 0 0 24 44Z"
                />
                <path
                  fill="#FBBC05"
                  d="M12.6 27.9a12 12 0 0 1 0-7.8v-5.2H5.8a20 20 0 0 0 0 18.2l6.8-5.2Z"
                />
                <path
                  fill="#EA4335"
                  d="M24 11.7c3 0 5.7 1 7.8 3.1l5.8-5.8A19.5 19.5 0 0 0 24 4 20 20 0 0 0 5.8 14.9l6.8 5.2c1.6-4.8 6.1-8.4 11.4-8.4Z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="auth-switch-view">
              Don't have an account?{" "}
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

        {/* SIGNUP */}
        {view === "signup" && (
          <form onSubmit={handleSignup} className="auth-modal-form">
            <div className="auth-input-group">
              <label htmlFor="auth-modal-signup-name">Full Name</label>
              <input
                id="auth-modal-signup-name"
                type="text"
                autoComplete="name"
                placeholder="Player / Parent Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="auth-input-group">
              <label htmlFor="auth-modal-signup-email">
                Email Address
              </label>
              <input
                id="auth-modal-signup-email"
                type="email"
                autoComplete="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="auth-input-group">
              <label htmlFor="auth-modal-signup-password">Password</label>
              <input
                id="auth-modal-signup-password"
                type="password"
                autoComplete="new-password"
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                required
              />
            </div>

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loading}
            >
              {loading
                ? "Creating Account..."
                : "Create Account & Continue →"}
            </button>

            <div className="auth-divider">
              <span>OR</span>
            </div>

            <button
              type="button"
              className="auth-google-btn"
              onClick={handleGoogleSignIn}
              disabled={loading}
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 48 48"
                width="20"
                height="20"
              >
                <path
                  fill="#4285F4"
                  d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11a9.4 9.4 0 0 1-4.1 6.2v5h6.6c3.9-3.6 6.1-8.8 6.1-14.9Z"
                />
                <path
                  fill="#34A853"
                  d="M24 44c5.5 0 10.1-1.8 13.5-4.7l-6.6-5c-1.8 1.2-4.1 2-6.9 2-5.3 0-9.8-3.6-11.4-8.4H5.8v5.2A20 20 0 0 0 24 44Z"
                />
                <path
                  fill="#FBBC05"
                  d="M12.6 27.9a12 12 0 0 1 0-7.8v-5.2H5.8a20 20 0 0 0 0 18.2l6.8-5.2Z"
                />
                <path
                  fill="#EA4335"
                  d="M24 11.7c3 0 5.7 1 7.8 3.1l5.8-5.8A19.5 19.5 0 0 0 24 4 20 20 0 0 0 5.8 14.9l6.8 5.2c1.6-4.8 6.1-8.4 11.4-8.4Z"
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

        {/* FORGOT PASSWORD */}
        {view === "forgot" && (
          <form
            onSubmit={handleForgotPassword}
            className="auth-modal-form"
          >
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
              />
            </div>

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loading || resetEmailSent}
            >
              {loading
                ? "Sending reset link..."
                : resetEmailSent
                  ? "Reset Link Requested"
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
