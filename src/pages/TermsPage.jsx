
import { useEffect } from "react";
import { MapPin, Phone, Mail } from "lucide-react";
import "./TermsPage.css";

const WEBSITE_URL = "https://mgcricketersden.com";
const CONTACT_EMAIL = "mgcricketersden@gmail.com";
const CONTACT_PHONE = "+91 81224 32905";
const LAST_UPDATED = "14 October 2026";

export default function TermsPage({ onHome }) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  const handleBackHome = () => {
    if (onHome) {
      onHome();
      return;
    }

    window.location.href = "/";
  };

  return (
    <main className="terms-page-wrapper">
      <div className="terms-container">
        <nav className="terms-nav-bar" aria-label="Page navigation">
          <button
            type="button"
            className="terms-back-btn"
            onClick={handleBackHome}
          >
            <span aria-hidden="true">←</span> Back to Home
          </button>

          <span className="terms-tag">TERMS OF SERVICE</span>
        </nav>

        <header className="terms-header">
          <div className="terms-badge">MG CRICKETER'S DEN</div>

          <h1 className="terms-title">Terms of Service</h1>

          <p className="terms-meta">
            Last Updated: {LAST_UPDATED} · Puducherry, India
          </p>

          <p>
            These Terms explain the conditions governing access to our website,
            cricket coaching programmes, turf and net booking services, and
            associated facilities. Please read them carefully before making a
            reservation or submitting an admission application.
          </p>
        </header>

        <article className="terms-content">
          <section className="terms-section" id="agreement">
            <h2>1. Acceptance of These Terms</h2>

            <p>
              Welcome to <strong>MG CRICKETER'S DEN</strong> ("MG Den", "we",
              "us" or "our"). These Terms of Service ("Terms") apply to your
              access to and use of{" "}
              <a href={WEBSITE_URL}>{WEBSITE_URL}</a>, including the
              information, online forms, account features, turf reservation
              facilities and academy admission services made available through
              the website.
            </p>

            <p>
              By using our website, submitting an application, requesting a
              booking or using our facilities, you agree to comply with these
              Terms and any reasonable, separately communicated facility rules
              applicable to your activity.
            </p>

            <p>
              If you do not agree with these Terms, please discontinue use of
              the relevant website service or facility. Where a separate
              written agreement or specific booking condition applies, it
              should be read together with these Terms. If there is a conflict,
              the applicable mandatory law will prevail.
            </p>
          </section>

          <section className="terms-section" id="eligibility">
            <h2>2. Eligibility and Minors</h2>

            <ul>
              <li>
                You must provide accurate information and have the legal
                capacity required to enter into the relevant transaction.
              </li>
              <li>
                A parent or legal guardian must complete or approve
                registrations, consent forms and other arrangements where
                required for a participant who is a minor.
              </li>
              <li>
                Parents and guardians are responsible for ensuring that
                participants under their care understand and follow applicable
                coaching, conduct and safety rules.
              </li>
              <li>
                We may request reasonable information or documentation to
                verify an applicant's identity, age, guardian details or
                eligibility for a particular programme.
              </li>
            </ul>
          </section>

          <section className="terms-section" id="accounts">
            <h2>3. Website Accounts and Security</h2>

            <p>
              Certain features, including access to a member profile or
              account-specific information, may require registration and
              authentication. Public website pages and the ability to submit
              certain requests may be available without signing in.
            </p>

            <ul>
              <li>
                Provide complete and truthful registration details and update
                them when necessary.
              </li>
              <li>
                Keep your password and authentication methods secure. Do not
                share account access or impersonate another person.
              </li>
              <li>
                Notify us promptly if you suspect unauthorised access to your
                account.
              </li>
              <li>
                Do not attempt to bypass access controls, interfere with
                website operations, introduce malicious code, scrape protected
                information or misuse another person's data.
              </li>
              <li>
                We may restrict or suspend access where reasonably necessary
                to investigate suspected fraud, protect users, comply with
                law or address a material breach of these Terms.
              </li>
            </ul>

            <p>
              An account is intended to provide access to permitted member
              features. Creating an account does not itself guarantee a
              reservation, academy admission or availability of a particular
              service.
            </p>
          </section>

          <section className="terms-section" id="bookings">
            <h2>4. Turf and Practice Net Reservations</h2>

            <h3>4.1 Reservation requests</h3>

            <p>
              The website may allow visitors to select a facility, date, time
              and duration and submit a reservation request. Submitting a
              request does not necessarily mean that the booking is confirmed.
              A reservation is confirmed only when the confirmation method
              communicated by MG Den has been completed.
            </p>

            <p>
              Availability, operating hours, prices and facility arrangements
              may vary by venue and date. Please review the displayed details
              and any confirmation message before travelling to the facility.
            </p>

            <h3>4.2 Accurate booking information</h3>

            <p>
              You must provide a valid contact number and accurate reservation
              details. If you book on behalf of a team or another participant,
              you must have permission to provide the information submitted.
              We may contact you to clarify details or resolve scheduling
              conflicts.
            </p>

            <h3>4.3 Arrivals and slot timings</h3>

            <ul>
              <li>
                Arrive with sufficient time to prepare and follow the
                facility's check-in instructions.
              </li>
              <li>
                Use the facility only during the confirmed reservation period.
                Sessions must end at the scheduled time unless an extension
                has been expressly approved.
              </li>
              <li>
                Late arrival does not automatically extend a booking or
                entitle the customer to a refund.
              </li>
              <li>
                Additional time is subject to availability and any applicable
                additional charge.
              </li>
            </ul>

            <h3>4.4 Facility rules</h3>

            <p>
              Customers must follow the instructions of authorised staff,
              observe the posted rules and use equipment only for its intended
              purpose. Appropriate cricket footwear and protective equipment
              must be used according to the pitch, activity and safety
              instructions. Metal spikes must not be used on artificial turf
              where prohibited.
            </p>

            <p>
              Bowling machines and other specialised equipment may be operated
              only by persons authorised or appropriately supervised by the
              facility. We may stop an activity that creates an unreasonable
              safety risk or damages the premises or equipment.
            </p>
          </section>

          <section className="terms-section" id="cancellations">
            <h2>5. Changes, Cancellations and Refunds</h2>

            <p>
              Booking changes, cancellations, rescheduling and refunds are
              subject to the conditions communicated for the relevant
              reservation or programme at the time of booking. Please contact
              us promptly if you need to change an arrangement.
            </p>

            <ul>
              <li>
                A requested change is not effective until it has been
                acknowledged or confirmed by the appropriate MG Den contact.
              </li>
              <li>
                Refund eligibility may depend on the applicable booking
                conditions, notice provided, services already supplied and
                applicable law.
              </li>
              <li>
                If MG Den cancels a confirmed session, we will communicate
                the available rescheduling or refund arrangements in accordance
                with the applicable booking conditions and law.
              </li>
              <li>
                Weather, ground conditions, maintenance, safety concerns or
                other operational circumstances may require a session to be
                delayed, rescheduled or cancelled.
              </li>
            </ul>

            <p>
              No fixed cancellation deadline, administrative fee or
              non-refundable charge is created by this section alone. Any
              specific cancellation or refund condition must be clearly
              communicated before the relevant payment or commitment.
            </p>
          </section>

          <section className="terms-section" id="admissions">
            <h2>6. Academy Admissions and Coaching Programmes</h2>

            <p>
              Admission applications are subject to review, programme
              eligibility, available places and completion of the registration
              requirements communicated by the academy. Submitting an
              application does not guarantee acceptance or a particular
              training schedule.
            </p>

            <ul>
              <li>
                Applicants and guardians must submit accurate personal,
                contact and participant information.
              </li>
              <li>
                Any medical, fitness or other safety information specifically
                requested for participation must be disclosed accurately and
                handled in accordance with the applicable privacy notice.
              </li>
              <li>
                Batch timings, coaching staff, facilities and training
                arrangements may change where operationally necessary.
                Material changes will be communicated where reasonably
                practicable.
              </li>
              <li>
                Fees, payment deadlines, included services and any additional
                charges must be confirmed through the applicable admission or
                fee information.
              </li>
              <li>
                Enrolment remains subject to payment and other requirements
                expressly communicated by the academy.
              </li>
            </ul>

            <p>
              Any withdrawal, batch transfer, missed-session or fee-refund
              request will be handled under the specific programme conditions
              communicated at enrolment and applicable law.
            </p>
          </section>

          <section className="terms-section" id="payments">
            <h2>7. Fees and Payments</h2>

            <p>
              Applicable charges will be communicated through the website,
              booking process, admission information or an authorised MG Den
              representative. Customers should verify the amount, service,
              payment recipient and any applicable conditions before paying.
            </p>

            <ul>
              <li>
                Do not treat an incomplete payment, payment initiation screen
                or unacknowledged transfer as confirmation that a reservation
                or admission has been secured.
              </li>
              <li>
                If a payment appears to have failed or been duplicated,
                contact us with the relevant transaction reference. Do not
                send passwords, OTPs or other authentication secrets.
              </li>
              <li>
                Any applicable taxes, payment-provider charges or other fees
                will be disclosed as required by law.
              </li>
              <li>
                Refunds, where due, will be processed according to the
                applicable terms and payment method, subject to legal
                requirements and reasonable verification.
              </li>
            </ul>
          </section>

          <section className="terms-section" id="conduct">
            <h2>8. Code of Conduct and Facility Care</h2>

            <p>
              All players, parents, guardians, visitors and teams are expected
              to behave respectfully and help maintain a safe, clean and
              welcoming sporting environment.
            </p>

            <ul>
              <li>
                Follow instructions from coaches, staff and facility
                management.
              </li>
              <li>
                Do not engage in harassment, bullying, discrimination,
                intimidation, fighting, abusive conduct or dangerous play.
              </li>
              <li>
                Do not damage pitches, nets, equipment, changing areas or
                other property.
              </li>
              <li>
                Do not bring prohibited or dangerous items onto the premises
                or use the facilities for unlawful purposes.
              </li>
              <li>
                Respect other customers' sessions, privacy and personal
                belongings.
              </li>
            </ul>

            <p>
              We may require a person to stop an activity or leave the
              premises when reasonably necessary for safety, conduct or
              facility protection. Any restriction will be handled in
              accordance with applicable law and relevant booking terms.
              Charges for proven damage may be pursued where legally
              recoverable.
            </p>
          </section>

          <section className="terms-section" id="safety">
            <h2>9. Sports Safety and Participant Responsibilities</h2>

            <p>
              Cricket involves physical activity and inherent risks, including
              impact from balls and bats, falls, collisions, muscle strains
              and other injuries. Participants should understand these risks
              and take reasonable precautions.
            </p>

            <ul>
              <li>
                Use suitable protective equipment for the activity and follow
                safety instructions.
              </li>
              <li>
                Do not participate when you are unfit to do so or when doing
                so would create a foreseeable risk to yourself or others.
              </li>
              <li>
                Inform the appropriate staff of an injury, hazard or unsafe
                equipment as soon as reasonably possible.
              </li>
              <li>
                Parents or guardians should ensure that minors are adequately
                supervised in accordance with the programme's arrangements.
              </li>
            </ul>

            <p>
              Nothing in these Terms excludes or limits any duty of care,
              consumer right or liability that cannot lawfully be excluded or
              limited. A general acknowledgement of sporting risks does not
              waive rights that are protected by applicable law.
            </p>
          </section>

          <section className="terms-section" id="weather">
            <h2>10. Weather, Maintenance and Service Availability</h2>

            <p>
              Outdoor sports facilities may be affected by rain, waterlogging,
              unsafe playing conditions, maintenance, power interruptions or
              other circumstances outside our reasonable control. We may
              suspend or adjust an activity where necessary to protect
              participants or maintain the facilities.
            </p>

            <p>
              We will make reasonable efforts to communicate significant
              operational changes and explain any available rescheduling or
              refund arrangements under the applicable booking conditions.
              The website itself may occasionally be unavailable due to
              maintenance, technical faults or service-provider interruptions.
            </p>
          </section>

          <section className="terms-section" id="intellectual-property">
            <h2>11. Intellectual Property and Website Content</h2>

            <p>
              Unless otherwise indicated, website text, original graphics,
              branding, logos, photographs, videos and other materials are
              owned by MG Den or used with permission and may be protected by
              applicable intellectual property laws.
            </p>

            <p>
              You may access and use the website for personal, lawful purposes.
              You must not reproduce, redistribute, commercially exploit,
              modify or publicly represent protected material as your own
              without the relevant permission, except where permitted by law.
            </p>

            <p>
              Third-party names, logos and materials remain the property of
              their respective owners. Nothing in these Terms transfers
              ownership of intellectual property to a website visitor.
            </p>
          </section>

          <section className="terms-section" id="privacy">
            <h2>12. Privacy and Personal Information</h2>

            <p>
              Personal information submitted through the website may be used
              to administer accounts, respond to enquiries, process booking
              requests, evaluate admission applications, communicate service
              updates and protect the security of our services.
            </p>

            <p>
              Information may be processed by service providers supporting
              website hosting, authentication, communications or database
              operations, subject to applicable arrangements and law.
              Information will not be handled in a manner that overrides
              rights protected by applicable privacy legislation.
            </p>

            <p>
              Please read our{" "}
              <a href="/privacy-policy">Privacy Policy</a> for further details
              about information handling, retention, security and privacy
              requests. You should not submit another person's personal
              information unless you have the necessary authority to do so.
            </p>
          </section>

          <section className="terms-section" id="third-party-services">
            <h2>13. Third-Party Services and External Links</h2>

            <p>
              Website features may rely on third-party services, including
              authentication providers, email delivery systems, hosting
              providers and external communication platforms. External
              services may have their own terms, privacy notices and
              availability limitations.
            </p>

            <p>
              Links to external websites are provided for convenience or
              communication. Unless expressly stated otherwise, we do not
              control those websites and are not responsible for their
              independent content or policies. Your use of them is subject to
              their applicable terms.
            </p>
          </section>

          <section className="terms-section" id="liability">
            <h2>14. Responsibility and Limitation of Liability</h2>

            <p>
              You are responsible for the accuracy of information you submit,
              your conduct while using the website and your compliance with
              applicable facility rules.
            </p>

            <p>
              To the extent permitted by law, MG Den is not responsible for
              losses arising solely from a user's inaccurate information,
              unauthorised sharing of account credentials, misuse of the
              website or failure to follow reasonable safety instructions.
              This does not exclude liability for matters that cannot legally
              be excluded, including applicable statutory consumer rights.
            </p>

            <p>
              Nothing in these Terms limits liability where such limitation
              would be unlawful, or removes any remedy available to a customer
              under applicable law. Any assessment of responsibility depends
              on the circumstances and the rights and duties established by
              law.
            </p>
          </section>

          <section className="terms-section" id="changes">
            <h2>15. Changes to These Terms</h2>

            <p>
              We may update these Terms to reflect changes to our services,
              facilities, operating procedures or legal obligations. The
              revised version will be published on this page with an updated
              revision date.
            </p>

            <p>
              Changes will apply as permitted by law. Where a change
              materially affects an existing booking or enrolment, the
              applicable existing agreement and mandatory legal requirements
              will determine how that change is handled.
            </p>
          </section>

          <section className="terms-section" id="law">
            <h2>16. Governing Law and Disputes</h2>

            <p>
              These Terms are governed by the laws of India, subject to
              applicable consumer protection and other mandatory legal
              requirements.
            </p>

            <p>
              If you have a concern about a booking, payment, admission or
              website service, please contact us first so that we can attempt
              to resolve it constructively. Nothing in this section prevents
              you from approaching a competent authority, consumer forum or
              court where permitted by law.
            </p>

            <p>
              Any dispute will be handled by the authority or court having
              jurisdiction under applicable law. These Terms do not create
              exclusive jurisdiction where doing so would be unlawful.
            </p>
          </section>

          <section className="terms-section" id="severability">
            <h2>17. General Provisions</h2>

            <ul>
              <li>
                If any provision of these Terms is found unenforceable, the
                remaining provisions will continue to apply to the extent
                permitted by law.
              </li>
              <li>
                A failure to enforce a provision on one occasion does not
                automatically waive the right to enforce it later.
              </li>
              <li>
                These Terms should be read together with the applicable
                booking confirmation, programme conditions and Privacy Policy.
              </li>
              <li>
                Nothing in these Terms creates an employment relationship,
                partnership or agency relationship between a website visitor
                and MG Den.
              </li>
            </ul>
          </section>

          <section className="terms-section" id="contact">
            <h2>18. Contact Information</h2>

            <p>
              For questions about these Terms, reservation requests, academy
              admissions or facility arrangements, please contact MG
              Cricketer's Den using the details below.
            </p>

            <div className="terms-contact-card">
              <p>
                <strong>MG CRICKETER'S DEN</strong>
              </p>

              <p>
                <MapPin
                  size={14}
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
                  size={14}
                  aria-hidden="true"
                  style={{
                    display: "inline-block",
                    verticalAlign: "-2px",
                    marginRight: 6,
                  }}
                />
                <a href={`tel:${CONTACT_PHONE.replace(/\s/g, "")}`}>
                  {CONTACT_PHONE}
                </a>
                {" / "}
                <a href="tel:+919443243290">+91 94432 43290</a>
              </p>

              <p>
                <Mail
                  size={14}
                  aria-hidden="true"
                  style={{
                    display: "inline-block",
                    verticalAlign: "-2px",
                    marginRight: 6,
                  }}
                />
                <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
              </p>

              <p>
                Website:{" "}
                <a href={WEBSITE_URL} target="_blank" rel="noreferrer">
                  mgcricketersden.com
                </a>
              </p>
            </div>
          </section>
        </article>

        <footer className="terms-footer">
          <p>
            © {new Date().getFullYear()} MG CRICKETER'S DEN. All rights
            reserved.
          </p>
          <p>
            These Terms should be read alongside the{" "}
            <a href="/privacy-policy">Privacy Policy</a>.
          </p>
        </footer>
      </div>
    </main>
  );
}
