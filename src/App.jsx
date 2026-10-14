import { lazy, Suspense, useEffect, useState, startTransition } from "react";
import { Lock } from "lucide-react";
import { supabase } from "./lib/supabase";
import { updatePageSEO } from "./utils/seo";
import { prefetchAllPages } from "./utils/pagePrefetch";

// — Always-visible shell components: load eagerly —
import Header from "./components/Header";
import Footer from "./components/Footer";
import AuthModal from "./components/AuthModal";
import ErrorBoundary from "./components/ErrorBoundary";
import HomePage from "./pages/HomePage";

// Lazy-load cinematic splash screen and its heavy GSAP dependencies
const SplashScreen = lazy(() => import("./components/SplashScreen"));

// — Auth pages: small, but still lazy so they don't bloat the main bundle —
const LoginPage = lazy(() => import("./pages/LoginPage"));
const SignupPage = lazy(() => import("./pages/SignupPage"));
const ResetPasswordPage = lazy(() => import("./pages/ResetPasswordPage"));
const ForgotPasswordPage = lazy(() => import("./pages/ForgotPasswordPage"));

// — Secondary content pages: lazy-loaded on demand —
const AboutPage = lazy(() => import("./pages/AboutPage"));
const CoachesPage = lazy(() => import("./pages/CoachesPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const TurfBookingPage = lazy(() => import("./pages/TurfBookingPage"));
const AdmissionPage = lazy(() => import("./pages/AdmissionPage"));
const PlayerStatsPage = lazy(() => import("./pages/PlayerStatsPage"));
const PrivacyPolicyPage = lazy(() => import("./pages/PrivacyPolicyPage"));
const TermsPage = lazy(() => import("./pages/TermsPage"));

// Minimal inline fallback — matches the dark site bg, no flash
function PageFallback() {
  return <div style={{ minHeight: "60vh", background: "#04070c" }} />;
}

function App() {
  // Show cinematic brand intro splash once per session
  const [showSplash, setShowSplash] = useState(() => {
    try {
      if (typeof window !== "undefined") {
        return !sessionStorage.getItem("mg_splash_seen");
      }
    } catch {
      // ignore
    }
    return true;
  });

  const handleSplashFinish = () => {
    try {
      sessionStorage.setItem("mg_splash_seen", "1");
    } catch {
      // ignore
    }
    setShowSplash(false);
  };
  const [authPage, setAuthPage] = useState(null); // null | "login" | "signup"
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState("home"); // "home" | "about" | "coaches" | "booking" | "admission" | "players" | "contact" | "dashboard"

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalView, setAuthModalView] = useState("login");
  const [authModalTargetAction, setAuthModalTargetAction] = useState("access player features");
  const [pendingSectionAfterLogin, setPendingSectionAfterLogin] = useState(null);
  const [selectedAdmissionPlan, setSelectedAdmissionPlan] = useState(null);

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
    else if (rawPath === "privacy" || rawPath === "privacy-policy") setCurrentPage("privacy");
    else if (rawPath === "terms" || rawPath === "terms-of-service") setCurrentPage("terms");
    else if (rawPath === "login") setAuthPage("login");
    else if (rawPath === "forgot-password" || rawPath === "forgot") setAuthPage("forgot");
    else if (rawPath === "signup") setAuthPage("signup");

    const handlePopState = () => {
      const p = window.location.pathname.toLowerCase().replace(/^\/+|\/+$/g, "");
      if (p === "login") {
        setAuthPage("login");
      } else if (p === "forgot" || p === "forgot-password") {
        setAuthPage("forgot");
      } else if (p === "signup") {
        setAuthPage("signup");
      } else {
        setAuthPage(null);
        startTransition(() => {
          if (p === "privacy" || p === "privacy-policy") {
            setCurrentPage("privacy");
          } else if (p === "terms" || p === "terms-of-service") {
            setCurrentPage("terms");
          } else if (p === "dashboard" && !user) {
            setCurrentPage("home");
            setAuthModalTargetAction("access your player dashboard");
            setPendingSectionAfterLogin("dashboard");
            setAuthModalOpen(true);
          } else {
            setCurrentPage(p || "home");
          }
        });
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [user]);

  // 2. Dynamically update canonical link, title, and meta tags per active view
  useEffect(() => {
    if (
      window.location.pathname.toLowerCase().replace(/\/+$/, "") ===
      "/reset-password"
    ) {
      return;
    }

    const activeKey = authPage || currentPage;
    updatePageSEO(activeKey);

    let targetPath = "/";
    if (authPage === "login") targetPath = "/login";
    else if (authPage === "forgot") targetPath = "/forgot-password";
    else if (authPage === "signup") targetPath = "/signup";
    else if (currentPage !== "home") targetPath = `/${currentPage}`;

    if (window.location.pathname !== targetPath) {
      window.history.pushState(null, "", targetPath);
    }
  }, [authPage, currentPage]);

  async function checkSession() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const currentUser = session?.user ?? null;
    setUser(currentUser);

    // If user navigated directly or refreshed on /dashboard while unauthenticated:
    const rawPath = window.location.pathname.toLowerCase().replace(/^\/+|\/+$/g, "");
    if (!currentUser && rawPath === "dashboard") {
      setCurrentPage("home");
      setAuthModalTargetAction("access your player dashboard");
      setPendingSectionAfterLogin("dashboard");
      setAuthModalOpen(true);
    }
  }

  useEffect(() => {
    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const updatedUser = session?.user ?? null;
      setUser(updatedUser);
      if (!updatedUser && window.location.pathname.toLowerCase().replace(/^\/+|\/+$/g, "") === "dashboard") {
        setCurrentPage("home");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Idle prefetch all secondary pages so switching between pages is instantaneous with 0ms load delay
  useEffect(() => {
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(() => prefetchAllPages(), { timeout: 1500 });
    } else {
      setTimeout(() => prefetchAllPages(), 800);
    }
  }, []);

  function handleLoginSuccess(loggedInUser) {
    setUser(loggedInUser);
    setAuthModalOpen(false);
    const wasAuthPage = authPage;
    setAuthPage(null);

    // If user attempted to navigate to a protected page before logging in, proceed there
    if (pendingSectionAfterLogin) {
      startTransition(() => {
        setCurrentPage(pendingSectionAfterLogin);
      });
      setPendingSectionAfterLogin(null);
    } else if (wasAuthPage === "login" || wasAuthPage === "signup") {
      startTransition(() => {
        setCurrentPage("dashboard");
      });
    }
  }

  function handleSection(section, planData) {
    if (section === "admission") {
      setSelectedAdmissionPlan(planData || null);
    }

    // Dashboard requires authentication
    if (!user && section === "dashboard") {
      setAuthModalTargetAction("access your player dashboard");
      setPendingSectionAfterLogin("dashboard");
      setAuthModalOpen(true);
      return;
    }

    startTransition(() => {
      setCurrentPage(section);
    });
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }

  function handleHome() {
    startTransition(() => {
      setCurrentPage("home");
    });
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }

  function handleDashboard() {
    if (!user) {
      setAuthModalTargetAction("view your personal dashboard");
      setPendingSectionAfterLogin("dashboard");
      setAuthModalOpen(true);
      return;
    }
    startTransition(() => {
      setCurrentPage("dashboard");
    });
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setUser(null);
    startTransition(() => {
      setCurrentPage("home");
    });
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }

  function handleOpenAuth(view = "login", targetAction = "access player features") {
    setAuthModalView(view);
    setAuthModalTargetAction(targetAction);
    setAuthModalOpen(true);
  }

  // -------------------------
  // FULL PAGE AUTH OVERRIDES (if explicitly opened full screen)
  // -------------------------
  // Reset password page
  if (
    window.location.pathname.toLowerCase().replace(/\/+$/, "") ===
    "/reset-password"
  ) {
    return (
      <Suspense fallback={<PageFallback />}>
        <ResetPasswordPage />
      </Suspense>
    );
  }

  // Forgot password page
  if (authPage === "forgot") {
    return (
      <Suspense fallback={<PageFallback />}>
        <ForgotPasswordPage
          onBack={() => setAuthPage("login")}
          onLogin={() => setAuthPage("login")}
        />
      </Suspense>
    );
  }

  // Signup page
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

  if (authPage === "login") {
    return (
      <Suspense fallback={<PageFallback />}>
        <LoginPage
          onSignup={() => setAuthPage("signup")}
          onLogin={handleLoginSuccess}
          onForgotPassword={() => setAuthPage("forgot")}
        />
      </Suspense>
    );
  }

  // -------------------------
  // PUBLIC & LOGGED-IN EXPERIENCE
  // -------------------------
  return (
    <div className="app-root-layout">
      {/* CINEMATIC BRAND INTRO SPLASH SCREEN */}
      {showSplash && (
        <Suspense fallback={null}>
          <SplashScreen onFinish={handleSplashFinish} />
        </Suspense>
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
          <div key={currentPage} className="mg-page-view-container">
            {currentPage === "home" && (
              <HomePage onSection={handleSection} splashActive={showSplash} />
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
                selectedPlan={selectedAdmissionPlan}
              />
            )}

            {currentPage === "players" && (
              <PlayerStatsPage onBack={handleHome} />
            )}

            {currentPage === "privacy" && (
              <PrivacyPolicyPage onHome={handleHome} />
            )}

            {currentPage === "terms" && (
              <TermsPage onHome={handleHome} />
            )}

            {currentPage === "dashboard" && (
              user ? (
                <DashboardPage
                  user={user}
                  onBack={handleHome}
                  onNavigate={handleSection}
                />
              ) : (
                <div style={{
                  minHeight: "60vh",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#04070c",
                  color: "#e5e7eb",
                  padding: "40px 20px",
                  textAlign: "center",
                  gap: "16px"
                }}>
                  <div style={{
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    background: "rgba(212, 175, 55, 0.1)",
                    border: "1px solid rgba(212, 175, 55, 0.25)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#d4af37",
                    margin: "0 auto"
                  }}>
                    <Lock size={24} />
                  </div>
                  <h2 style={{ color: "#d4a017", margin: 0, fontFamily: "Outfit, sans-serif" }}>
                    Sign In Required
                  </h2>
                  <p style={{ color: "#9ca3af", maxWidth: "420px", margin: 0, fontSize: "15px" }}>
                    You need to sign in to access your player dashboard, bookings, and admission details.
                  </p>
                  <button
                    type="button"
                    onClick={() => handleOpenAuth("login", "access your player dashboard")}
                    style={{
                      background: "linear-gradient(135deg, #fde047 0%, #d4a017 100%)",
                      color: "#0c0f17",
                      border: "none",
                      borderRadius: "8px",
                      padding: "10px 24px",
                      fontWeight: "800",
                      cursor: "pointer",
                      fontSize: "14px",
                      marginTop: "8px"
                    }}
                  >
                    Sign In to Dashboard →
                  </button>
                </div>
              )
            )}
          </div>
        </Suspense>
      </ErrorBoundary>

      {/* GLOBAL FOOTER */}
      <Footer
        onSection={handleSection}
        onHome={handleHome}
      />

      {/* AUTH POPUP MODAL (Triggers when guest accesses protected dashboard) */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleLoginSuccess}
        initialView={authModalView}
        targetAction={authModalTargetAction}
      />
    </div>
  );
}

export default App;
