import { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import { supabase } from "../lib/supabase";

function DashboardPage({ user, onBack }) {
  const [bookings, setBookings] = useState([]);
  const [admissions, setAdmissions] = useState([]);
  const [turfs, setTurfs] = useState([]);

  const [loading, setLoading] = useState(true);
  const [pdfLoading, setPdfLoading] = useState(null);

  const name =
    user?.user_metadata?.name ||
    user?.user_metadata?.full_name ||
    "User";

  const email = user?.email || "No email";

  const phone =
    user?.user_metadata?.phone ||
    "Not provided";

  // --------------------------------------------------
  // LOAD DASHBOARD DATA
  // --------------------------------------------------

  useEffect(() => {
    if (user?.id) {
      loadDashboard();
    }
  }, [user?.id]);

  async function loadDashboard() {
    setLoading(true);

    try {
      const [
        bookingsResult,
        admissionsResult,
        turfsResult
      ] = await Promise.all([
        supabase
          .from("bookings")
          .select("*")
          .eq("user_id", user.id)
          .order("booking_date", {
            ascending: false
          }),

        supabase
          .from("admissions")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", {
            ascending: false
          }),

        supabase
          .from("turfs")
          .select("id,name")
      ]);

      if (bookingsResult.error) {
        console.error(
          "BOOKINGS ERROR:",
          bookingsResult.error
        );
      }

      if (admissionsResult.error) {
        console.error(
          "ADMISSIONS ERROR:",
          admissionsResult.error
        );
      }

      if (turfsResult.error) {
        console.error(
          "TURFS ERROR:",
          turfsResult.error
        );
      }

      setBookings(
        bookingsResult.data || []
      );

      // ----------------------------------------------
      // GENERATE SIGNED PHOTO URLS
      // ----------------------------------------------

      const admissionsData =
        admissionsResult.data || [];

      const admissionsWithPhotos =
        await Promise.all(
          admissionsData.map(
            async (admission) => {

              let signedPhotoUrl = null;

              if (admission.photo_url) {
                signedPhotoUrl =
                  await getSignedPhotoUrl(
                    admission.photo_url
                  );
              }

              return {
                ...admission,
                signed_photo_url:
                  signedPhotoUrl
              };
            }
          )
        );

      setAdmissions(
        admissionsWithPhotos
      );

      setTurfs(
        turfsResult.data || []
      );

    } catch (error) {
      console.error(
        "DASHBOARD ERROR:",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  // --------------------------------------------------
  // TURF NAME
  // --------------------------------------------------

  function getTurfName(turfId) {
    const turf = turfs.find(
      (t) => t.id === turfId
    );

    return turf?.name || "Turf";
  }

  // --------------------------------------------------
  // FORMAT TIME
  // --------------------------------------------------

  function formatTime(time) {
    if (!time) return "-";

    const [hours, minutes] =
      time.split(":");

    const date = new Date();

    date.setHours(
      Number(hours),
      Number(minutes),
      0,
      0
    );

    return date.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit"
    });
  }

  // --------------------------------------------------
  // FORMAT DATE
  // --------------------------------------------------

  function formatDate(date) {
    if (!date) return "-";

    return new Date(
      date + "T00:00:00"
    ).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  }

  // --------------------------------------------------
  // PRIVATE STORAGE PHOTO
  // --------------------------------------------------

  async function getSignedPhotoUrl(photoPath) {
    if (!photoPath) {
      return null;
    }

    try {
      let bucket;
      let filePath;

      // --------------------------------------------
      // CASE 1
      // Stored as:
      // player-photos/test-player.jpg
      // --------------------------------------------

      if (
        !photoPath.startsWith("http://") &&
        !photoPath.startsWith("https://")
      ) {
        const parts =
          photoPath.split("/");

        bucket = parts[0];

        filePath =
          parts.slice(1).join("/");
      }

      // --------------------------------------------
      // CASE 2
      // Full Supabase storage URL
      // --------------------------------------------

      else {
        const marker =
          "/storage/v1/object/";

        const markerIndex =
          photoPath.indexOf(marker);

        if (markerIndex === -1) {
          return photoPath;
        }

        const storagePart =
          photoPath.substring(
            markerIndex + marker.length
          );

        // Handles:
        // public/bucket/file
        // sign/bucket/file
        // authenticated/bucket/file

        const parts =
          storagePart.split("/");

        parts.shift();

        bucket = parts.shift();

        filePath =
          parts.join("/");
      }

      if (!bucket || !filePath) {
        console.error(
          "Invalid photo path:",
          photoPath
        );

        return null;
      }

      // --------------------------------------------
      // CREATE SIGNED URL
      // Valid for 1 hour
      // --------------------------------------------

      const {
        data,
        error
      } = await supabase.storage
        .from(bucket)
        .createSignedUrl(
          filePath,
          60 * 60
        );

      if (error) {
        console.error(
          "SIGNED PHOTO ERROR:",
          error
        );

        return null;
      }

      return data?.signedUrl || null;

    } catch (error) {
      console.error(
        "PHOTO URL ERROR:",
        error
      );

      return null;
    }
  }

  // --------------------------------------------------
  // DOWNLOAD ADMISSION PDF
  // --------------------------------------------------

  async function downloadAdmissionPDF(
    admission
  ) {
    setPdfLoading(admission.id);

    try {
      const doc = new jsPDF();

      const pageWidth =
        doc.internal.pageSize.getWidth();

      const pageHeight =
        doc.internal.pageSize.getHeight();

      let y = 20;

      // ----------------------------------------------
      // HEADER
      // ----------------------------------------------

      doc.setFont(
        "helvetica",
        "bold"
      );

      doc.setFontSize(20);

      doc.text(
        "MG CRICKETERS DEN",
        pageWidth / 2,
        y,
        {
          align: "center"
        }
      );

      y += 8;

      doc.setFontSize(11);

      doc.setFont(
        "helvetica",
        "normal"
      );

      doc.text(
        "ACADEMY ADMISSION APPLICATION",
        pageWidth / 2,
        y,
        {
          align: "center"
        }
      );

      y += 12;

      doc.line(
        15,
        y,
        pageWidth - 15,
        y
      );

      y += 10;

      // ----------------------------------------------
      // PHOTO
      // ----------------------------------------------

      let photoUrl =
        admission.signed_photo_url;

      // If dashboard does not already have
      // the signed URL, generate one now.

      if (
        !photoUrl &&
        admission.photo_url
      ) {
        photoUrl =
          await getSignedPhotoUrl(
            admission.photo_url
          );
      }

      if (photoUrl) {
        try {
          const response =
            await fetch(photoUrl);

          if (!response.ok) {
            throw new Error(
              `Photo request failed: ${response.status}`
            );
          }

          const blob =
            await response.blob();

          const reader =
            new FileReader();

          const imageData =
            await new Promise(
              (resolve, reject) => {
                reader.onloadend =
                  () =>
                    resolve(
                      reader.result
                    );

                reader.onerror =
                  reject;

                reader.readAsDataURL(
                  blob
                );
              }
            );

          // Detect PNG/JPEG
          const imageFormat =
            blob.type
              ?.toLowerCase()
              .includes("png")
              ? "PNG"
              : "JPEG";

          doc.addImage(
            imageData,
            imageFormat,
            pageWidth - 55,
            y,
            35,
            42
          );

        } catch (photoError) {
          console.warn(
            "Could not load photo for PDF:",
            photoError
          );
        }
      }

      // ----------------------------------------------
      // STUDENT DETAILS
      // ----------------------------------------------

      doc.setFont(
        "helvetica",
        "bold"
      );

      doc.setFontSize(13);

      doc.text(
        "Student Details",
        15,
        y
      );

      y += 8;

      doc.setFontSize(10);

      doc.setFont(
        "helvetica",
        "normal"
      );

      const studentDetails = [
        [
          "Full Name",
          admission.full_name
        ],
        [
          "Date of Birth",
          formatDate(admission.dob)
        ],
        [
          "Gender",
          admission.gender
        ],
        [
          "Blood Group",
          admission.blood_group
        ],
        [
          "Aadhaar Number",
          admission.aadhaar_number
        ]
      ];

      studentDetails.forEach(
        ([label, value]) => {
          doc.setFont(
            "helvetica",
            "bold"
          );

          doc.text(
            `${label}:`,
            15,
            y
          );

          doc.setFont(
            "helvetica",
            "normal"
          );

          doc.text(
            String(value || "-"),
            55,
            y
          );

          y += 6;
        }
      );

      y += 5;

      // ----------------------------------------------
      // PARENT / GUARDIAN
      // ----------------------------------------------

      doc.setFont(
        "helvetica",
        "bold"
      );

      doc.setFontSize(13);

      doc.text(
        "Parent / Guardian",
        15,
        y
      );

      y += 8;

      doc.setFontSize(10);

      doc.setFont(
        "helvetica",
        "normal"
      );

      const parentName =
        admission.parent_type ===
        "Guardian"
          ? admission.guardian_name
          : `Father: ${
              admission.father_name ||
              "-"
            } | Mother: ${
              admission.mother_name ||
              "-"
            }`;

      const parentDetails = [
        [
          "Type",
          admission.parent_type
        ],
        [
          "Name",
          parentName
        ],
        [
          "Phone",
          admission.phone
        ],
        [
          "WhatsApp",
          admission.whatsapp
        ],
        [
          "Address",
          admission.address
        ]
      ];

      parentDetails.forEach(
        ([label, value]) => {
          doc.setFont(
            "helvetica",
            "bold"
          );

          doc.text(
            `${label}:`,
            15,
            y
          );

          doc.setFont(
            "helvetica",
            "normal"
          );

          const text =
            String(value || "-");

          const lines =
            doc.splitTextToSize(
              text,
              130
            );

          doc.text(
            lines,
            55,
            y
          );

          y += Math.max(
            6,
            lines.length * 5
          );
        }
      );

      y += 5;

      // ----------------------------------------------
      // CRICKET DETAILS
      // ----------------------------------------------

      doc.setFont(
        "helvetica",
        "bold"
      );

      doc.setFontSize(13);

      doc.text(
        "Cricket Details",
        15,
        y
      );

      y += 8;

      doc.setFontSize(10);

      doc.setFont(
        "helvetica",
        "normal"
      );

      const cricketDetails = [
        [
          "Playing Category",
          admission.playing_category
        ],
        [
          "Batting Style",
          admission.batting_style
        ],
        [
          "Bowling Style",
          admission.bowling_style
        ],
        [
          "Previous Academy",
          admission.previous_academy
        ],
        [
          "Playing Experience",
          admission.playing_experience
        ]
      ];

      cricketDetails.forEach(
        ([label, value]) => {
          doc.setFont(
            "helvetica",
            "bold"
          );

          doc.text(
            `${label}:`,
            15,
            y
          );

          doc.setFont(
            "helvetica",
            "normal"
          );

          doc.text(
            String(value || "-"),
            60,
            y
          );

          y += 6;
        }
      );

      y += 5;

      // ----------------------------------------------
      // BATCH DETAILS
      // ----------------------------------------------

      doc.setFont(
        "helvetica",
        "bold"
      );

      doc.setFontSize(13);

      doc.text(
        "Batch / Fee Details",
        15,
        y
      );

      y += 8;

      doc.setFontSize(10);

      doc.setFont(
        "helvetica",
        "normal"
      );

      const batchDetails = [
        [
          "Batch",
          admission.batch_name
        ],
        [
          "Fee",
          admission.fee_amount
            ? `₹${admission.fee_amount}`
            : "-"
        ],
        [
          "Joining Date",
          formatDate(
            admission.joining_date
          )
        ],
        [
          "Jersey Size",
          admission.jersey_size
        ]
      ];

      batchDetails.forEach(
        ([label, value]) => {
          doc.setFont(
            "helvetica",
            "bold"
          );

          doc.text(
            `${label}:`,
            15,
            y
          );

          doc.setFont(
            "helvetica",
            "normal"
          );

          doc.text(
            String(value || "-"),
            60,
            y
          );

          y += 6;
        }
      );

      y += 8;

      // ----------------------------------------------
      // DECLARATION
      // ----------------------------------------------

      doc.setFont(
        "helvetica",
        "bold"
      );

      doc.setFontSize(13);

      doc.text(
        "Declaration",
        15,
        y
      );

      y += 8;

      doc.setFont(
        "helvetica",
        "normal"
      );

      doc.setFontSize(10);

      const declaration =
        "I hereby confirm that the above details are true. I agree to follow the rules, discipline and training instructions of MG Cricketers Den.";

      const declarationLines =
        doc.splitTextToSize(
          declaration,
          pageWidth - 30
        );

      doc.text(
        declarationLines,
        15,
        y
      );

      y +=
        declarationLines.length *
          5 +
        20;

      // ----------------------------------------------
      // SIGNATURES
      // ----------------------------------------------

      const signatureY =
        Math.min(
          y,
          pageHeight - 35
        );

      doc.line(
        20,
        signatureY,
        85,
        signatureY
      );

      doc.line(
        pageWidth - 85,
        signatureY,
        pageWidth - 20,
        signatureY
      );

      doc.setFontSize(9);

      doc.text(
        "Parent / Guardian Signature",
        20,
        signatureY + 6
      );

      doc.text(
        "Coach Signature",
        pageWidth - 85,
        signatureY + 6
      );

      // ----------------------------------------------
      // SAVE
      // ----------------------------------------------

      const safeName =
        (
          admission.full_name ||
          "admission"
        ).replace(
          /[^a-z0-9]/gi,
          "_"
        );

      doc.save(
        `${safeName}_Admission_Application.pdf`
      );

    } catch (error) {
      console.error(
        "PDF ERROR:",
        error
      );

      alert(
        "Unable to generate PDF."
      );

    } finally {
      setPdfLoading(null);
    }
  }

  // --------------------------------------------------
  // STATUS CLASS
  // --------------------------------------------------

  function statusClass(status) {
    if (!status) return "";

    return status
      .toLowerCase()
      .replace(/\s+/g, "-");
  }

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <main className="dashboard-page">

      {/* HEADER */}

      <div className="dashboard-header">

        <button
          className="back-button"
          onClick={onBack}
        >
          ← Back
        </button>

        <div>

          <p className="eyebrow">
            MY ACCOUNT
          </p>

          <h1>
            My Dashboard
          </h1>

          <p className="dashboard-subtitle">
            Manage your profile, bookings
            and academy applications.
          </p>

        </div>

      </div>


      {/* PROFILE */}

      <section className="dashboard-section profile-card">

        <div className="profile-avatar">
          👤
        </div>

        <div className="profile-info">

          <p className="card-label">
            ACCOUNT
          </p>

          <h2>{name}</h2>

          <div className="profile-details">

            <span>
              ✉️ {email}
            </span>

            <span>
              📱 {phone}
            </span>

          </div>

        </div>

      </section>


      {/* LOADING */}

      {loading ? (

        <div className="dashboard-loading">
          Loading your dashboard...
        </div>

      ) : (

        <>

          {/* BOOKINGS */}

          <section className="dashboard-section">

            <div className="section-heading">

              <div>

                <p className="eyebrow">
                  TURF
                </p>

                <h2>
                  My Turf Bookings
                </h2>

              </div>

              <span className="count-badge">
                {bookings.length}
              </span>

            </div>


            {bookings.length === 0 ? (

              <div className="empty-card">

                <span>🏟️</span>

                <h3>
                  No bookings yet
                </h3>

                <p>
                  Your turf booking requests
                  will appear here.
                </p>

              </div>

            ) : (

              <div className="booking-list">

                {bookings.map(
                  (booking) => (

                    <div
                      className="booking-card"
                      key={booking.id}
                    >

                      <div className="booking-main">

                        <div className="booking-icon">
                          🏟️
                        </div>

                        <div>

                          <h3>
                            {getTurfName(
                              booking.turf_id
                            )}
                          </h3>

                          <p>
                            {formatDate(
                              booking.booking_date
                            )}
                          </p>

                          <p className="booking-time">

                            {formatTime(
                              booking.start_time
                            )}

                            {" – "}

                            {formatTime(
                              booking.end_time
                            )}

                          </p>

                        </div>

                      </div>


                      <div className="booking-meta">

                        <span
                          className={`status-badge ${statusClass(
                            booking.status
                          )}`}
                        >
                          {booking.status ||
                            "Unknown"}
                        </span>

                        <span className="payment-status">

                          Payment:{" "}

                          {booking.payment_status ||
                            "Pending"}

                        </span>

                      </div>

                    </div>

                  )
                )}

              </div>

            )}

          </section>


          {/* ADMISSIONS */}

          <section className="dashboard-section">

            <div className="section-heading">

              <div>

                <p className="eyebrow">
                  ACADEMY
                </p>

                <h2>
                  My Admission Applications
                </h2>

              </div>

              <span className="count-badge">
                {admissions.length}
              </span>

            </div>


            {admissions.length === 0 ? (

              <div className="empty-card">

                <span>📝</span>

                <h3>
                  No applications yet
                </h3>

                <p>
                  Your academy admission
                  applications will appear here.
                </p>

              </div>

            ) : (

              <div className="admission-list">

                {admissions.map(
                  (admission) => (

                    <div
                      className="admission-card"
                      key={admission.id}
                    >

                      {/* PHOTO */}

                      <div className="admission-photo">

                        {admission.signed_photo_url ? (

                          <img
                            src={
                              admission.signed_photo_url
                            }
                            alt={
                              admission.full_name
                            }
                          />

                        ) : (

                          <div className="photo-placeholder">
                            👤
                          </div>

                        )}

                      </div>


                      {/* DETAILS */}

                      <div className="admission-info">

                        <div className="admission-top">

                          <div>

                            <h3>
                              {
                                admission.full_name
                              }
                            </h3>

                            <p>
                              {admission.batch_name ||
                                "Batch not selected"}
                            </p>

                          </div>


                          <span
                            className={`status-badge ${statusClass(
                              admission.status
                            )}`}
                          >

                            {admission.status ||
                              "Submitted"}

                          </span>

                        </div>


                        <div className="admission-details">

                          <span>
                            🏏{" "}
                            {
                              admission.playing_category ||
                              "-"
                            }
                          </span>

                          <span>
                            🗓️{" "}
                            {formatDate(
                              admission.joining_date
                            )}
                          </span>

                          <span>
                            💰 ₹
                            {admission.fee_amount ||
                              "-"}
                          </span>

                        </div>


                        {/* DOWNLOAD */}

                        <button
                          className="download-pdf-button"
                          onClick={() =>
                            downloadAdmissionPDF(
                              admission
                            )
                          }
                          disabled={
                            pdfLoading ===
                            admission.id
                          }
                        >

                          {pdfLoading ===
                          admission.id
                            ? "Generating PDF..."
                            : "📄 Download Application PDF"}

                        </button>

                      </div>

                    </div>

                  )
                )}

              </div>

            )}

          </section>

        </>

      )}

    </main>
  );
}

export default DashboardPage;