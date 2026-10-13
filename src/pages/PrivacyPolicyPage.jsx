import { useEffect } from "react";
import "./PrivacyPolicyPage.css";

export default function PrivacyPolicyPage({ onHome }) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <main className="policy-page-wrapper">
      <div className="policy-container">
        {/* Breadcrumb / Back button */}
        <div className="policy-nav-bar">
          <button
            type="button"
            className="policy-back-btn"
            onClick={onHome || (() => { window.location.href = "/"; })}
          >
            ← Back to Home
          </button>
          <span className="policy-tag">LEGAL COMPLIANCE</span>
        </div>

        <header className="policy-header">
          <div className="policy-badge">MG CRICKETER'S DEN</div>
          <h1 className="policy-title">Privacy Policy</h1>
          <p className="policy-meta">
            Last Updated: October 2026 • Effective Date: October 1, 2026
          </p>
        </header>

        <article className="policy-content">
          <section className="policy-section">
            <h2>1. Introduction & Overview</h2>
            <p>
              Welcome to <strong>MG CRICKETER'S DEN</strong> ("we," "our," or "us"), operating at North Street, Thengaithittu, Puducherry 605004, and our match arena at Royapudupakkam, Puducherry. We are committed to protecting your personal information and your right to privacy.
            </p>
            <p>
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website at <a href="https://mgcricketersden.com">https://mgcricketersden.com</a>, utilize our turf booking reservation portal, apply for academy admissions, or register for training programs.
            </p>
          </section>

          <section className="policy-section">
            <h2>2. Information We Collect</h2>
            <p>We collect information that you voluntarily provide to us when you:</p>
            <ul>
              <li><strong>Create an Account:</strong> Your full name, email address, password, phone number, and player age/category.</li>
              <li><strong>Sign In via Google OAuth:</strong> When you choose to authenticate using Google OAuth, we receive your Google display name, email address, and profile photo avatar as authorized by your Google account permissions. We use this strictly to authenticate your account and personalize your player dashboard.</li>
              <li><strong>Book Turf Slots:</strong> Selected pitch (Astro Turf or Natural Turf), date, time slots, duration, team details, and booking notes.</li>
              <li><strong>Apply for Academy Admission:</strong> Player's full name, date of birth, guardian name, contact telephone, address, previous cricket experience, and health/fitness declarations.</li>
              <li><strong>Contact Desk:</strong> Your contact telephone and email when requesting guidance or personalized coaching sessions.</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>3. How We Use Your Information</h2>
            <p>We utilize the collected information for legitimate sports club administration purposes:</p>
            <ul>
              <li>To manage slot bookings, schedule pitches, and avoid reservation conflicts.</li>
              <li>To process academy enrollment, verify batch allocations, and generate admission forms.</li>
              <li>To maintain player profiles, match scores, and progression statistics.</li>
              <li>To send booking confirmation notifications, password reset links, and facility schedule updates.</li>
              <li>To ensure safety, prevent unauthorized access, and protect against security incidents.</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>4. Authentication & Third-Party Services</h2>
            <p>We work with trusted industry-standard infrastructure providers:</p>
            <ul>
              <li><strong>Supabase:</strong> Cloud database, Row Level Security (RLS), and encrypted user authentication.</li>
              <li><strong>Google OAuth 2.0:</strong> Secure social authentication protocol. We do not store your Google password.</li>
              <li><strong>Resend / Custom SMTP:</strong> Deliver transactional communications, including password recovery verification emails.</li>
              <li><strong>WhatsApp Business API / Direct Connect:</strong> Facilitate prompt player support and turf slot confirmations with player consent.</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>5. Data Retention & Security</h2>
            <p>
              We implement industry-standard cryptographic measures (HTTPS/TLS, secure password hashing, Row Level Security) to protect your personal data. We retain your profile and booking history only as long as necessary to provide sports training services or comply with legal requirements.
            </p>
          </section>

          <section className="policy-section">
            <h2>6. Your Privacy Rights</h2>
            <p>
              Under applicable data protection laws, you have the right to access, rectify, or request deletion of your player account information. To update or delete your profile data, contact our administrative desk via email at <a href="mailto:mgcricketersden@gmail.com">mgcricketersden@gmail.com</a> or phone at <a href="tel:+918122432905">+91 81224 32905</a>.
            </p>
          </section>

          <section className="policy-section">
            <h2>7. Contact Information</h2>
            <div className="policy-contact-card">
              <p><strong>MG CRICKETER'S DEN</strong></p>
              <p>📍 North Street, Thengaithittu, Puducherry 605004, India</p>
              <p>📞 Phone: +91 81224 32905 / +91 94432 43290</p>
              <p>✉️ Email: <a href="mailto:mgcricketersden@gmail.com">mgcricketersden@gmail.com</a></p>
            </div>
          </section>
        </article>
      </div>
    </main>
  );
}
