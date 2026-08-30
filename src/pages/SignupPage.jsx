import { useState } from "react";
import { supabase } from "../lib/supabase";

function SignupPage({ onLogin, onBack }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

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
      return;
    }

    if (data.session) {
      onLogin(data.user);
    } else {
      setMessage(
        "Account created. Please check your email to verify your account."
      );
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>🏏 Cricket Academy</h1>
        <h2>Create Account</h2>
        <p>Register to access the academy services.</p>

        <form onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

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
            minLength={6}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        {message && <p className="auth-message">{message}</p>}

        <p>
          Already have an account?{" "}
          <button className="link-button" onClick={onBack}>
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
}

export default SignupPage;