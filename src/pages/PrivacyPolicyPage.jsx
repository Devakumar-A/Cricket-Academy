
import { useEffect } from "react";
import { MapPin, Phone, Mail, ShieldCheck } from "lucide-react";
import "./PrivacyPolicyPage.css";

const sections = [
  { id: "introduction", title: "1. Introduction and Scope" },
  { id: "information", title: "2. Information We Collect" },
  { id: "guest-services", title: "3. Guest Bookings and Admissions" },
  { id: "authentication", title: "4. Accounts and Authentication" },
  { id: "usage", title: "5. How We Use Your Information" },
  { id: "sharing", title: "6. Third-Party Services and Data Sharing" },
  { id: "cookies", title: "7. Cookies and Similar Technologies" },
  { id: "retention", title: "8. Data Retention and Deletion" },
  { id: "security", title: "9. Data Security" },
  { id: "minors", title: "10. Children and Young Players" },
  { id: "rights", title: "11. Your Privacy Rights" },
  { id: "transfers", title: "12. Data Processing and Transfers" },
  { id: "external-links", title: "13. External Links and Communications" },
  { id: "changes", title: "14. Changes to This Policy" },
  { id: "contact", title: "15. Contact and Privacy Requests" },
];

export default function PrivacyPolicyPage({ onHome }) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  const handleBackHome = () => {
    if (onHome) {
      onHome();
    } else {
      window.location.href = "/";
    }
  };

  return (
    <main className="policy-page-wrapper">
      <div className="policy-container">
        <div className="policy-nav-bar">
          <button
            type="button"
            className="policy-back-btn"
            onClick={handleBackHome}
          >
            ← Back to Home
          </button>

          <span className="policy-tag">PRIVACY & DATA PROTECTION</span>
        </div>

        <header className="policy-header">
          <div className="policy-badge">MG CRICKETER&apos;S DEN</div>

          <h1 className="policy-title">Privacy Policy</h1>

          <p className="policy-meta">
            Last updated: October 14, 2026
          </p>

          <p>
            Your privacy matters to us. This policy explains what information
            MG Cricketer&apos;s Den may collect, why we use it, how it is
            handled, and the choices available to you when using our website
            and services.
          </p>

          <div className="policy-contact-card">
            <ShieldCheck
              size={22}
              aria-hidden="true"
              style={{
                display: "inline-block",
                verticalAlign: "middle",
                marginRight: 10,
              }}
            />
            <strong>Our commitment:</strong> We aim to handle personal
            information responsibly, use it for legitimate service purposes,
            and explain our practices clearly.
          </div>
        </header>

        <nav className="policy-content policy-toc" aria-label="Privacy policy contents">
          <h2>On this page</h2>
          <ol>
            {sections.map((section) => (
              <li key={section.id}>
                <a href={`#${section.id}`}>{section.title}</a>
              </li>
            ))}
          </ol>
        </nav>

        <article className="policy-content">
          <section id="introduction" className="policy-section">
            <h2>1. Introduction and Scope</h2>

            <p>
              This Privacy Policy applies to MG Cricketer&apos;s Den
              (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) and the
              website{" "}
              <a href="https://mgcricketersden.com">
                https://mgcricketersden.com
              </a>
              . It covers the information associated with visiting our
              website, using available turf-booking features, submitting
              academy admission applications, and accessing player accounts.
            </p>

            <p>
              Our facilities include the practice nets at North Street,
              Thengaithittu, Puducherry 605004, and the match ground at
              Royapudupakkam, Puducherry.
            </p>

            <p>
              This policy should be read alongside any relevant booking,
              admission, or service terms displayed on the website. Where
              applicable law grants you additional rights, this policy does
              not take those rights away.
            </p>
          </section>

          <section id="information" className="policy-section">
            <h2>2. Information We Collect</h2>

            <p>
              The information collected depends on the features you use and
              the details you choose to provide. It may include the following:
            </p>

            <h3>Account and profile information</h3>
            <ul>
              <li>Name and email address.</li>
              <li>Account authentication information and session data.</li>
              <li>Phone number, profile image, or player details where provided.</li>
            </ul>

            <h3>Turf booking information</h3>
            <ul>
              <li>Selected facility, date, time, and booking duration.</li>
              <li>Contact details and other booking information you submit.</li>
              <li>Booking status and related communications, where recorded.</li>
            </ul>

            <h3>Academy admission information</h3>
            <ul>
              <li>Player name, date of birth, gender, and contact information.</li>
              <li>Parent or guardian details, where applicable.</li>
              <li>Address, playing category, batting and bowling preferences.</li>
              <li>Batch selection, fee-related information, and jersey size.</li>
              <li>
                Identity or other supporting information if requested by the
                admission form.
              </li>
              <li>
                Health-related declarations or other sensitive details only
                where requested and provided through the relevant process.
              </li>
            </ul>

            <h3>Technical information</h3>
            <p>
              When you access the website, your browser or hosting
              infrastructure may process technical information such as IP
              address, browser type, device information, requested URLs, and
              server logs. The information actually collected depends on the
              services and configuration in use.
            </p>

            <p>
              Please provide only information needed for the relevant service.
              Avoid sending passwords, payment credentials, or unrelated
              sensitive information through general contact channels.
            </p>
          </section>

          <section id="guest-services" className="policy-section">
            <h2>3. Guest Bookings and Admissions</h2>

            <p>
              Our turf-booking and academy admission pages are intended to be
              accessible without requiring every visitor to sign in. Where a
              form supports guest submissions, you may provide the information
              requested by that form without creating an account.
            </p>

            <p>
              Information entered into a form is not necessarily the same as
              a completed booking or accepted admission. A request may require
              review, confirmation, or further communication before it is
              finalized.
            </p>

            <p>
              We use submitted details for the relevant request, such as
              contacting you, reviewing an admission application, or
              coordinating a turf reservation. The information retained and
              the processing performed depend on the submission flow and
              whether the request is successfully recorded.
            </p>

            <p>
              Creating an account, where available, may allow you to access
              account-related features and information associated with your
              profile. Guest requests should not be assumed to appear in a
              personal dashboard unless that functionality is explicitly
              supported.
            </p>
          </section>

          <section id="authentication" className="policy-section">
            <h2>4. Accounts and Authentication</h2>

            <p>
              Where account functionality is available, we use authentication
              services to manage sign-in, maintain sessions, and support
              account recovery.
            </p>

            <h3>Email and password sign-in</h3>
            <p>
              If you create an account with a password, authentication is
              handled through the configured authentication service. Do not
              share your password or password-reset links with anyone.
            </p>

            <h3>Google sign-in</h3>
            <p>
              If you choose Google sign-in, Google processes your
              authentication. Depending on the permissions and configuration,
              our application may receive basic profile information such as
              your name, email address, and profile image. We do not receive
              your Google account password through this sign-in process.
            </p>

            <h3>Password recovery</h3>
            <p>
              If you request a password reset, the configured authentication
              service may send a recovery email containing a verification
              link. Anyone with access to an active recovery link may be able
              to use it, so keep such links private and request a new one if
              you believe a link has been exposed.
            </p>
          </section>

          <section id="usage" className="policy-section">
            <h2>5. How We Use Your Information</h2>

            <p>Depending on the service you use, information may be processed to:</p>

            <ul>
              <li>Respond to enquiries and provide requested assistance.</li>
              <li>Coordinate turf availability and reservation requests.</li>
              <li>Review admission applications and manage training batches.</li>
              <li>Maintain player profiles and relevant sporting records.</li>
              <li>Communicate about requests, account access, or service changes.</li>
              <li>Send authentication and password-recovery messages.</li>
              <li>Maintain the reliability, security, and functionality of the website.</li>
              <li>Address suspected misuse, disputes, or applicable legal obligations.</li>
            </ul>

            <p>
              We aim to use information in ways that are relevant to the
              purpose for which it was collected or another purpose permitted
              by applicable law.
            </p>
          </section>

          <section id="sharing" className="policy-section">
            <h2>6. Third-Party Services and Data Sharing</h2>

            <p>
              Some website features rely on third-party providers. Information
              may be processed by those providers when needed to deliver the
              relevant feature.
            </p>

            <ul>
              <li>
                <strong>Supabase:</strong> Used for configured authentication,
                database, and related application services.
              </li>
              <li>
                <strong>Google:</strong> Used when you choose Google
                authentication.
              </li>
              <li>
                <strong>Resend and email infrastructure:</strong> Used to
                deliver configured transactional emails, such as password
                recovery messages.
              </li>
              <li>
                <strong>WhatsApp and telephone services:</strong> If you
                choose to contact us through these channels, the relevant
                provider processes information under its own terms and
                privacy practices.
              </li>
              <li>
                <strong>Website hosting and delivery providers:</strong> May
                process technical request data to deliver and secure the
                website.
              </li>
            </ul>

            <p>
              We do not sell personal information as a business practice.
              Information may also be disclosed where necessary to respond to
              lawful requests, protect rights and safety, address misuse, or
              complete a transaction or service you have requested.
            </p>

            <p>
              Third-party services have their own privacy practices. Their
              processing is governed by the terms and policies applicable to
              those services.
            </p>
          </section>

          <section id="cookies" className="policy-section">
            <h2>7. Cookies and Similar Technologies</h2>

            <p>
              The website and its authentication services may use cookies,
              browser storage, or similar technologies to maintain login
              sessions, remember relevant state, and support essential
              functionality.
            </p>

            <p>
              The technologies in use depend on the website configuration.
              This policy does not imply that analytics, advertising cookies,
              or tracking tools are active unless they have actually been
              implemented.
            </p>

            <p>
              You can manage cookies through your browser settings. Blocking
              certain storage technologies may affect sign-in or other website
              functionality.
            </p>
          </section>

          <section id="retention" className="policy-section">
            <h2>8. Data Retention and Deletion</h2>

            <p>
              We aim to retain personal information only for as long as
              reasonably necessary to fulfil the purpose for which it was
              collected, manage relevant services, resolve disputes, maintain
              appropriate records, and meet applicable legal obligations.
            </p>

            <p>
              Retention periods may differ between account details, booking
              records, admission applications, and communications. Information
              may remain in backups or service-provider systems for a limited
              period after deletion, depending on the relevant system and its
              retention practices.
            </p>

            <p>
              You may contact us to request correction or deletion of
              information associated with you. We may need to verify your
              request before acting. Some information may need to be retained
              where permitted or required by law or where it is necessary to
              resolve an outstanding matter.
            </p>
          </section>

          <section id="security" className="policy-section">
            <h2>9. Data Security</h2>

            <p>
              We seek to protect personal information through appropriate
              technical and organizational measures suited to the services
              provided. These may include access controls, secure
              authentication, HTTPS connections, and database permissions
              configured for the application.
            </p>

            <p>
              No website, transmission method, or electronic storage system
              can be guaranteed to be completely secure. We therefore cannot
              promise absolute security.
            </p>

            <p>
              You can help protect your information by using a unique
              password, keeping your device secure, signing out of shared
              devices, and notifying us if you suspect unauthorized access to
              your account.
            </p>
          </section>

          <section id="minors" className="policy-section">
            <h2>10. Children and Young Players</h2>

            <p>
              Our academy serves young players, and admission applications may
              involve information about minors. We expect parents or legal
              guardians to participate where required by applicable law or
              the relevant admission process.
            </p>

            <p>
              We aim to collect information about young players only for
              appropriate purposes connected with admissions, training,
              communication, safety, and administration. Where consent or
              guardian authorization is legally required, it should be
              obtained before the relevant information is processed.
            </p>

            <p>
              If you are a parent or guardian and believe that a child&apos;s
              information has been provided improperly, please contact us so
              that we can review the request.
            </p>
          </section>

          <section id="rights" className="policy-section">
            <h2>11. Your Privacy Rights</h2>

            <p>
              Depending on the laws applicable to you and the circumstances,
              you may be entitled to:
            </p>

            <ul>
              <li>Request access to personal information associated with you.</li>
              <li>Request correction of inaccurate or incomplete information.</li>
              <li>Request deletion of information where applicable.</li>
              <li>Withdraw consent where processing is based on consent.</li>
              <li>Raise a concern or complaint about the handling of your information.</li>
            </ul>

            <p>
              To exercise a privacy right, contact us using the details below.
              We may request reasonable information to verify your identity
              and clarify the request. We will respond in accordance with
              applicable requirements and explain if a request cannot be
              fulfilled in full.
            </p>
          </section>

          <section id="transfers" className="policy-section">
            <h2>12. Data Processing and Transfers</h2>

            <p>
              Our website depends on online infrastructure and third-party
              providers. Depending on their configuration, information may be
              processed or stored in locations outside the place where you
              live.
            </p>

            <p>
              Where applicable law requires safeguards for international
              transfers or particular processing arrangements, those
              requirements should be addressed through the relevant provider
              arrangements and operational practices.
            </p>
          </section>

          <section id="external-links" className="policy-section">
            <h2>13. External Links and Communications</h2>

            <p>
              Our website may link to external platforms or allow you to
              contact us through email, telephone, social media, or messaging
              services. When you leave our website or use an external service,
              that service&apos;s own terms and privacy policy may apply.
            </p>

            <p>
              Please check that you are using the intended account or contact
              details before sharing personal information. Do not send
              passwords or authentication codes through public or general
              messaging channels.
            </p>
          </section>

          <section id="changes" className="policy-section">
            <h2>14. Changes to This Policy</h2>

            <p>
              We may update this Privacy Policy when our services, technology,
              operational practices, or legal obligations change. The revised
              version will be published on this page with an updated
              &quot;Last updated&quot; date.
            </p>

            <p>
              Where applicable law requires additional notice or consent for a
              material change, we will follow the relevant requirements.
              Please review this page periodically to stay informed about our
              privacy practices.
            </p>
          </section>

          <section id="contact" className="policy-section">
            <h2>15. Contact and Privacy Requests</h2>

            <p>
              If you have questions about this policy or wish to request
              access, correction, or deletion of personal information, please
              contact MG Cricketer&apos;s Den using the details below.
            </p>

            <div className="policy-contact-card">
              <p>
                <strong>MG CRICKETER&apos;S DEN</strong>
              </p>

              <p>
                <MapPin
                  size={15}
                  aria-hidden="true"
                  style={{
                    display: "inline-block",
                    verticalAlign: "-2px",
                    marginRight: 6,
                  }}
                />
                North Street, Thengaithittu, Puducherry 605004, India
              </p>

              <p>
                <Phone
                  size={15}
                  aria-hidden="true"
                  style={{
                    display: "inline-block",
                    verticalAlign: "-2px",
                    marginRight: 6,
                  }}
                />
                <a href="tel:+918122432905">+91 81224 32905</a>
                {" / "}
                <a href="tel:+919443243290">+91 94432 43290</a>
              </p>

              <p>
                <Mail
                  size={15}
                  aria-hidden="true"
                  style={{
                    display: "inline-block",
                    verticalAlign: "-2px",
                    marginRight: 6,
                  }}
                />
                <a href="mailto:mgcricketersden@gmail.com">
                  mgcricketersden@gmail.com
                </a>
              </p>
            </div>
          </section>

          <p className="policy-meta">
            This Privacy Policy describes intended privacy practices. Actual
            processing depends on the website&apos;s deployed configuration
            and applicable law.
          </p>
        </article>
      </div>
    </main>
  );
}
