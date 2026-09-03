import { useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabase";
import { sendAdmissionToWhatsApp } from "../lib/whatsappConfig";
import { generateAdmissionPDF, calculateAge, formatDate } from "../lib/admissionPdfGenerator";
import "./AdmissionPage.css";

const DECLARATION =
  "I hereby confirm that the above details are true and accurate. I agree to follow the rules, discipline, uniform code, and training instructions of MG Cricketer's Den.";

function AdmissionPage({ user, onBack }) {
  const fileRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [batchesLoading, setBatchesLoading] = useState(true);
  const [batches, setBatches] = useState([]);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [photoPreview, setPhotoPreview] = useState("");
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const [form, setForm] = useState({
    full_name: "",
    dob: "",
    gender: "",
    blood_group: "",
    aadhaar_number: "",

    parent_type: "Parent", // "Parent" | "Guardian"
    father_name: "",
    mother_name: "",
    guardian_name: "",

    occupation: "",
    phone: "",
    whatsapp: "",
    sameWhatsapp: false,
    address: "",

    playing_category: "",
    batting_style: "",
    bowling_style: "",

    previous_academy: "",
    playing_experience: "",
    medical_injury_info: "",

    batch_fee_id: "",
    batch_name: "",
    fee_amount: "",

    joining_date: "",
    jersey_size: "",

    declaration_accepted: false,
  });

  useEffect(() => {
    loadBatches();
  }, []);

  async function loadBatches() {
    setBatchesLoading(true);
    try {
      const { data, error } = await supabase
        .from("batch_fees")
        .select("id,batch_name,fee_amount")
        .eq("is_active", true)
        .order("batch_name");

      if (error) {
        console.error("BATCH ERROR:", error);
        setError("Unable to load batches.");
      } else {
        setBatches(data || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setBatchesLoading(false);
    }
  }

  function updateField(field, value) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function handlePhoneChange(value) {
    setForm((prev) => ({
      ...prev,
      phone: value,
      whatsapp: prev.sameWhatsapp ? value : prev.whatsapp,
    }));
  }

  function handleSameWhatsapp(checked) {
    setForm((prev) => ({
      ...prev,
      sameWhatsapp: checked,
      whatsapp: checked ? prev.phone : "",
    }));
  }

  function handleParentType(type) {
    setForm((prev) => ({
      ...prev,
      parent_type: type,
      father_name: type === "Parent" ? prev.father_name : "",
      mother_name: type === "Parent" ? prev.mother_name : "",
      guardian_name: type === "Guardian" ? prev.guardian_name : "",
    }));
  }

  function handleBatchChange(batchId) {
    const batch = batches.find((item) => item.id === batchId);
    setForm((prev) => ({
      ...prev,
      batch_fee_id: batchId,
      batch_name: batch?.batch_name || "",
      fee_amount: batch?.fee_amount || "",
    }));
  }

  function handlePhotoChange(event) {
    const file = event.target.files?.[0];
    if (!file) {
      setPhotoPreview("");
      setSelectedPhoto(null);
      return;
    }

    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      setError("Photo must be JPG, PNG, or WebP.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Photo must be 5 MB or smaller.");
      event.target.value = "";
      return;
    }

    setError("");
    setSelectedPhoto(file);

    const reader = new FileReader();
    reader.onload = () => {
      setPhotoPreview(reader.result);
    };
    reader.readAsDataURL(file);
  }

  function validateForm() {
    if (!form.full_name.trim()) return "Please enter the player's full name.";
    if (!form.dob) return "Please select date of birth.";
    if (!form.gender) return "Please select gender.";
    if (!form.blood_group) return "Please select blood group.";
    if (!form.aadhaar_number.trim()) return "Please enter Aadhaar number.";

    if (form.parent_type === "Parent") {
      if (!form.father_name.trim()) return "Please enter father's name.";
      if (!form.mother_name.trim()) return "Please enter mother's name.";
    } else {
      if (!form.guardian_name.trim()) return "Please enter guardian's name.";
    }

    if (!form.occupation.trim()) return "Please enter occupation.";
    if (!form.phone.trim()) return "Please enter phone number.";
    if (!form.whatsapp.trim()) return "Please enter WhatsApp number.";
    if (!form.address.trim()) return "Please enter address.";

    if (!form.playing_category) return "Please select playing category.";
    if (!form.batting_style) return "Please select batting style.";
    if (!form.bowling_style) return "Please select bowling style.";

    if (!form.batch_fee_id) return "Please select a training batch.";
    if (!form.joining_date) return "Please select joining date.";
    if (!form.jersey_size) return "Please select jersey size.";

    if (!form.declaration_accepted) {
      return "You must accept the academy declaration before submitting.";
    }

    return null;
  }

  async function submitAdmission(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      window.scrollTo({ top: 180, behavior: "smooth" });
      return;
    }

    if (!user?.id) {
      setError("Please log in to submit your admission application.");
      return;
    }

    try {
      setLoading(true);

      // 1. Upload photo if selected
      let photoUrlToSave = null;
      if (selectedPhoto) {
        const extension = (selectedPhoto.name.split(".").pop() || "jpg").toLowerCase();
        const photoPath = `${user.id}/admission-${Date.now()}.${extension}`;

        let uploadSuccess = false;
        let bucketUsed = "admission-photos";

        const { error: uploadError } = await supabase.storage
          .from("admission-photos")
          .upload(photoPath, selectedPhoto, {
            contentType: selectedPhoto.type || "image/jpeg",
            upsert: true,
          });

        if (!uploadError) {
          uploadSuccess = true;
        } else {
          console.warn("admission-photos upload notice:", uploadError);
          // Fallback try player-photos bucket
          const { error: fbErr } = await supabase.storage
            .from("player-photos")
            .upload(photoPath, selectedPhoto, {
              contentType: selectedPhoto.type || "image/jpeg",
              upsert: true,
            });
          if (!fbErr) {
            uploadSuccess = true;
            bucketUsed = "player-photos";
          }
        }

        if (uploadSuccess) {
          const { data: pubData } = supabase.storage.from(bucketUsed).getPublicUrl(photoPath);
          photoUrlToSave = pubData?.publicUrl || `${bucketUsed}/${photoPath}`;
        } else {
          // If storage bucket upload is not configured, save base64 directly so photo is never lost!
          photoUrlToSave = photoPreview || null;
        }
      }

      // 2. Determine valid parent_type matching DB check constraint ('Father', 'Mother', 'Guardian')
      let dbParentType = "Father";
      if (form.parent_type === "Guardian") {
        dbParentType = "Guardian";
      } else if (form.parent_type === "Mother" || (!form.father_name.trim() && form.mother_name.trim())) {
        dbParentType = "Mother";
      } else {
        dbParentType = "Father";
      }

      // 3. Insert admission into database
      const admission = {
        user_id: user.id,
        full_name: form.full_name.trim(),
        dob: form.dob,
        gender: form.gender,
        blood_group: form.blood_group,
        aadhaar_number: form.aadhaar_number.trim(),
        photo_url: photoUrlToSave,

        parent_type: dbParentType,
        father_name: form.parent_type === "Parent" ? form.father_name.trim() : null,
        mother_name: form.parent_type === "Parent" ? form.mother_name.trim() : null,
        guardian_name: form.parent_type === "Guardian" ? form.guardian_name.trim() : null,
        parent_guardian_occupation: form.occupation.trim(),

        phone: form.phone.trim(),
        whatsapp: form.whatsapp.trim(),
        address: form.address.trim(),

        playing_category: form.playing_category,
        batting_style: form.batting_style,
        bowling_style: form.bowling_style,
        previous_academy: form.previous_academy.trim(),
        playing_experience: form.playing_experience.trim(),
        medical_injury_info: form.medical_injury_info.trim(),

        batch_fee_id: form.batch_fee_id,
        batch_name: form.batch_name,
        fee_amount: Number(form.fee_amount) || 0,
        joining_date: form.joining_date,
        jersey_size: form.jersey_size,
        declaration_accepted: true,
        status: "submitted",
      };

      const { data: insertedData, error: insertError } = await supabase
        .from("admissions")
        .insert(admission)
        .select()
        .single();

      if (insertError) {
        throw new Error(insertError.message);
      }

      // 4. Trigger WhatsApp Notification
      try {
        await sendAdmissionToWhatsApp({
          fullName: admission.full_name,
          phone: admission.phone,
          whatsapp: admission.whatsapp,
          batchName: admission.batch_name,
          feeAmount: admission.fee_amount,
          joiningDate: admission.joining_date,
          playingCategory: admission.playing_category,
        });
      } catch (waError) {
        console.warn("WhatsApp notification note:", waError);
      }

      // 5. Generate & Download Official Executive Admission PDF
      try {
        await generateAdmissionPDF({
          admission: insertedData || admission,
          photoDataOrUrl: photoPreview || photoUrlToSave,
        });
      } catch (pdfError) {
        console.warn("PDF generation note:", pdfError);
      }

      setSuccess("Your admission application has been submitted successfully! An official PDF copy has been generated and downloaded.");

      // Reset form
      setForm({
        full_name: "",
        dob: "",
        gender: "",
        blood_group: "",
        aadhaar_number: "",
        parent_type: "Parent",
        father_name: "",
        mother_name: "",
        guardian_name: "",
        occupation: "",
        phone: "",
        whatsapp: "",
        sameWhatsapp: false,
        address: "",
        playing_category: "",
        batting_style: "",
        bowling_style: "",
        previous_academy: "",
        playing_experience: "",
        medical_injury_info: "",
        batch_fee_id: "",
        batch_name: "",
        fee_amount: "",
        joining_date: "",
        jersey_size: "",
        declaration_accepted: false,
      });

      setPhotoPreview("");
      setSelectedPhoto(null);
      if (fileRef.current) fileRef.current.value = "";
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("ADMISSION SUBMISSION ERROR:", err);
      setError(err?.message || "Unable to submit admission application.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="adm-page-wrapper">
      {/* ============================================================
          1. HERO HEADER BANNER
          ============================================================ */}
      <section className="adm-hero-section">
        <div className="adm-hero-container">
          <div className="adm-hero-top-nav">
            <button type="button" className="adm-back-btn" onClick={onBack}>
              ← Back to Home
            </button>
            <div className="adm-live-badge">
              <span className="live-glow-dot"></span>
              <span>2026 ADMISSIONS OPEN</span>
            </div>
          </div>

          <div className="adm-hero-content">
            <span className="adm-hero-eyebrow">MG CRICKETER'S DEN ACADEMY</span>
            <h1 className="adm-hero-title">
              OFFICIAL <span className="adm-gold-glow">ADMISSION FORM</span>
            </h1>
            <p className="adm-hero-sub">
              Take the next step in your cricket career. Complete your enrollment application for structured coaching, modern turf practice, and match preparation.
            </p>
          </div>

          {/* ROADMAP PROGRESS INDICATOR */}
          <div className="adm-roadmap-bar">
            <div className="roadmap-step active">
              <span className="step-num">01</span>
              <span className="step-txt">Personal</span>
            </div>
            <div className="roadmap-sep">→</div>
            <div className="roadmap-step active">
              <span className="step-num">02</span>
              <span className="step-txt">Parent</span>
            </div>
            <div className="roadmap-sep">→</div>
            <div className="roadmap-step active">
              <span className="step-num">03</span>
              <span className="step-txt">Cricket</span>
            </div>
            <div className="roadmap-sep">→</div>
            <div className="roadmap-step active">
              <span className="step-num">04</span>
              <span className="step-txt">Batch</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          2. FORM CONTAINER
          ============================================================ */}
      <section className="adm-form-body">
        <div className="adm-form-container">
          {error && (
            <div className="adm-alert-box adm-alert-error">
              <span>⚠️</span>
              <p>{error}</p>
            </div>
          )}

          {success && (
            <div className="adm-alert-box adm-alert-success">
              <span>✅</span>
              <div>
                <h4>Application Submitted Successfully!</h4>
                <p>{success}</p>
              </div>
            </div>
          )}

          <form onSubmit={submitAdmission} className="adm-main-form">
            {/* --------------------------------------------------------
                SECTION 01: PERSONAL DETAILS & PHOTO
                -------------------------------------------------------- */}
            <div className="adm-card-section">
              <div className="adm-card-header">
                <span className="card-step-badge">01</span>
                <div>
                  <h3>Personal Details & Player Photo</h3>
                  <p>Provide the player's identification, age, and passport-size photo.</p>
                </div>
              </div>

              <div className="adm-personal-layout">
                {/* PHOTO UPLOADER */}
                <div className="adm-photo-col">
                  <div className="adm-photo-frame">
                    {photoPreview ? (
                      <img src={photoPreview} alt="Player Preview" className="adm-uploaded-img" />
                    ) : (
                      <div className="adm-photo-empty">
                        <span className="cam-icon">📷</span>
                        <strong>Passport Photo</strong>
                        <small>JPG, PNG or WebP</small>
                      </div>
                    )}
                  </div>

                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handlePhotoChange}
                    style={{ display: "none" }}
                  />

                  <button
                    type="button"
                    className="adm-upload-trigger-btn"
                    onClick={() => fileRef.current?.click()}
                  >
                    {photoPreview ? "Change Photo 📷" : "Upload Photo 📷"}
                  </button>
                  <span className="adm-file-note">Max 5 MB file size</span>
                </div>

                {/* FIELDS */}
                <div className="adm-fields-grid">
                  <div className="adm-input-group">
                    <label>Full Name *</label>
                    <input
                      type="text"
                      placeholder="Enter player's full name"
                      value={form.full_name}
                      onChange={(e) => updateField("full_name", e.target.value)}
                      required
                    />
                  </div>

                  <div className="adm-input-group">
                    <label>Date of Birth *</label>
                    <input
                      type="date"
                      value={form.dob}
                      onChange={(e) => updateField("dob", e.target.value)}
                      required
                    />
                  </div>

                  <div className="adm-input-group">
                    <label>Age (Auto-calculated from DOB)</label>
                    <div className="adm-age-calc-wrapper">
                      <input
                        type="text"
                        value={calculateAge(form.dob) ? `${calculateAge(form.dob)} Years Old` : "Auto-calculated from DOB"}
                        readOnly
                        className="adm-readonly-input adm-age-field"
                      />
                      {calculateAge(form.dob) ? (
                        <span className="adm-age-badge-pill">✓ {calculateAge(form.dob)} Yrs</span>
                      ) : null}
                    </div>
                  </div>

                  <div className="adm-input-group">
                    <label>Gender *</label>
                    <select
                      value={form.gender}
                      onChange={(e) => updateField("gender", e.target.value)}
                      required
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="adm-input-group">
                    <label>Blood Group *</label>
                    <select
                      value={form.blood_group}
                      onChange={(e) => updateField("blood_group", e.target.value)}
                      required
                    >
                      <option value="">Select Blood Group</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>

                  <div className="adm-input-group">
                    <label>Aadhaar Number *</label>
                    <input
                      type="text"
                      placeholder="12-digit Aadhaar number"
                      maxLength={14}
                      value={form.aadhaar_number}
                      onChange={(e) => updateField("aadhaar_number", e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* --------------------------------------------------------
                SECTION 02: PARENT / GUARDIAN
                -------------------------------------------------------- */}
            <div className="adm-card-section">
              <div className="adm-card-header">
                <span className="card-step-badge">02</span>
                <div>
                  <h3>Parent / Guardian Information</h3>
                  <p>Contact and emergency information for official correspondence.</p>
                </div>
              </div>

              {/* TOGGLE PARENT VS GUARDIAN */}
              <div className="adm-type-toggle-row">
                <button
                  type="button"
                  className={`adm-toggle-btn ${form.parent_type === "Parent" ? "active" : ""}`}
                  onClick={() => handleParentType("Parent")}
                >
                  👨‍👩‍👧 Parents
                </button>
                <button
                  type="button"
                  className={`adm-toggle-btn ${form.parent_type === "Guardian" ? "active" : ""}`}
                  onClick={() => handleParentType("Guardian")}
                >
                  🛡️ Guardian
                </button>
              </div>

              <div className="adm-fields-grid">
                {form.parent_type === "Parent" ? (
                  <>
                    <div className="adm-input-group">
                      <label>Father's Name *</label>
                      <input
                        type="text"
                        placeholder="Enter father's name"
                        value={form.father_name}
                        onChange={(e) => updateField("father_name", e.target.value)}
                        required
                      />
                    </div>
                    <div className="adm-input-group">
                      <label>Mother's Name *</label>
                      <input
                        type="text"
                        placeholder="Enter mother's name"
                        value={form.mother_name}
                        onChange={(e) => updateField("mother_name", e.target.value)}
                        required
                      />
                    </div>
                  </>
                ) : (
                  <div className="adm-input-group span-two">
                    <label>Guardian's Name *</label>
                    <input
                      type="text"
                      placeholder="Enter legal guardian's name"
                      value={form.guardian_name}
                      onChange={(e) => updateField("guardian_name", e.target.value)}
                      required
                    />
                  </div>
                )}

                <div className="adm-input-group">
                  <label>Parent / Guardian Occupation *</label>
                  <input
                    type="text"
                    placeholder="e.g. Business, Engineer, Doctor"
                    value={form.occupation}
                    onChange={(e) => updateField("occupation", e.target.value)}
                    required
                  />
                </div>

                <div className="adm-input-group">
                  <label>Contact Phone Number *</label>
                  <input
                    type="tel"
                    placeholder="Primary contact phone"
                    value={form.phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    required
                  />
                </div>

                <div className="adm-input-group">
                  <div className="label-with-check">
                    <label>WhatsApp Number *</label>
                    <label className="inline-checkbox">
                      <input
                        type="checkbox"
                        checked={form.sameWhatsapp}
                        onChange={(e) => handleSameWhatsapp(e.target.checked)}
                      />
                      <span>Same as Phone</span>
                    </label>
                  </div>
                  <input
                    type="tel"
                    placeholder="WhatsApp contact number"
                    value={form.whatsapp}
                    onChange={(e) => updateField("whatsapp", e.target.value)}
                    disabled={form.sameWhatsapp}
                    required
                  />
                </div>

                <div className="adm-input-group span-full">
                  <label>Residential Address *</label>
                  <textarea
                    rows="2"
                    placeholder="Enter complete permanent / local residential address..."
                    value={form.address}
                    onChange={(e) => updateField("address", e.target.value)}
                    required
                  ></textarea>
                </div>
              </div>
            </div>

            {/* --------------------------------------------------------
                SECTION 03: PLAYING PROFICIENCY
                -------------------------------------------------------- */}
            <div className="adm-card-section">
              <div className="adm-card-header">
                <span className="card-step-badge">03</span>
                <div>
                  <h3>Cricket Profile & Proficiency</h3>
                  <p>Tell our coaching panel about the player's role, batting & bowling styles.</p>
                </div>
              </div>

              <div className="adm-fields-grid">
                <div className="adm-input-group">
                  <label>Playing Category *</label>
                  <select
                    value={form.playing_category}
                    onChange={(e) => updateField("playing_category", e.target.value)}
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="Top-order Batsman">Top-order Batsman</option>
                    <option value="Middle-order Batsman">Middle-order Batsman</option>
                    <option value="Fast Bowler">Fast Bowler</option>
                    <option value="Spin Bowler">Spin Bowler</option>
                    <option value="All-rounder">All-rounder (Batting/Bowling)</option>
                    <option value="Wicketkeeper Batsman">Wicketkeeper Batsman</option>
                  </select>
                </div>

                <div className="adm-input-group">
                  <label>Batting Style *</label>
                  <select
                    value={form.batting_style}
                    onChange={(e) => updateField("batting_style", e.target.value)}
                    required
                  >
                    <option value="">Select Batting Style</option>
                    <option value="Right Hand Bat">Right Hand Bat</option>
                    <option value="Left Hand Bat">Left Hand Bat</option>
                  </select>
                </div>

                <div className="adm-input-group">
                  <label>Bowling Style *</label>
                  <select
                    value={form.bowling_style}
                    onChange={(e) => updateField("bowling_style", e.target.value)}
                    required
                  >
                    <option value="">Select Bowling Style</option>
                    <option value="Right-arm Fast">Right-arm Fast</option>
                    <option value="Right-arm Medium">Right-arm Medium</option>
                    <option value="Right-arm Off Spin">Right-arm Off Spin</option>
                    <option value="Right-arm Leg Spin">Right-arm Leg Spin</option>
                    <option value="Left-arm Fast">Left-arm Fast</option>
                    <option value="Left-arm Orthodox Spin">Left-arm Orthodox Spin</option>
                    <option value="Left-arm Chinaman">Left-arm Chinaman</option>
                    <option value="None / Wicketkeeper">None / Pure Wicketkeeper</option>
                  </select>
                </div>

                <div className="adm-input-group">
                  <label>Previous Academy / School Club (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. School Cricket Team / Previous Academy"
                    value={form.previous_academy}
                    onChange={(e) => updateField("previous_academy", e.target.value)}
                  />
                </div>

                <div className="adm-input-group span-two">
                  <label>Playing Experience / Tournaments (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. 2 years district tournaments / school league"
                    value={form.playing_experience}
                    onChange={(e) => updateField("playing_experience", e.target.value)}
                  />
                </div>

                <div className="adm-input-group span-full">
                  <label>Medical History / Injuries / Allergies (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. None or past shoulder injury, asthma, etc."
                    value={form.medical_injury_info}
                    onChange={(e) => updateField("medical_injury_info", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* --------------------------------------------------------
                SECTION 04: TRAINING DETAILS & FEES
                -------------------------------------------------------- */}
            <div className="adm-card-section">
              <div className="adm-card-header">
                <span className="card-step-badge">04</span>
                <div>
                  <h3>Training Batch & Jersey Size</h3>
                  <p>Choose your preferred coaching schedule and uniform details.</p>
                </div>
              </div>

              <div className="adm-fields-grid">
                <div className="adm-input-group">
                  <label>Select Training Batch *</label>
                  <select
                    value={form.batch_fee_id}
                    onChange={(e) => handleBatchChange(e.target.value)}
                    disabled={batchesLoading}
                    required
                  >
                    <option value="">
                      {batchesLoading ? "Loading available batches..." : "Select Batch Schedule"}
                    </option>
                    {batches.map((batch) => (
                      <option key={batch.id} value={batch.id}>
                        {batch.batch_name} — ₹{batch.fee_amount}
                      </option>
                    ))}
                  </select>

                  {form.fee_amount !== "" && (
                    <div className="adm-fee-badge">
                      <span>Monthly Training Fee:</span>
                      <strong>₹{form.fee_amount}</strong>
                    </div>
                  )}
                </div>

                <div className="adm-input-group">
                  <label>Desired Joining Date *</label>
                  <input
                    type="date"
                    value={form.joining_date}
                    onChange={(e) => updateField("joining_date", e.target.value)}
                    required
                  />
                </div>

                <div className="adm-input-group">
                  <label>Official Academy Jersey Size *</label>
                  <select
                    value={form.jersey_size}
                    onChange={(e) => updateField("jersey_size", e.target.value)}
                    required
                  >
                    <option value="">Select Jersey Size</option>
                    <option value="Kids 28 (Small)">Kids 28 (Small)</option>
                    <option value="Kids 32 (Medium)">Kids 32 (Medium)</option>
                    <option value="Youth 34 (Large)">Youth 34 (Large)</option>
                    <option value="S (Adult Small)">S (Adult Small)</option>
                    <option value="M (Adult Medium)">M (Adult Medium)</option>
                    <option value="L (Adult Large)">L (Adult Large)</option>
                    <option value="XL (Adult XL)">XL (Adult XL)</option>
                    <option value="XXL (Adult XXL)">XXL (Adult XXL)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* --------------------------------------------------------
                SECTION 05: CODE OF CONDUCT DECLARATION
                -------------------------------------------------------- */}
            <div className="adm-card-section declaration-section">
              <div className="adm-card-header">
                <span className="card-step-badge">05</span>
                <div>
                  <h3>Declaration & Discipline Agreement</h3>
                  <p>Read and accept the academy terms of admission.</p>
                </div>
              </div>

              <div className="adm-declaration-box">
                <p>"{DECLARATION}"</p>
              </div>

              <label className="adm-declaration-checkbox">
                <input
                  type="checkbox"
                  checked={form.declaration_accepted}
                  onChange={(e) => updateField("declaration_accepted", e.target.checked)}
                  required
                />
                <span>I have read, understood, and agree to the academy terms and code of conduct.</span>
              </label>
            </div>

            {/* --------------------------------------------------------
                SUBMISSION BUTTON
                -------------------------------------------------------- */}
            <div className="adm-submit-bar">
              <button type="submit" className="adm-submit-btn" disabled={loading}>
                {loading ? (
                  <span>⏳ Processing Admission Application...</span>
                ) : (
                  <span>🏏 Submit Official Admission Application →</span>
                )}
              </button>
              <p className="adm-submit-note">
                🔒 Your details are protected securely. Upon submission, an official PDF application form will be generated automatically.
              </p>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}

export default AdmissionPage;