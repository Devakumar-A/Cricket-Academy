import { useState } from "react";

function ForgotPasswordPage({ onBack }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    setMessage(
      "Password reset will be available soon."
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>🏏 Cricket Academy</h1>

        <h2>Forgot Password?</h2>

        <p>
          Enter your registered email address.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button type="submit">
            Continue
          </button>
        </form>

        {message && (
          <p className="auth-message">
            {message}
          </p>
        )}

        <button
          className="link-button"
          onClick={onBack}
        >
          ← Back to Sign In
        </button>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;