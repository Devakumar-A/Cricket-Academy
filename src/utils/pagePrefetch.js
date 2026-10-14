/**
 * Page Prefetching Utility
 * 
 * Preloads secondary route chunks during browser idle time or link hover
 * so that navigation between pages is instantaneous with 0ms loading delay.
 */

export const pageImports = {
  about: () => import("../pages/AboutPage"),
  coaches: () => import("../pages/CoachesPage"),
  contact: () => import("../pages/ContactPage"),
  booking: () => import("../pages/TurfBookingPage"),
  admission: () => import("../pages/AdmissionPage"),
  players: () => import("../pages/PlayerStatsPage"),
  dashboard: () => import("../pages/DashboardPage"),
  privacy: () => import("../pages/PrivacyPolicyPage"),
  terms: () => import("../pages/TermsPage"),
  login: () => import("../pages/LoginPage"),
  signup: () => import("../pages/SignupPage"),
  forgot: () => import("../pages/ForgotPasswordPage"),
};

const prefetched = new Set();

/**
 * Prefetches a specific page chunk on hover / touchstart
 */
export function prefetchPage(pageKey) {
  if (!pageKey || prefetched.has(pageKey)) return;
  const importer = pageImports[pageKey];
  if (importer) {
    prefetched.add(pageKey);
    importer().catch(() => {
      prefetched.delete(pageKey);
    });
  }
}

/**
 * Prefetches all secondary pages during idle time so page switching never waits on network
 */
export function prefetchAllPages() {
  const keys = Object.keys(pageImports);
  keys.forEach((key, index) => {
    // Stagger slightly so background requests don't contend with each other
    setTimeout(() => {
      prefetchPage(key);
    }, index * 80);
  });
}
