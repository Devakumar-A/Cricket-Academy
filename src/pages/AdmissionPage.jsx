import { useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabase";
import jsPDF from "jspdf";

import "./AdmissionPage.css";

const DECLARATION =
  "I hereby confirm that the above details are true. I agree to follow the rules, discipline and training instructions of MG Cricketers Den.";

function calculateAge(dob) {
  if (!dob) return "";

  const birth = new Date(dob);
  const today = new Date();

  let age = today.getFullYear() - birth.getFullYear();

  const month = today.getMonth() - birth.getMonth();

  if (
    month < 0 ||
    (month === 0 && today.getDate() < birth.getDate())
  ) {
    age--;
  }

  return age >= 0 ? age : "";
}

function AdmissionPage({ user, onBack }) {
  const fileRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [batchesLoading, setBatchesLoading] = useState(true);
  const [batches, setBatches] = useState([]);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [photoPreview, setPhotoPreview] = useState("");

  const [form, setForm] = useState({
    full_name: "",
    dob: "",
    gender: "",
    blood_group: "",
    aadhaar_number: "",

    parent_type: "Father",

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

    const { data, error } = await supabase
      .from("batch_fees")
      .select("id,batch_name,fee_amount")
      .eq("is_active", true)
      .order("batch_name");

    if (error) {
      console.error("BATCH ERROR:", error);
      setError("Unable to load batches.");
      setBatchesLoading(false);
      return;
    }

    setBatches(data || []);
    setBatchesLoading(false);
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
      return;
    }

    const allowed = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowed.includes(file.type)) {
      setError("Photo must be JPG, PNG or WebP.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Photo must be 5 MB or smaller.");
      event.target.value = "";
      return;
    }

    setError("");

    const reader = new FileReader();

    reader.onload = () => {
      setPhotoPreview(reader.result);
    };

    reader.readAsDataURL(file);
  }

  function validateForm(photo) {
    if (!form.full_name.trim()) {
      return "Please enter the player's full name.";
    }

    if (!form.dob) {
      return "Please select date of birth.";
    }

    if (!form.gender) {
      return "Please select gender.";
    }

    if (!form.blood_group) {
      return "Please select blood group.";
    }

    if (!form.aadhaar_number.trim()) {
      return "Please enter Aadhaar number.";
    }

    if (form.parent_type === "Parent") {
      if (!form.father_name.trim()) {
        return "Please enter father's name.";
      }

      if (!form.mother_name.trim()) {
        return "Please enter mother's name.";
      }
    }

    if (form.parent_type === "Guardian") {
      if (!form.guardian_name.trim()) {
        return "Please enter guardian's name.";
      }
    }

    if (!form.occupation.trim()) {
      return "Please enter occupation.";
    }

    if (!form.phone.trim()) {
      return "Please enter phone number.";
    }

    if (!form.whatsapp.trim()) {
      return "Please enter WhatsApp number.";
    }

    if (!form.address.trim()) {
      return "Please enter address.";
    }

    if (!form.playing_category) {
      return "Please select playing category.";
    }

    if (!form.batting_style) {
      return "Please select batting style.";
    }

    if (!form.bowling_style) {
      return "Please select bowling style.";
    }

    if (!form.batch_fee_id) {
      return "Please select a batch.";
    }

    if (!form.joining_date) {
      return "Please select joining date.";
    }

    if (!form.jersey_size) {
      return "Please select jersey size.";
    }

    if (!photo) {
      return "Player photo is required.";
    }

    if (!form.declaration_accepted) {
      return "Please accept the declaration.";
    }

    return "";
  }

  async function submitAdmission() {
    setSuccess("");
    setError("");

    const photo = fileRef.current?.files?.[0];

    const validationError = validateForm(photo);

    if (validationError) {
      setError(validationError);
      return;
    }

    if (!user?.id) {
      setError("You must be logged in.");
      return;
    }

    try {
      setLoading(true);

      /*
       * 1. Upload photo
       */

      const extension =
        photo.name.split(".").pop().toLowerCase();

      const photoPath =
        `${user.id}/admission-${Date.now()}.${extension}`;

      const { error: uploadError } =
        await supabase.storage
          .from("admission-photos")
          .upload(photoPath, photo, {
            contentType: photo.type,
            upsert: false,
          });

      if (uploadError) {
        throw new Error(
          `Photo upload failed: ${uploadError.message}`
        );
      }

      /*
       * 2. Insert admission
       */

      const admission = {
        user_id: user.id,

        full_name: form.full_name.trim(),
        dob: form.dob,
        gender: form.gender,
        blood_group: form.blood_group,
        aadhaar_number: form.aadhaar_number.trim(),

        photo_url: photoPath,

        parent_type: form.parent_type,

        father_name:
          form.parent_type === "Parent"
            ? form.father_name.trim()
            : null,

        mother_name:
          form.parent_type === "Parent"
            ? form.mother_name.trim()
            : null,

        guardian_name:
          form.parent_type === "Guardian"
            ? form.guardian_name.trim()
            : null,

        parent_guardian_occupation:
          form.occupation.trim(),

        phone: form.phone.trim(),
        whatsapp: form.whatsapp.trim(),
        address: form.address.trim(),

        playing_category: form.playing_category,
        batting_style: form.batting_style,
        bowling_style: form.bowling_style,

        previous_academy:
          form.previous_academy.trim(),

        playing_experience:
          form.playing_experience.trim(),

        medical_injury_info:
          form.medical_injury_info.trim(),

        batch_fee_id: form.batch_fee_id,

        // Snapshot values
        batch_name: form.batch_name,
        fee_amount: Number(form.fee_amount),

        joining_date: form.joining_date,
        jersey_size: form.jersey_size,

        declaration_accepted: true,

        status: "submitted",

        is_active: false,
      };

      const { data, error: insertError } =
        await supabase
          .from("admissions")
          .insert(admission)
          .select()
          .single();

      if (insertError) {
        throw new Error(
          `Admission submission failed: ${insertError.message}`
        );
      }

      /*
       * 3. Generate PDF
       */

      await generatePDF({
        admission: {
          ...admission,
          id: data?.id,
        },
        photoData: photoPreview,
      });

      setSuccess(
        "Admission submitted successfully."
      );

      /*
       * 4. Reset form
       */

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

      if (fileRef.current) {
        fileRef.current.value = "";
      }
    } catch (err) {
      console.error(
        "ADMISSION SUBMISSION ERROR:",
        err
      );

      setError(
        err?.message ||
          "Unable to submit admission."
      );
    } finally {
      setLoading(false);
    }
  }

  async function generatePDF({ admission, photoData }) {
    const pdf = new jsPDF();

    const pageWidth =
      pdf.internal.pageSize.getWidth();

    const margin = 18;

    let y = 18;

    /*
     * Header
     */

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(18);

    pdf.text(
      "MG CRICKETERS DEN",
      pageWidth / 2,
      y,
      { align: "center" }
    );

    y += 8;

    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");

    pdf.text(
      "TRAIN • PLAY • EXCEL",
      pageWidth / 2,
      y,
      { align: "center" }
    );

    y += 10;

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(15);

    pdf.text(
      "ADMISSION FORM",
      pageWidth / 2,
      y,
      { align: "center" }
    );

    y += 8;

    pdf.line(
      margin,
      y,
      pageWidth - margin,
      y
    );

    y += 10;

    /*
     * Photo
     */

    if (photoData) {
      pdf.addImage(
        photoData,
        "JPEG",
        pageWidth - margin - 35,
        y,
        32,
        40
      );
    }

    function section(title) {
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(11);

      pdf.text(title, margin, y);

      y += 7;
    }

    function row(label, value) {
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(9);

      pdf.text(`${label}:`, margin, y);

      pdf.setFont("helvetica", "normal");

      const text =
        value === null ||
        value === undefined ||
        value === ""
          ? "-"
          : String(value);

      pdf.text(text, margin + 42, y);

      y += 6;
    }

    section("1. PERSONAL DETAILS");

    row("Full Name", admission.full_name);
    row("Date of Birth", admission.dob);
    row("Age", calculateAge(admission.dob));
    row("Gender", admission.gender);
    row("Blood Group", admission.blood_group);
    row(
      "Aadhaar Number",
      admission.aadhaar_number
    );

    y += 3;

    section("2. PARENT / GUARDIAN DETAILS");

    row("Type", admission.parent_type);

    if (admission.parent_type === "Parent") {
      row("Father Name", admission.father_name);
      row("Mother Name", admission.mother_name);
    } else {
      row(
        "Guardian Name",
        admission.guardian_name
      );
    }

    row(
      "Occupation",
      admission.parent_guardian_occupation
    );

    row("Phone", admission.phone);
    row("WhatsApp", admission.whatsapp);
    row("Address", admission.address);

    y += 3;

    section("3. PLAYING PROFICIENCY");

    row(
      "Playing Category",
      admission.playing_category
    );

    row(
      "Batting Style",
      admission.batting_style
    );

    row(
      "Bowling Style",
      admission.bowling_style
    );

    row(
      "Previous Academy / Club",
      admission.previous_academy
    );

    row(
      "Playing Experience",
      admission.playing_experience
    );

    row(
      "Medical / Injuries",
      admission.medical_injury_info
    );

    y += 3;

    section("4. TRAINING DETAILS");

    row("Batch", admission.batch_name);
    row("Fee", `₹${admission.fee_amount}`);
    row("Joining Date", admission.joining_date);
    row("Jersey Size", admission.jersey_size);

    y += 4;

    section("DECLARATION");

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);

    const declarationLines =
      pdf.splitTextToSize(
        DECLARATION,
        pageWidth - margin * 2
      );

    pdf.text(
      declarationLines,
      margin,
      y
    );

    y +=
      declarationLines.length * 5 + 12;

    /*
     * Signature section
     */

    const parentSignatureLabel =
      admission.parent_type === "Parent"
        ? "Parent Signature"
        : "Guardian Signature";

    const signatureWidth = 58;

    pdf.line(
      margin,
      y + 10,
      margin + signatureWidth,
      y + 10
    );

    pdf.line(
      pageWidth - margin - signatureWidth,
      y + 10,
      pageWidth - margin,
      y + 10
    );

    pdf.setFontSize(8);

    pdf.text(
      parentSignatureLabel,
      margin,
      y + 16
    );

    pdf.text(
      "Coach Signature",
      pageWidth -
        margin -
        signatureWidth,
      y + 16
    );

    pdf.setFontSize(8);

    pdf.text(
      "Date: __________________",
      margin,
      y + 24
    );

    pdf.text(
      "Date: __________________",
      pageWidth -
        margin -
        signatureWidth,
      y + 24
    );

    pdf.save(
      `Admission-${admission.full_name}.pdf`
    );
  }

  return (
    <div className="admission-page">

      <div className="admission-topbar">
        <button
          className="back-button"
          onClick={onBack}
        >
          ← Back
        </button>

        <div className="live-badge">
          <span></span>
          Admission
        </div>
      </div>

      <div className="admission-container">

        <div className="admission-heading">
          <div>
            <p className="eyebrow">
              MG CRICKETERS DEN
            </p>

            <h1>
              Academy Admission
            </h1>

            <p>
              Complete the application to
              join our cricket training program.
            </p>
          </div>

          <div className="heading-icon">
            🏏
          </div>
        </div>

        {error && (
          <div className="alert error">
            {error}
          </div>
        )}

        {success && (
          <div className="alert success">
            ✓ {success}
          </div>
        )}

        {/* PERSONAL */}

        <section className="form-section">

          <div className="section-title">
            <span>01</span>
            Personal Details
          </div>

          <div className="personal-layout">

            <div className="photo-area">

              <div className="photo-preview">
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="Player"
                  />
                ) : (
                  <div className="photo-placeholder">
                    <span>📷</span>
                    <small>
                      Player Photo
                    </small>
                  </div>
                )}
              </div>

              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handlePhotoChange}
                hidden
              />

              <button
                type="button"
                className="upload-button"
                onClick={() =>
                  fileRef.current?.click()
                }
              >
                Upload Photo
              </button>

              <small>
                JPG, PNG or WebP • Max 5 MB
              </small>

            </div>

            <div className="fields-grid">

              <Field
                label="Full Name"
                required
                value={form.full_name}
                onChange={(v) =>
                  updateField("full_name", v)
                }
              />

              <Field
                label="Date of Birth"
                type="date"
                required
                value={form.dob}
                onChange={(v) =>
                  updateField("dob", v)
                }
              />

              <div className="field">
                <label>Age</label>
                <input
                  value={
                    calculateAge(form.dob)
                  }
                  readOnly
                  placeholder="Auto"
                />
              </div>

              <Select
                label="Gender"
                required
                value={form.gender}
                onChange={(v) =>
                  updateField("gender", v)
                }
                options={[
                  "Male",
                  "Female",
                  "Other",
                ]}
              />

              <Select
                label="Blood Group"
                required
                value={form.blood_group}
                onChange={(v) =>
                  updateField(
                    "blood_group",
                    v
                  )
                }
                options={[
                  "A+",
                  "A-",
                  "B+",
                  "B-",
                  "AB+",
                  "AB-",
                  "O+",
                  "O-",
                ]}
              />

              <Field
                label="Aadhaar Number"
                required
                value={form.aadhaar_number}
                onChange={(v) =>
                  updateField(
                    "aadhaar_number",
                    v
                  )
                }
              />

            </div>
          </div>
        </section>

        {/* PARENT */}

        <section className="form-section">

          <div className="section-title">
            <span>02</span>
            Parent / Guardian
          </div>

          <div className="toggle">
            <button
                type="button"
                className={
                form.parent_type === "Father"
                    ? "active"
                    : ""
                }
                onClick={() => handleParentType("Father")}
            >
                Parent
            </button>

            <button
                type="button"
                className={
                form.parent_type === "Guardian"
                    ? "active"
                    : ""
                }
                onClick={() => handleParentType("Guardian")}
            >
                Guardian
            </button>
            </div>

            {form.parent_type === "Father" ? (
            <div className="fields-grid">

                <Field
                label="Father Name"
                required
                value={form.father_name}
                onChange={(v) =>
                    updateField("father_name", v)
                }
                />

                <Field
                label="Mother Name"
                required
                value={form.mother_name}
                onChange={(v) =>
                    updateField("mother_name", v)
                }
                />

            </div>
            ) : (
            <div className="fields-grid single">

                <Field
                label="Guardian Name"
                required
                value={form.guardian_name}
                onChange={(v) =>
                    updateField("guardian_name", v)
                }
                />

            </div>
            )}

          <div className="fields-grid">

            <Field
              label="Occupation"
              required
              value={form.occupation}
              onChange={(v) =>
                updateField(
                  "occupation",
                  v
                )
              }
            />

            <div className="field">
              <label>
                Phone Number
                <b>*</b>
              </label>

              <input
                type="tel"
                value={form.phone}
                onChange={(e) =>
                  handlePhoneChange(
                    e.target.value
                  )
                }
              />
            </div>

            <div className="field">
              <label>
                WhatsApp Number
                <b>*</b>
              </label>

              <input
                type="tel"
                value={form.whatsapp}
                onChange={(e) =>
                  updateField(
                    "whatsapp",
                    e.target.value
                  )
                }
                disabled={
                  form.sameWhatsapp
                }
              />

              <label className="checkbox-line">
                <input
                  type="checkbox"
                  checked={
                    form.sameWhatsapp
                  }
                  onChange={(e) =>
                    handleSameWhatsapp(
                      e.target.checked
                    )
                  }
                />

                Same as phone number
              </label>
            </div>

          </div>

          <div className="field">
            <label>
              Address <b>*</b>
            </label>

            <textarea
              value={form.address}
              onChange={(e) =>
                updateField(
                  "address",
                  e.target.value
                )
              }
              rows="3"
            />
          </div>

        </section>

        {/* PLAYING */}

        <section className="form-section">

          <div className="section-title">
            <span>03</span>
            Playing Proficiency
          </div>

          <div className="fields-grid">

            <Select
              label="Playing Category"
              required
              value={
                form.playing_category
              }
              onChange={(v) =>
                updateField(
                  "playing_category",
                  v
                )
              }
              options={[
                "Batsman",
                "Bowler",
                "All-rounder",
                "Wicket Keeper",
              ]}
            />

            <Select
              label="Batting Style"
              required
              value={
                form.batting_style
              }
              onChange={(v) =>
                updateField(
                  "batting_style",
                  v
                )
              }
              options={[
                "Right Hand",
                "Left Hand",
              ]}
            />

            <Select
              label="Bowling Style"
              required
              value={
                form.bowling_style
              }
              onChange={(v) =>
                updateField(
                  "bowling_style",
                  v
                )
              }
              options={[
                "Right",
                "Left",
              ]}
            />

            <Field
              label="Previous Academy / Club"
              value={
                form.previous_academy
              }
              onChange={(v) =>
                updateField(
                  "previous_academy",
                  v
                )
              }
            />

          </div>

          <div className="fields-grid">

            <div className="field">
              <label>
                Playing Experience
              </label>

              <textarea
                rows="3"
                value={
                  form.playing_experience
                }
                onChange={(e) =>
                  updateField(
                    "playing_experience",
                    e.target.value
                  )
                }
              />
            </div>

            <div className="field">
              <label>
                Medical / Injuries
              </label>

              <textarea
                rows="3"
                value={
                  form.medical_injury_info
                }
                onChange={(e) =>
                  updateField(
                    "medical_injury_info",
                    e.target.value
                  )
                }
              />
            </div>

          </div>

        </section>

        {/* TRAINING */}

        <section className="form-section">

          <div className="section-title">
            <span>04</span>
            Training Details
          </div>

          <div className="fields-grid">

            <div className="field">
              <label>
                Batch <b>*</b>
              </label>

              <select
                value={form.batch_fee_id}
                onChange={(e) =>
                  handleBatchChange(
                    e.target.value
                  )
                }
                disabled={batchesLoading}
              >
                <option value="">
                  {batchesLoading
                    ? "Loading batches..."
                    : "Select Batch"}
                </option>

                {batches.map((batch) => (
                  <option
                    key={batch.id}
                    value={batch.id}
                  >
                    {batch.batch_name}
                  </option>
                ))}
              </select>

              {form.fee_amount !== "" && (
                <div className="fee-display">
                  ₹{form.fee_amount}
                </div>
              )}
            </div>

            <Field
              label="Joining Date"
              type="date"
              required
              value={form.joining_date}
              onChange={(v) =>
                updateField(
                  "joining_date",
                  v
                )
              }
            />

            <Select
              label="Jersey Size"
              required
              value={form.jersey_size}
              onChange={(v) =>
                updateField(
                  "jersey_size",
                  v
                )
              }
              options={[
                "XS",
                "S",
                "M",
                "L",
                "XL",
                "XXL",
              ]}
            />

          </div>

        </section>

        {/* DECLARATION */}

        <section className="declaration-card">

          <div className="section-title">
            <span>05</span>
            Declaration
          </div>

          <div className="declaration-text">
            {DECLARATION}
          </div>

          <label className="declaration-check">

            <input
              type="checkbox"
              checked={
                form.declaration_accepted
              }
              onChange={(e) =>
                updateField(
                  "declaration_accepted",
                  e.target.checked
                )
              }
            />

            <span>
              I have read and agree to the
              declaration above.
            </span>

          </label>

        </section>

        {/* SUBMIT */}

        <div className="submit-area">

          <button
            className="submit-button"
            onClick={submitAdmission}
            disabled={loading}
          >
            {loading
              ? "Submitting..."
              : "Submit Admission →"}
          </button>

          <p>
            Your application will be saved
            securely and a PDF copy will be
            generated automatically.
          </p>

        </div>

      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required = false,
}) {
  return (
    <div className="field">

      <label>
        {label}

        {required && <b>*</b>}
      </label>

      <input
        type={type}
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
      />

    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
  required = false,
}) {
  return (
    <div className="field">

      <label>
        {label}

        {required && <b>*</b>}
      </label>

      <select
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
      >
        <option value="">
          Select {label}
        </option>

        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}
      </select>

    </div>
  );
}

export default AdmissionPage;