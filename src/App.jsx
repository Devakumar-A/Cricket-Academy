import { lazy, Suspense, useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import { updatePageSEO } from "./utils/seo";

// — Always-visible shell components: load eagerly —
import Header from "./components/Header";
import Footer from "./components/Footer";
import AuthModal from "./components/AuthModal";
import SplashScreen from "./components/SplashScreen";
import ErrorBoundary from "./components/ErrorBoundary";

// — Auth pages: small, but still lazy so they don't bloat the main bundle —
const LoginPage          = lazy(() => import("./pages/LoginPage"));
const SignupPage         = lazy(() => import("./pages/SignupPage"));
const ForgotPasswordPage = lazy(() => import("./pages/ForgotPasswordPage"));

// — Main content pages: lazy-loaded on demand —
const HomePage        = lazy(() => import("./pages/HomePage"));
const AboutPage       = lazy(() => import("./pages/AboutPage"));
const CoachesPage     = lazy(() => import("./pages/CoachesPage"));
const ContactPage     = lazy(() => import("./pages/ContactPage"));
const DashboardPage   = lazy(() => import("./pages/DashboardPage"));
const TurfBookingPage = lazy(() => import("./pages/TurfBookingPage"));
const AdmissionPage   = lazy(() => import("./pages/AdmissionPage"));
const PlayerStatsPage = lazy(() => import("./pages/PlayerStatsPage"));

// Minimal inline fallback — matches the dark site bg, no flash
function PageFallback() {
  return (
    <div style={{
      minHeight: "60vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#04070c",
      color: "#d4a017",
      fontSize: "15px",
      letterSpacing: "1px",
    }}>
      🏏 Loading...
    </div>
  );
}

function App() {
  // Show splash only once per browser session — skip on back navigation or refresh
  const [showSplash, setShowSplash] = useState(() => {
    if (sessionStorage.getItem("splashShown")) return false;
    return true;
  });
  const [authPage, setAuthPage] = useState(null); // null | "login" | "signup" | "forgot"
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState("home"); // "home" | "about" | "coaches" | "booking" | "admission" | "players" | "contact" | "dashboard"

  // 1. Synchronize initial URL on page load & listen for browser back/forward navigation
  useEffect(() => {
    const rawPath = window.location.pathname.toLowerCase().replace(/^\/+|\/+$/g, "");
    if (rawPath === "booking") setCurrentPage("booking");
    else if (rawPath === "admission") setCurrentPage("admission");
    else if (rawPath === "coaches") setCurrentPage("coaches");
    else if (rawPath === "about") setCurrentPage("about");
    else if (rawPath === "players") setCurrentPage("players");
    else if (rawPath === "contact") setCurrentPage("contact");
    else if (rawPath === "dashboard") setCurrentPage("dashboard");
    else if (rawPath === "login") setAuthPage("login");
    else if (rawPath === "signup") setAuthPage("signup");
    else if (rawPath === "forgot-password" || rawPath === "forgot") setAuthPage("forgot");

    const handlePopState = () => {
      const p = window.location.pathname.toLowerCase().replace(/^\/+|\/+$/g, "");
      if (p === "login" || p === "signup" || p === "forgot" || p === "forgot-password") {
        setAuthPage(p === "forgot-password" ? "forgot" : p);
      } else {
        setAuthPage(null);
        setCurrentPage(p || "home");
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // 2. Dynamically update canonical link, title, and meta tags per active view
  useEffect(() => {
    const activeKey = authPage || currentPage;
    updatePageSEO(activeKey);

    let targetPath = "/";
    if (authPage === "login") targetPath = "/login";
    else if (authPage === "signup") targetPath = "/signup";
    else if (authPage === "forgot") targetPath = "/forgot-password";
    else if (currentPage !== "home") targetPath = `/${currentPage}`;

    if (window.location.pathname !== targetPath) {
      window.history.pushState(null, "", targetPath);
    }
  }, [authPage, currentPage]);

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
      <Suspense fallback={<PageFallback />}>
        <SignupPage
          onLogin={handleLoginSuccess}
          onBack={() => setAuthPage("login")}
        />
      </Suspense>
    );
  }

  if (authPage === "forgot") {
    return (
      <Suspense fallback={<PageFallback />}>
        <ForgotPasswordPage
          onBack={() => setAuthPage("login")}
        />
      </Suspense>
    );
  }

  if (authPage === "login") {
    return (
      <Suspense fallback={<PageFallback />}>
        <LoginPage
          onSignup={() => setAuthPage("signup")}
          onForgotPassword={() => setAuthPage("forgot")}
          onLogin={handleLoginSuccess}
        />
      </Suspense>
    );
  }

  // -------------------------
  // PUBLIC & LOGGED-IN EXPERIENCE
  // -------------------------
  return (
    <div className="app-root-layout">
      {/* 3D ANIMATED HIGH-END SPLASH SCREEN */}
      {showSplash && (
        <SplashScreen onFinish={() => {
          sessionStorage.setItem("splashShown", "1");
          setShowSplash(false);
        }} />
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

      {/* PAGE ROUTING — ErrorBoundary catches uncaught errors; Suspense handles lazy loading */}
      <ErrorBoundary>
        <Suspense fallback={<PageFallback />}>
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
        </Suspense>
      </ErrorBoundary>

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
