import { useState } from "react";
import { supabase } from "../lib/supabase";

function LoginPage({ onSignup, onLogin }) {
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