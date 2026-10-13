import { useState } from "react";
import { supabase } from "../lib/supabase";

function LoginPage({ onSignup, onLogin, onForgotPassword }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

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
      return;
    }

    onLogin(data.user);
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Member Login | MG Cricketer&apos;s Den</h1>
        <h2>Sign In to Your Account</h2>
        <p>Access your training portal &amp; turf reservations</p>

        <form onSubmit={handleLogin}>
          <div className="auth-input-group">
            <label htmlFor="login-email">Email Address</label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="auth-input-group">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <label htmlFor="login-password">Password</label>
              {onForgotPassword && (
                <button
                  type="button"
                  className="link-button"
                  onClick={onForgotPassword}
                  style={{ fontSize: "0.85rem", color: "#fde047", padding: 0 }}
                >
                  Forgot Password?
                </button>
              )}
            </div>
            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {message && <p className="auth-message">{message}</p>}

        <p>
          Don't have an account?{" "}
          <button className="link-button" onClick={onSignup}>
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;