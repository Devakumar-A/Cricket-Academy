import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const distDir = path.join(rootDir, "dist");
const baseHtmlPath = path.join(distDir, "index.html");

if (!fs.existsSync(baseHtmlPath)) {
  console.error("❌ Base dist/index.html not found! Run vite build first.");
  process.exit(1);
}

const baseHtml = fs.readFileSync(baseHtmlPath, "utf-8");

const ROUTES_METADATA = [
  {
    route: "", // root /
    outputDir: distDir,
    title: "Best Cricket Academy in Pondicherry | MG Den",
    description: "Join the best cricket academy in Pondicherry! Floodlit astro turf nets at Thengaithittu & match ground at Royapudupakkam. Enroll today!",
    canonical: "https://mgcricketersden.com/",
  },
  {
    route: "booking",
    outputDir: path.join(distDir, "booking"),
    title: "Turf Booking Thengaithittu | Cricket Nets Pondicherry",
    description: "Book 24/7 floodlit astro and natural turf cricket practice nets in Thengaithittu, Pondicherry. Instant online slot confirmation. Book now!",
    canonical: "https://mgcricketersden.com/booking",
  },
  {
    route: "admission",
    outputDir: path.join(distDir, "admission"),
    title: "Cricket Academy Admission in Pondicherry | Join MG Den",
    description: "Admissions open for weekday & weekend coaching batches in Pondicherry. Pro training for juniors & seniors. Apply for admission today!",
    canonical: "https://mgcricketersden.com/admission",
  },
  {
    route: "coaches",
    outputDir: path.join(distDir, "coaches"),
    title: "Expert Cricket Coaches in Pondicherry | MG Den",
    description: "Train with top domestic cricket coaches in Pondicherry. Specialized batting, fast bowling & spin drills. Meet our coaching faculty today!",
    canonical: "https://mgcricketersden.com/coaches",
  },
  {
    route: "about",
    outputDir: path.join(distDir, "about"),
    title: "About MG Cricketers Den | Premier Academy Pondicherry",
    description: "Discover Pondicherry's leading cricket training destination. Dual pro venues at Thengaithittu & Royapudupakkam. Learn more about our vision!",
    canonical: "https://mgcricketersden.com/about",
  },
  {
    route: "players",
    outputDir: path.join(distDir, "players"),
    title: "Player Stats & Match Performance | MG Pondicherry",
    description: "Track live batting, bowling & match performance stats of academy players across Pondicherry tournament leagues. Explore player rankings now!",
    canonical: "https://mgcricketersden.com/players",
  },
  {
    route: "contact",
    outputDir: path.join(distDir, "contact"),
    title: "Contact Cricket Academy Pondicherry | Thengaithittu",
    description: "Contact MG Cricketer's Den for admissions & turf booking in Thengaithittu & Royapudupakkam, Pondicherry. Call or WhatsApp us today!",
    canonical: "https://mgcricketersden.com/contact",
  },
  {
    route: "dashboard",
    outputDir: path.join(distDir, "dashboard"),
    title: "Player Dashboard | MG Cricketers Den Pondicherry",
    description: "Access your personalized player dashboard, track turf reservations, and view coaching schedules at MG Cricketer's Den.",
    canonical: "https://mgcricketersden.com/dashboard",
    robots: "noindex, nofollow",
  },
  {
    route: "login",
    outputDir: path.join(distDir, "login"),
    title: "Member Login | MG Cricketers Den Pondicherry",
    description: "Login to your MG Cricketer's Den portal to manage turf bookings, training schedules, and performance progress in Pondicherry. Sign in now!",
    canonical: "https://mgcricketersden.com/login",
    robots: "noindex, nofollow",
  },
  {
    route: "signup",
    outputDir: path.join(distDir, "signup"),
    title: "Register Account | MG Cricket Academy Pondicherry",
    description: "Create your athlete profile at MG Cricketer's Den Pondicherry for seamless slot reservations and academy updates. Register your account today!",
    canonical: "https://mgcricketersden.com/signup",
    robots: "noindex, nofollow",
  },
  {
    route: "forgot-password",
    outputDir: path.join(distDir, "forgot-password"),
    title: "Reset Password | MG Cricketers Den Pondicherry",
    description: "Reset your password to regain access to your MG Cricketer's Den account, turf bookings, and player dashboard in Pondicherry. Reset now!",
    canonical: "https://mgcricketersden.com/forgot-password",
    robots: "noindex, nofollow",
  },
];

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function bakeRouteHtml(template, item) {
  let html = template;
  const image = "https://mgcricketersden.com/logoo.png";
  const robots = item.robots || "index, follow";

  // 1. Replace <title>
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(item.title)}</title>`);

  // 2. Replace <meta name="robots">
  html = html.replace(
    /<meta\s+name=["']robots["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
    `<meta name="robots" content="${escapeHtml(robots)}" />`
  );

  // 3. Replace <meta name="description">
  html = html.replace(
    /<meta\s+name=["']description["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
    `<meta name="description" content="${escapeHtml(item.description)}" />`
  );

  // 4. Replace <link rel="canonical">
  html = html.replace(
    /<link\s+rel=["']canonical["']\s+href=["'][\s\S]*?["']\s*\/?>/i,
    `<link rel="canonical" href="${escapeHtml(item.canonical)}" />`
  );

  // 5. Replace OpenGraph Tags
  html = html.replace(
    /<meta\s+property=["']og:title["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
    `<meta property="og:title" content="${escapeHtml(item.title)}" />`
  );
  html = html.replace(
    /<meta\s+property=["']og:description["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
    `<meta property="og:description" content="${escapeHtml(item.description)}" />`
  );
  html = html.replace(
    /<meta\s+property=["']og:url["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
    `<meta property="og:url" content="${escapeHtml(item.canonical)}" />`
  );

  // 5. Replace Twitter Tags
  html = html.replace(
    /<meta\s+name=["']twitter:title["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
    `<meta name="twitter:title" content="${escapeHtml(item.title)}" />`
  );
  html = html.replace(
    /<meta\s+name=["']twitter:description["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
    `<meta name="twitter:description" content="${escapeHtml(item.description)}" />`
  );
  html = html.replace(
    /<meta\s+name=["']twitter:url["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
    `<meta name="twitter:url" content="${escapeHtml(item.canonical)}" />`
  );

  return html;
}

console.log("🚀 Prerendering static HTML with baked-in Open Graph metadata for all routes...");

ROUTES_METADATA.forEach((item) => {
  if (!fs.existsSync(item.outputDir)) {
    fs.mkdirSync(item.outputDir, { recursive: true });
  }

  const customizedHtml = bakeRouteHtml(baseHtml, item);
  const targetFile = path.join(item.outputDir, "index.html");
  fs.writeFileSync(targetFile, customizedHtml, "utf-8");
  console.log(`  ✅ Baked static route: /${item.route} -> ${path.relative(rootDir, targetFile)}`);
});

console.log("✨ Prerendering complete! All social crawlers (WhatsApp/FB/IG/X) will receive static metadata.");
