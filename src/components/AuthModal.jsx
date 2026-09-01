import { useState } from "react";
import { supabase } from "../lib/supabase";
import "./AuthModal.css";

export default function AuthModal({ isOpen, onClose, onSuccess, initialView = "login", targetAction = "book or apply" }) {
  const [view, setView] = useState(initialView); // "login", "signup", "forgot"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "error" | "success"
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  async function handleLogin(e) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setMessage(error.message);
      setMessageType("error");
      return;
    }

    onSuccess(data.user);
  }

  async function handleSignup(e) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name,
        },
      },
    });

    setLoading(false);

    if (error) {
      setMessage(error.message);
      setMessageType("error");
      return;
    }

    if (data.session && data.user) {
      onSuccess(data.user);
    } else {
      setMessage("Account created! Please check your email to verify or sign in now.");
      setMessageType("success");
      setView("login");
    }
  }

  function handleForgot(e) {
    e.preventDefault();
    setMessage("Password reset link has been requested. Please contact academy staff if you need immediate assistance.");
    setMessageType("success");
  }

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="auth-modal-close" onClick={onClose} aria-label="Close">
          ✕
        </button>

        <div className="auth-modal-header">
          <div className="auth-modal-badge">MG CRICKETER'S DEN</div>
          <h2>
            {view === "login" && "Member Sign In"}
            {view === "signup" && "Create Player Account"}
            {view === "forgot" && "Reset Password"}
          </h2>
          <p>
            {view === "login" && `Please sign in to ${targetAction}.`}
            {view === "signup" && `Register to ${targetAction} and access player features.`}
            {view === "forgot" && "Enter your registered email to continue."}
          </p>
        </div>

        {message && (
          <div className={`auth-modal-msg ${messageType}`}>
            {message}
          </div>
        )}

        {view === "login" && (
          <form onSubmit={handleLogin} className="auth-modal-form">
            <div className="auth-input-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="auth-input-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="auth-modal-row">
              <button
                type="button"
                className="auth-link-btn"
                onClick={() => { setView("forgot"); setMessage(""); }}
              >
                Forgot Password?
              </button>
            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? "Signing in..." : "Sign In to Continue →"}
            </button>

            <div className="auth-switch-view">
              Don't have an account?{" "}
              <button
                type="button"
                className="auth-accent-link"
                onClick={() => { setView("signup"); setMessage(""); }}
              >
                Create One
              </button>
            </div>
          </form>
        )}

        {view === "signup" && (
          <form onSubmit={handleSignup} className="auth-modal-form">
            <div className="auth-input-group">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="Player / Parent Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="auth-input-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="auth-input-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                required
              />
            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? "Creating Account..." : "Create Account & Continue →"}
            </button>

            <div className="auth-switch-view">
              Already have an account?{" "}
              <button
                type="button"
                className="auth-accent-link"
                onClick={() => { setView("login"); setMessage(""); }}
              >
                Sign In
              </button>
            </div>
          </form>
        )}

        {view === "forgot" && (
          <form onSubmit={handleForgot} className="auth-modal-form">
            <div className="auth-input-group">
              <label>Registered Email</label>
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="auth-submit-btn">
              Send Reset Request
            </button>

            <div className="auth-switch-view">
              <button
                type="button"
                className="auth-accent-link"
                onClick={() => { setView("login"); setMessage(""); }}
              >
                ← Back to Sign In
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
