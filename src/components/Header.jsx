import { useState, useEffect } from "react";
import "./Header.css";

const ACADEMY_LOGO_SRC = "/logoo.png";

const NAV_LINKS = [
  {
    id: "home",
    label: "Home",
    icon: (
      <svg viewBox="0 0 24 24" className="mg-nav-svg" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-9 9 9M5 10v10a1 1 0 001 1h4a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h4a1 1 0 001-1V10" />
      </svg>
    ),
  },
  {
    id: "about",
    label: "About",
    icon: (
      <svg viewBox="0 0 24 24" className="mg-nav-svg" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    id: "coaches",
    label: "Coaches",
    icon: (
      <svg viewBox="0 0 24 24" className="mg-nav-svg" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    id: "booking",
    label: "Turf Booking",
    icon: (
      <svg viewBox="0 0 24 24" className="mg-nav-svg" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    id: "admission",
    label: "Admission",
    icon: (
      <svg viewBox="0 0 24 24" className="mg-nav-svg" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    id: "players",
    label: "Player Stats",
    icon: (
      <svg viewBox="0 0 24 24" className="mg-nav-svg" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    id: "contact",
    label: "Contact",
    icon: (
      <svg viewBox="0 0 24 24" className="mg-nav-svg" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
];

function Header({
  user,
  currentPage,
  onDashboard,
  onLogout,
  onHome,
  onSection,
  onOpenAuth,
}) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close menus on resize
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth > 1080) {
        setMobileMenuOpen(false);
      }
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "Member";

  function handleNav(sectionId) {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
    if (sectionId === "home") {
      onHome();
    } else {
      onSection(sectionId);
    }
  }

  return (
    <>
      <header className="mg-header">
      <div className="mg-header-container">
        {/* LOGO */}
        <div className="mg-logo-area">
          <button className="mg-logo-btn" onClick={() => handleNav("home")}>
            {ACADEMY_LOGO_SRC ? (
              <img
                src={ACADEMY_LOGO_SRC}
                alt="MG Cricketer's Den"
                className="mg-header-custom-logo"
              />
            ) : (
              <div className="mg-logo-fallback-badge">MG</div>
            )}
            <div className="mg-logo-text">
              <span className="mg-logo-title">MG CRICKETER'S DEN</span>
              <span className="mg-logo-sub">PUDUCHERRY</span>
            </div>
          </button>
        </div>

        {/* DESKTOP (LAPTOP) NAV */}
        <nav className="mg-desktop-nav" aria-label="Main Navigation">
          {NAV_LINKS.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                type="button"
                className={`mg-nav-link ${isActive ? "active" : ""}`}
                onClick={() => handleNav(item.id)}
              >
                <span>{item.label}</span>
                {isActive && <span className="mg-nav-active-bar" />}
              </button>
            );
          })}
        </nav>

        {/* RIGHT ACTIONS */}
        <div className="mg-header-actions">
          {/* Quick Book Turf CTA Button */}
          <button
            type="button"
            className="mg-cta-turf-btn"
            onClick={() => handleNav("booking")}
          >
            <svg viewBox="0 0 24 24" className="mg-cta-icon-svg" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>BOOK TURF</span>
          </button>

          {/* User Profile / Sign In */}
          {user ? (
            <div className="mg-user-dropdown-area">
              <button
                type="button"
                className={`mg-user-btn ${userMenuOpen ? "active-open" : ""}`}
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                aria-expanded={userMenuOpen}
              >
                <div className="mg-user-avatar-circle">
                  <svg viewBox="0 0 24 24" className="mg-user-svg-icon" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <span className="mg-user-name">{displayName}</span>
                <svg viewBox="0 0 24 24" className={`mg-chevron-svg ${userMenuOpen ? "rotate" : ""}`} fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {userMenuOpen && (
                <div className="mg-user-menu">
                  <div className="mg-user-menu-info">
                    <strong className="mg-user-menu-name">{displayName}</strong>
                    <small className="mg-user-menu-email">{user.email}</small>
                  </div>

                  <button
                    type="button"
                    className="mg-menu-item-btn"
                    onClick={() => {
                      setUserMenuOpen(false);
                      onDashboard();
                    }}
                  >
                    <svg viewBox="0 0 24 24" className="mg-menu-item-svg" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                    <span>My Dashboard</span>
                  </button>

                  <button
                    type="button"
                    className="mg-menu-item-btn"
                    onClick={() => handleNav("booking")}
                  >
                    <svg viewBox="0 0 24 24" className="mg-menu-item-svg" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Book a Turf</span>
                  </button>

                  <button
                    type="button"
                    className="mg-menu-item-btn"
                    onClick={() => handleNav("admission")}
                  >
                    <svg viewBox="0 0 24 24" className="mg-menu-item-svg" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>Academy Admission</span>
                  </button>

                  <div className="mg-menu-divider" />

                  <button
                    type="button"
                    className="mg-menu-item-btn mg-logout-btn"
                    onClick={() => {
                      setUserMenuOpen(false);
                      onLogout();
                    }}
                  >
                    <svg viewBox="0 0 24 24" className="mg-menu-item-svg" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              className="mg-login-trigger-btn"
              onClick={() => onOpenAuth("login", "access member features")}
            >
              Sign In
            </button>
          )}

          {/* HAMBURGER TOGGLE */}
          <button
            type="button"
            className={`mg-mobile-toggle ${mobileMenuOpen ? "open" : ""}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>

    {/* MOBILE LUXURY GLASS NAVIGATION DRAWER (OUTSIDE HEADER TO PREVENT CLIPPING) */}
    {mobileMenuOpen && (
      <div className="mg-mobile-drawer-overlay" onClick={() => setMobileMenuOpen(false)}>
        <div
          className="mg-mobile-menu-panel"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
        >
          {/* Mobile Navigation List with Automatic Highlight */}
          <div className="mg-mob-nav-list">
            {NAV_LINKS.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`mg-mob-link ${isActive ? "active" : ""}`}
                  onClick={() => handleNav(item.id)}
                >
                  <div className="mg-mob-link-left">
                    <span className="mg-mob-icon-wrap">{item.icon}</span>
                    <span className="mg-mob-label-text">{item.label}</span>
                  </div>

                  {isActive ? (
                    <span className="mg-mob-active-pill">CURRENT</span>
                  ) : (
                    <svg viewBox="0 0 24 24" className="mg-mob-arrow-svg" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>

          {/* Mobile Footer Actions */}
          <div className="mg-mob-footer">
            <button
              type="button"
              className="mg-mob-quick-turf-btn"
              onClick={() => handleNav("booking")}
            >
              <svg viewBox="0 0 24 24" className="mg-mob-btn-svg" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>BOOK A TURF SLOT</span>
            </button>

            {user ? (
              <div className="mg-mob-user-controls">
                <button
                  type="button"
                  className="mg-mob-dashboard-btn"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onDashboard();
                  }}
                >
                  <svg viewBox="0 0 24 24" className="mg-mob-btn-svg" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  <span>My Dashboard ({displayName})</span>
                </button>

                <button
                  type="button"
                  className="mg-mob-logout-btn"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onLogout();
                  }}
                >
                  <svg viewBox="0 0 24 24" className="mg-mob-btn-svg" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="mg-mob-auth-btn"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth("login", "access member features");
                }}
              >
                <svg viewBox="0 0 24 24" className="mg-mob-btn-svg" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                <span>Sign In / Register</span>
              </button>
            )}
          </div>
        </div>
      </div>
    )}
  </>
  );
}

export default Header;
