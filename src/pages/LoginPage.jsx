import { useState } from "react";
import { supabase } from "../lib/supabase";

function LoginPage({ onSignup, onForgotPassword, onLogin }) {
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
        <h1>🏏 Cricket Academy</h1>
        <h2>Welcome Back</h2>
        <p>Sign in to continue</p>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {message && <p className="auth-message">{message}</p>}

        <button className="link-button" onClick={onForgotPassword}>
          Forgot Password?
        </button>

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