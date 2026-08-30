import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";

import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import TurfBookingPage from "./pages/TurfBookingPage";
import AdmissionPage from "./pages/AdmissionPage";
import PlayerStatsPage from "./pages/PlayerStatsPage";

function App() {
  const [page, setPage] = useState("login");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState("home");

  useEffect(() => {
    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function checkSession() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    setUser(session?.user ?? null);
    setLoading(false);
  }

  function handleLogin(loggedInUser) {
    setUser(loggedInUser);
    setCurrentPage("home");
  }

  function handleSection(section) {
    setCurrentPage(section);
  }

  function handleHome() {
    setCurrentPage("home");
  }

  function handleDashboard() {
    setCurrentPage("dashboard");
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setUser(null);
    setCurrentPage("home");
    setPage("login");
  }

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  // -------------------------
  // LOGGED-IN WEBSITE
  // -------------------------

  if (user) {
    return (
      <div>
        <Header
          user={user}
          onDashboard={handleDashboard}
          onLogout={handleLogout}
          onHome={handleHome}
          onSection={handleSection}
        />

        {currentPage === "home" && (
          <HomePage onSection={handleSection} />
        )}

        {currentPage === "dashboard" && (
          <DashboardPage
            user={user}
            onBack={handleHome}
          />
        )}

        {currentPage === "booking" && (
           <TurfBookingPage
            user={user}
            onBack={handleHome}
          />
         )}

        {currentPage === "admission" && (
          <AdmissionPage
            user={user}
            onBack={handleHome}
          />
        )}

        {currentPage === "players" && (
          <PlayerStatsPage onBack={handleHome} />
        )}
      </div>
    );
  }

  // -------------------------
  // AUTHENTICATION PAGES
  // -------------------------

  if (page === "signup") {
    return (
      <SignupPage
        onLogin={handleLogin}
        onBack={() => setPage("login")}
      />
    );
  }

  if (page === "forgot") {
    return (
      <ForgotPasswordPage
        onBack={() => setPage("login")}
      />
    );
  }

  return (
    <LoginPage
      onSignup={() => setPage("signup")}
      onForgotPassword={() => setPage("forgot")}
      onLogin={handleLogin}
    />
  );
}

export default App;