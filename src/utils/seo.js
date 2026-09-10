// Centralized SEO configuration & Dynamic Metadata Updater

export const SEO_METADATA = {
  home: {
    title: "Best Cricket Academy in Pondicherry | MG Den",
    description: "Join the best cricket academy in Pondicherry! Floodlit astro turf nets at Thengaithittu & match ground at Royapudupakkam. Enroll today!",
    canonical: "https://mgcricketersden.com/",
  },
  booking: {
    title: "Turf Booking Thengaithittu | Cricket Nets Pondicherry",
    description: "Book 24/7 floodlit astro and natural turf cricket practice nets in Thengaithittu, Pondicherry. Instant online slot confirmation. Book now!",
    canonical: "https://mgcricketersden.com/booking",
  },
  admission: {
    title: "Cricket Academy Admission in Pondicherry | Join MG Den",
    description: "Admissions open for weekday & weekend coaching batches in Pondicherry. Pro training for juniors & seniors. Apply for admission today!",
    canonical: "https://mgcricketersden.com/admission",
  },
  coaches: {
    title: "Expert Cricket Coaches in Pondicherry | MG Den",
    description: "Train with top domestic cricket coaches in Pondicherry. Specialized batting, fast bowling & spin drills. Meet our coaching faculty today!",
    canonical: "https://mgcricketersden.com/coaches",
  },
  about: {
    title: "About MG Cricketers Den | Premier Academy Pondicherry",
    description: "Discover Pondicherry's leading cricket training destination. Dual pro venues at Thengaithittu & Royapudupakkam. Learn more about our vision!",
    canonical: "https://mgcricketersden.com/about",
  },
  players: {
    title: "Player Stats & Match Performance | MG Pondicherry",
    description: "Track live batting, bowling & match performance stats of academy players across Pondicherry tournament leagues. Explore player rankings now!",
    canonical: "https://mgcricketersden.com/players",
  },
  contact: {
    title: "Contact Cricket Academy Pondicherry | Thengaithittu",
    description: "Contact MG Cricketer's Den for admissions & turf booking in Thengaithittu & Royapudupakkam, Pondicherry. Call or WhatsApp us today!",
    canonical: "https://mgcricketersden.com/contact",
  },
  dashboard: {
    title: "Player Dashboard | MG Cricketers Den Pondicherry",
    description: "Access your personalized player dashboard, track turf reservations, and view coaching schedules at MG Cricketer's Den.",
    canonical: "https://mgcricketersden.com/dashboard",
  },
  login: {
    title: "Member Login | MG Cricketers Den Pondicherry",
    description: "Login to your MG Cricketer's Den portal to manage turf bookings, training schedules, and performance progress in Pondicherry. Sign in now!",
    canonical: "https://mgcricketersden.com/login",
  },
  signup: {
    title: "Register Account | MG Cricket Academy Pondicherry",
    description: "Create your athlete profile at MG Cricketer's Den Pondicherry for seamless slot reservations and academy updates. Register your account today!",
    canonical: "https://mgcricketersden.com/signup",
  },
  forgot: {
    title: "Reset Password | MG Cricketers Den Pondicherry",
    description: "Reset your password to regain access to your MG Cricketer's Den account, turf bookings, and player dashboard in Pondicherry. Reset now!",
    canonical: "https://mgcricketersden.com/forgot-password",
  },
};

export function updatePageSEO(pageKey) {
  const meta = SEO_METADATA[pageKey] || SEO_METADATA.home;

  // 1. Update Document Title
  if (meta.title) {
    document.title = meta.title;
  }

  // 2. Update Meta Description
  if (meta.description) {
    let descEl = document.querySelector('meta[name="description"]');
    if (!descEl) {
      descEl = document.createElement("meta");
      descEl.setAttribute("name", "description");
      document.head.appendChild(descEl);
    }
    descEl.setAttribute("content", meta.description);

    // OpenGraph & Twitter Descriptions
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute("content", meta.description);
    const twDesc = document.querySelector('meta[name="twitter:description"]');
    if (twDesc) twDesc.setAttribute("content", meta.description);
  }

  // 3. Update OpenGraph & Twitter Titles
  if (meta.title) {
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute("content", meta.title);
    const twTitle = document.querySelector('meta[name="twitter:title"]');
    if (twTitle) twTitle.setAttribute("content", meta.title);
  }

  // 4. Update Canonical Link
  if (meta.canonical) {
    let canonEl = document.querySelector('link[rel="canonical"]');
    if (!canonEl) {
      canonEl = document.createElement("link");
      canonEl.setAttribute("rel", "canonical");
      document.head.appendChild(canonEl);
    }
    canonEl.setAttribute("href", meta.canonical);
  }
}
