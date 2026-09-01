import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";

import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import CoachesPage from "./pages/CoachesPage";
import ContactPage from "./pages/ContactPage";
import DashboardPage from "./pages/DashboardPage";
import TurfBookingPage from "./pages/TurfBookingPage";
import AdmissionPage from "./pages/AdmissionPage";
import PlayerStatsPage from "./pages/PlayerStatsPage";
import AuthModal from "./components/AuthModal";
import SplashScreen from "./components/SplashScreen";

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [authPage, setAuthPage] = useState(null); // null | "login" | "signup" | "forgot"
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState("home"); // "home" | "about" | "coaches" | "booking" | "admission" | "players" | "contact" | "dashboard"

  // Auth modal state for gated actions (booking/admission/dashboard for guests)
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTargetAction, setAuthModalTargetAction] = useState("book a turf slot");
  const [pendingSectionAfterLogin, setPendingSectionAfterLogin] = useState(null);

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

  function handleLoginSuccess(loggedInUser) {
    setUser(loggedInUser);
    setAuthModalOpen(false);
    setAuthPage(null);

    // If user attempted to navigate to a protected page before logging in, proceed there
    if (pendingSectionAfterLogin) {
      setCurrentPage(pendingSectionAfterLogin);
      setPendingSectionAfterLogin(null);
    }
  }

  function handleSection(section) {
    // Check if section requires authentication
    if (!user && (section === "booking" || section === "admission" || section === "dashboard")) {
      const actionName =
        section === "booking"
          ? "book a turf or practice nets slot"
          : section === "admission"
          ? "submit an academy admission application"
          : "access your player dashboard";

      setAuthModalTargetAction(actionName);
      setPendingSectionAfterLogin(section);
      setAuthModalOpen(true);
      return;
    }

    setCurrentPage(section);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleHome() {
    setCurrentPage("home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleDashboard() {
    if (!user) {
      setAuthModalTargetAction("view your personal dashboard");
      setPendingSectionAfterLogin("dashboard");
      setAuthModalOpen(true);
      return;
    }
    setCurrentPage("dashboard");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setUser(null);
    setCurrentPage("home");
  }

  function handleOpenAuth(view = "login", targetAction = "access player features") {
    setAuthModalTargetAction(targetAction);
    setAuthModalOpen(true);
  }

  if (loading) {
    return (
      <div className="loading-screen" style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#090d14",
        color: "#d4a017",
        fontFamily: "sans-serif",
        fontSize: "18px",
        fontWeight: "bold",
        letterSpacing: "1px"
      }}>
        🏏 Loading MG CRICKETER'S DEN...
      </div>
    );
  }

  // -------------------------
  // FULL PAGE AUTH OVERRIDES (if explicitly opened full screen)
  // -------------------------
  if (authPage === "signup") {
    return (
      <SignupPage
        onLogin={handleLoginSuccess}
        onBack={() => setAuthPage("login")}
      />
    );
  }

  if (authPage === "forgot") {
    return (
      <ForgotPasswordPage
        onBack={() => setAuthPage("login")}
      />
    );
  }

  if (authPage === "login") {
    return (
      <LoginPage
        onSignup={() => setAuthPage("signup")}
        onForgotPassword={() => setAuthPage("forgot")}
        onLogin={handleLoginSuccess}
      />
    );
  }

  // -------------------------
  // PUBLIC & LOGGED-IN EXPERIENCE
  // -------------------------
  return (
    <div className="app-root-layout">
      {/* 3D ANIMATED HIGH-END SPLASH SCREEN */}
      {showSplash && (
        <SplashScreen onFinish={() => setShowSplash(false)} />
      )}

      {/* GLOBAL HEADER */}
      <Header
        user={user}
        currentPage={currentPage}
        onDashboard={handleDashboard}
        onLogout={handleLogout}
        onHome={handleHome}
        onSection={handleSection}
        onOpenAuth={handleOpenAuth}
      />

      {/* PAGE ROUTING */}
      {currentPage === "home" && (
        <HomePage onSection={handleSection} />
      )}

      {currentPage === "about" && (
        <AboutPage
          onBack={handleHome}
          onSection={handleSection}
        />
      )}

      {currentPage === "coaches" && (
        <CoachesPage
          onBack={handleHome}
          onSection={handleSection}
        />
      )}

      {currentPage === "contact" && (
        <ContactPage
          onBack={handleHome}
          onSection={handleSection}
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

      {currentPage === "dashboard" && user && (
        <DashboardPage
          user={user}
          onBack={handleHome}
          onNavigate={handleSection}
        />
      )}

      {/* GLOBAL FOOTER */}
      <Footer
        onSection={handleSection}
        onHome={handleHome}
      />

      {/* AUTH POPUP MODAL (Triggers when guest clicks booking/admission) */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleLoginSuccess}
        targetAction={authModalTargetAction}
      />
    </div>
  );
}

export default App;
