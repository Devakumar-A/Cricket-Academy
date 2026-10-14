import { useState } from "react";
import { supabase } from "../lib/supabase";
import "./LoginPage.css";

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
        <h1>Register Account | MG Cricket Academy</h1>
        <h2>Create Player Account</h2>
        <p>Register to book turf slots and join academy programs.</p>

        <form onSubmit={handleSignup}>
          <div className="auth-input-group">
            <label htmlFor="signup-name">Full Name</label>
            <input
              id="signup-name"
              type="text"
              autoComplete="name"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="auth-input-group">
            <label htmlFor="signup-email">Email Address</label>
            <input
              id="signup-email"
              type="email"
              autoComplete="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="auth-input-group">
            <label htmlFor="signup-password">Password</label>
            <input
              id="signup-password"
              type="password"
              autoComplete="new-password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
            />
          </div>

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