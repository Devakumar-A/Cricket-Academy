import { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import { supabase } from "../lib/supabase";
import "./Dashboard.css";

function DashboardPage({ user, onBack, onNavigate }) {
  const [bookings, setBookings] = useState([]);
  const [admissions, setAdmissions] = useState([]);
  const [turfs, setTurfs] = useState([]);
  const [activeTab, setActiveTab] = useState("all"); // "all" | "bookings" | "admissions" | "profile"

  const [loading, setLoading] = useState(true);
  const [pdfLoading, setPdfLoading] = useState(null);

  const name =
    user?.user_metadata?.name ||
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "Athlete";

  const email = user?.email || "No email linked";
  const phone = user?.user_metadata?.phone || user?.phone || "Not provided";

  // --------------------------------------------------
  // LOAD DASHBOARD DATA
  // --------------------------------------------------
  useEffect(() => {
    if (user?.id) {
      loadDashboard();
    } else {
      setLoading(false);
    }
  }, [user?.id]);

  async function loadDashboard() {
    setLoading(true);

    try {
      const [bookingsResult, admissionsResult, turfsResult] = await Promise.all([
        supabase
          .from("bookings")
          .select("*")
          .eq("user_id", user.id)
          .order("booking_date", { ascending: false }),

        supabase
          .from("admissions")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false }),

        supabase.from("turfs").select("id,name")
      ]);

      if (bookingsResult.error) {
        console.error("BOOKINGS ERROR:", bookingsResult.error);
      }
      if (admissionsResult.error) {
        console.error("ADMISSIONS ERROR:", admissionsResult.error);
      }
      if (turfsResult.error) {
        console.error("TURFS ERROR:", turfsResult.error);
      }

      setBookings(bookingsResult.data || []);
      setTurfs(turfsResult.data || []);

      // ----------------------------------------------
      // GENERATE SIGNED PHOTO URLS FOR ADMISSIONS
      // ----------------------------------------------
      const admissionsData = admissionsResult.data || [];
      const admissionsWithPhotos = await Promise.all(
        admissionsData.map(async (admission) => {
          let signedPhotoUrl = null;
          if (admission.photo_url) {
            signedPhotoUrl = await getSignedPhotoUrl(admission.photo_url);
          }
          return {
            ...admission,
            signed_photo_url: signedPhotoUrl
          };
        })
      );

      setAdmissions(admissionsWithPhotos);
    } catch (error) {
      console.error("DASHBOARD ERROR:", error);
    } finally {
      setLoading(false);
    }
  }

  function getTurfName(turfId) {
    const turf = turfs.find((t) => t.id === turfId);
    return turf?.name || "Match Ground / Nets";
  }

  function formatTime(time) {
    if (!time) return "-";
    const [hours, minutes] = time.split(":");
    const date = new Date();
    date.setHours(Number(hours), Number(minutes), 0, 0);
    return date.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit"
    });
  }

  function formatDate(date) {
    if (!date) return "-";
    return new Date(date + "T00:00:00").toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  }

  async function getSignedPhotoUrl(photoPath) {
    if (!photoPath) return null;
    try {
      // If already a full public or signed URL
      if (photoPath.startsWith("http://") || photoPath.startsWith("https://")) {
        return photoPath;
      }

      // Determine bucket and clean path
      let bucket = "admission-photos";
      let filePath = photoPath;

      if (photoPath.startsWith("admission-photos/")) {
        filePath = photoPath.replace("admission-photos/", "");
      } else if (photoPath.startsWith("player-photos/")) {
        bucket = "player-photos";
        filePath = photoPath.replace("player-photos/", "");
      }

      const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(filePath, 60 * 60);

      if (!error && data?.signedUrl) {
        return data.signedUrl;
      }

      // Graceful fallback to public URL if signed URL fails
      const { data: pubData } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      return pubData?.publicUrl || null;
    } catch (error) {
      console.warn("Photo URL resolution note:", error);
      return null;
    }
  }

  // --------------------------------------------------
  // DOWNLOAD ADMISSION PDF
  // --------------------------------------------------
  async function downloadAdmissionPDF(admission) {
    setPdfLoading(admission.id);

    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      let y = 20;

      // Header
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.text("MG CRICKETER'S DEN", pageWidth / 2, y, { align: "center" });

      y += 8;
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.text("OFFICIAL ACADEMY ADMISSION APPLICATION", pageWidth / 2, y, { align: "center" });

      y += 12;
      doc.setDrawColor(212, 160, 23);
      doc.line(15, y, pageWidth - 15, y);

      y += 10;

      // Photo
      let photoUrl = admission.signed_photo_url;
      if (!photoUrl && admission.photo_url) {
        photoUrl = await getSignedPhotoUrl(admission.photo_url);
      }

      if (photoUrl) {
        try {
          const response = await fetch(photoUrl);
          if (response.ok) {
            const blob = await response.blob();
            const reader = new FileReader();
            const imageData = await new Promise((resolve, reject) => {
              reader.onloadend = () => resolve(reader.result);
              reader.onerror = reject;
              reader.readAsDataURL(blob);
            });

            const imageFormat = blob.type?.toLowerCase().includes("png") ? "PNG" : "JPEG";
            doc.addImage(imageData, imageFormat, pageWidth - 55, y, 35, 42);
          }
        } catch (photoError) {
          console.warn("Could not load photo for PDF:", photoError);
        }
      }

      // Student Details
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.text("Student Details", 15, y);
      y += 8;

      doc.setFontSize(10);
      const studentDetails = [
        ["Full Name", admission.full_name],
        ["Date of Birth", formatDate(admission.dob)],
        ["Gender", admission.gender],
        ["Blood Group", admission.blood_group],
        ["Aadhaar Number", admission.aadhaar_number]
      ];

      studentDetails.forEach(([label, value]) => {
        doc.setFont("helvetica", "bold");
        doc.text(`${label}:`, 15, y);
        doc.setFont("helvetica", "normal");
        doc.text(String(value || "-"), 55, y);
        y += 6;
      });

      y += 5;

      // Parent Details
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.text("Parent / Guardian Details", 15, y);
      y += 8;

      const parentName =
        admission.parent_type === "Guardian"
          ? admission.guardian_name
          : `Father: ${admission.father_name || "-"} | Mother: ${admission.mother_name || "-"}`;

      const parentDetails = [
        ["Type", admission.parent_type],
        ["Name", parentName],
        ["Phone", admission.phone],
        ["WhatsApp", admission.whatsapp],
        ["Address", admission.address]
      ];

      parentDetails.forEach(([label, value]) => {
        doc.setFont("helvetica", "bold");
        doc.text(`${label}:`, 15, y);
        doc.setFont("helvetica", "normal");
        const text = String(value || "-");
        const lines = doc.splitTextToSize(text, 130);
        doc.text(lines, 55, y);
        y += Math.max(6, lines.length * 5);
      });

      y += 5;

      // Cricket Details
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.text("Cricket Training Profile", 15, y);
      y += 8;

      const cricketDetails = [
        ["Playing Category", admission.playing_category],
        ["Batting Style", admission.batting_style],
        ["Bowling Style", admission.bowling_style],
        ["Batch Selected", admission.batch_name],
        ["Joining Date", formatDate(admission.joining_date)],
        ["Fee Status", `INR ${admission.fee_amount || "-"} (${admission.status || "Submitted"})`]
      ];

      cricketDetails.forEach(([label, value]) => {
        doc.setFont("helvetica", "bold");
        doc.text(`${label}:`, 15, y);
        doc.setFont("helvetica", "normal");
        doc.text(String(value || "-"), 55, y);
        y += 6;
      });

      // Footer notice
      y += 12;
      doc.setFontSize(8);
      doc.setTextColor(120, 120, 120);
      doc.text("MG Cricketer's Den • Puducherry • Contact: +91 83008 79748 • mgcricketersden@gmail.com", pageWidth / 2, y, { align: "center" });

      doc.save(`MG_Admission_${admission.full_name?.replace(/\s+/g, "_") || "Application"}.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setPdfLoading(null);
    }
  }

  function getStatusClass(status) {
    const s = String(status || "").toLowerCase();
    if (s.includes("confirm") || s.includes("approv") || s.includes("paid")) return "status-confirmed";
    if (s.includes("cancel") || s.includes("reject")) return "status-cancelled";
    return "status-requested";
  }

  const confirmedBookingsCount = bookings.filter((b) =>
    String(b.status).toLowerCase().includes("confirm")
  ).length;

  return (
    <main className="dashboard-page">
      {/* -------------------------------------------------------------
          1. EXECUTIVE ATHLETE BANNER & HEADER
          ------------------------------------------------------------- */}
      <div className="pro-dashboard-header">
        <div className="header-left-col">
          <div className="athlete-avatar-box">
            <span className="athlete-avatar-icon">🏏</span>
            <span className="athlete-online-dot"></span>
          </div>

          <div className="athlete-welcome-text">
            <div className="athlete-tier-pill">
              <span className="pill-dot"></span>
              <span>DEN MEMBER DASHBOARD</span>
            </div>
            <h1 className="athlete-name">Welcome, {name}</h1>
            <div className="athlete-meta-row">
              <span>✉️ {email}</span>
              <span className="meta-sep">•</span>
              <span>📞 {phone}</span>
            </div>
          </div>
        </div>

        <div className="header-actions-col">
          <button
            type="button"
            className="dash-action-btn gold-primary-btn"
            onClick={() => (onNavigate ? onNavigate("booking") : onBack())}
          >
            🏏 Book Turf
          </button>
          <button
            type="button"
            className="dash-action-btn secondary-btn"
            onClick={onBack}
          >
            ← Back to Home
          </button>
        </div>
      </div>

      {/* -------------------------------------------------------------
          2. KPI METRICS STRIP (4 STATS CARDS)
          ------------------------------------------------------------- */}
      <div className="dashboard-kpi-grid">
        <div className="kpi-card" onClick={() => setActiveTab("bookings")}>
          <div className="kpi-icon-box gold-icon">🏟️</div>
          <div className="kpi-info">
            <span className="kpi-label">TOTAL BOOKINGS</span>
            <strong className="kpi-value">{bookings.length}</strong>
            <small className="kpi-subtext">{confirmedBookingsCount} Confirmed Slots</small>
          </div>
        </div>

        <div className="kpi-card" onClick={() => setActiveTab("admissions")}>
          <div className="kpi-icon-box blue-icon">🎓</div>
          <div className="kpi-info">
            <span className="kpi-label">ADMISSIONS</span>
            <strong className="kpi-value">{admissions.length}</strong>
            <small className="kpi-subtext">Academy Applications</small>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-box green-icon">⚡</div>
          <div className="kpi-info">
            <span className="kpi-label">FACILITY ACCESS</span>
            <strong className="kpi-value">Active</strong>
            <small className="kpi-subtext">Thengaithittu & Royapudupakkam</small>
          </div>
        </div>

        <div className="kpi-card support-kpi">
          <div className="kpi-icon-box emerald-icon">💬</div>
          <div className="kpi-info">
            <span className="kpi-label">DIRECT SUPPORT</span>
            <strong className="kpi-value">WhatsApp</strong>
            <a
              href="https://wa.me/918300879748"
              target="_blank"
              rel="noopener noreferrer"
              className="kpi-link"
            >
              +91 83008 79748 →
            </a>
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------
          3. DASHBOARD FILTER TABS
          ------------------------------------------------------------- */}
      <div className="dashboard-tabs-bar">
        <button
          type="button"
          className={`dash-tab ${activeTab === "all" ? "active" : ""}`}
          onClick={() => setActiveTab("all")}
        >
          <span>All Records</span>
          <span className="tab-count">{bookings.length + admissions.length}</span>
        </button>

        <button
          type="button"
          className={`dash-tab ${activeTab === "bookings" ? "active" : ""}`}
          onClick={() => setActiveTab("bookings")}
        >
          <span>🏟️ Turf Bookings</span>
          <span className="tab-count">{bookings.length}</span>
        </button>

        <button
          type="button"
          className={`dash-tab ${activeTab === "admissions" ? "active" : ""}`}
          onClick={() => setActiveTab("admissions")}
        >
          <span>🎓 Admissions</span>
          <span className="tab-count">{admissions.length}</span>
        </button>

        <button
          type="button"
          className={`dash-tab ${activeTab === "profile" ? "active" : ""}`}
          onClick={() => setActiveTab("profile")}
        >
          <span>👤 Profile Info</span>
        </button>
      </div>

      {/* -------------------------------------------------------------
          4. MAIN CONTENT PANELS
          ------------------------------------------------------------- */}
      {loading ? (
        <div className="dashboard-loading-state">
          <div className="gold-spinner"></div>
          <p>Loading your sports profile & bookings...</p>
        </div>
      ) : (
        <div className="dashboard-content-grid">
          {/* PROFILE SUMMARY TAB */}
          {activeTab === "profile" && (
            <div className="dashboard-card profile-full-card">
              <div className="dash-card-header">
                <h3>👤 Athlete Account Information</h3>
                <span className="profile-active-tag">Active Account</span>
              </div>
              <div className="profile-fields-grid">
                <div className="field-block">
                  <label>Full Name</label>
                  <strong>{name}</strong>
                </div>
                <div className="field-block">
                  <label>Primary Email</label>
                  <strong>{email}</strong>
                </div>
                <div className="field-block">
                  <label>Phone Number</label>
                  <strong>{phone}</strong>
                </div>
                <div className="field-block">
                  <label>Home Academy</label>
                  <strong>MG Cricketer's Den (Puducherry)</strong>
                </div>
              </div>
            </div>
          )}

          {/* TURF BOOKINGS SECTION */}
          {(activeTab === "all" || activeTab === "bookings") && (
            <section className="dashboard-card">
              <div className="dash-card-header">
                <div>
                  <span className="eyebrow">PRACTICE NETS & MATCH GROUND</span>
                  <h3>🏟️ My Turf & Net Bookings</h3>
                </div>
                <span className="count-pill">{bookings.length} Bookings</span>
              </div>

              {bookings.length === 0 ? (
                <div className="dash-empty-state">
                  <span className="empty-emoji">🏟️</span>
                  <h4>No Turf Bookings Found</h4>
                  <p>You haven't reserved any practice nets or ground slots yet.</p>
                  <button
                    type="button"
                    className="empty-cta-btn"
                    onClick={() => (onNavigate ? onNavigate("booking") : onBack())}
                  >
                    🏏 Book a Turf Slot Now
                  </button>
                </div>
              ) : (
                <div className="records-list">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="record-item">
                      <div className="record-left">
                        <div className="record-icon-badge">🏟️</div>
                        <div className="record-details">
                          <h4>{getTurfName(booking.turf_id)}</h4>
                          <div className="record-meta-pills">
                            <span className="meta-pill date-pill">
                              📅 {formatDate(booking.booking_date)}
                            </span>
                            <span className="meta-pill time-pill">
                              ⏰ {formatTime(booking.start_time)} – {formatTime(booking.end_time)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="record-right">
                        <span className={`status-pill ${getStatusClass(booking.status)}`}>
                          {booking.status || "Requested"}
                        </span>
                        <span className="payment-pill">
                          💳 {booking.payment_status || "Payment Pending"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* ADMISSION APPLICATIONS SECTION */}
          {(activeTab === "all" || activeTab === "admissions") && (
            <section className="dashboard-card">
              <div className="dash-card-header">
                <div>
                  <span className="eyebrow">ACADEMY ENROLLMENT</span>
                  <h3>🎓 My Admission Applications</h3>
                </div>
                <span className="count-pill">{admissions.length} Applications</span>
              </div>

              {admissions.length === 0 ? (
                <div className="dash-empty-state">
                  <span className="empty-emoji">📝</span>
                  <h4>No Admission Applications</h4>
                  <p>Apply to join MG Cricketer's Den training batches and professional programs.</p>
                  <button
                    type="button"
                    className="empty-cta-btn"
                    onClick={() => (onNavigate ? onNavigate("admission") : onBack())}
                  >
                    📝 Apply for Admission
                  </button>
                </div>
              ) : (
                <div className="records-list">
                  {admissions.map((admission) => (
                    <div key={admission.id} className="admission-record-item">
                      <div className="adm-left">
                        {admission.signed_photo_url ? (
                          <img
                            src={admission.signed_photo_url}
                            alt={admission.full_name}
                            className="adm-student-photo"
                          />
                        ) : (
                          <div className="adm-photo-fallback">👤</div>
                        )}

                        <div className="adm-info">
                          <h4>{admission.full_name}</h4>
                          <span className="adm-batch-tag">
                            🏆 {admission.batch_name || "Batch Training"}
                          </span>
                          <div className="adm-sub-details">
                            <span>🏏 {admission.playing_category || "Cricket Trainee"}</span>
                            <span>🗓️ Joining: {formatDate(admission.joining_date)}</span>
                            <span>💰 Fee: ₹{admission.fee_amount || "Standard"}</span>
                          </div>
                        </div>
                      </div>

                      <div className="adm-right">
                        <span className={`status-pill ${getStatusClass(admission.status)}`}>
                          {admission.status || "Submitted"}
                        </span>

                        <button
                          type="button"
                          className="pdf-download-btn"
                          onClick={() => downloadAdmissionPDF(admission)}
                          disabled={pdfLoading === admission.id}
                        >
                          {pdfLoading === admission.id ? (
                            "⏳ Generating PDF..."
                          ) : (
                            "📄 Download Application PDF"
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}
        </div>
      )}
    </main>
  );
}

export default DashboardPage;