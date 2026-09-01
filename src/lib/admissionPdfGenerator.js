import jsPDF from "jspdf";

export function calculateAge(dob) {
  if (!dob) return "";
  try {
    const parts = String(dob).split("T")[0].split("-");
    if (parts.length === 3) {
      const birthYear = parseInt(parts[0], 10);
      const birthMonth = parseInt(parts[1], 10) - 1;
      const birthDay = parseInt(parts[2], 10);
      const today = new Date();
      let age = today.getFullYear() - birthYear;
      const m = today.getMonth() - birthMonth;
      if (m < 0 || (m === 0 && today.getDate() < birthDay)) {
        age--;
      }
      return age >= 0 ? age : "";
    }
    const birth = new Date(dob);
    if (isNaN(birth.getTime())) return "";
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const month = today.getMonth() - birth.getMonth();
    if (month < 0 || (month === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age >= 0 ? age : "";
  } catch {
    return "";
  }
}

export function formatDate(date) {
  if (!date) return "-";
  try {
    const clean = String(date).split("T")[0];
    return new Date(clean + "T00:00:00").toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return String(date);
  }
}

/**
 * Generates and downloads the executive 24K Gold & Obsidian MG Cricketer's Den Admission PDF
 */
export async function generateAdmissionPDF({ admission, photoDataOrUrl }) {
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = pdf.internal.pageSize.getWidth(); // 210mm
  const pageHeight = pdf.internal.pageSize.getHeight(); // 297mm
  const margin = 14;
  const contentWidth = pageWidth - margin * 2; // 182mm
  let y = 10;

  // 1. Load official academy logo base64
  let logoBase64 = null;
  try {
    const response = await fetch("/logoo.png");
    if (response.ok) {
      const blob = await response.blob();
      logoBase64 = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(blob);
      });
    }
  } catch (e) {
    console.warn("Could not fetch logo for PDF:", e);
  }

  // 2. Load student passport photo base64
  let photoBase64 = null;
  let photoFormat = "JPEG";
  const rawPhoto = photoDataOrUrl || admission.signed_photo_url || admission.photo_url;
  if (rawPhoto) {
    if (rawPhoto.startsWith("data:image/")) {
      photoBase64 = rawPhoto;
      photoFormat = rawPhoto.includes("image/png") ? "PNG" : "JPEG";
    } else if (rawPhoto.startsWith("http://") || rawPhoto.startsWith("https://")) {
      try {
        const pResp = await fetch(rawPhoto);
        if (pResp.ok) {
          const pBlob = await pResp.blob();
          photoFormat = pBlob.type?.toLowerCase().includes("png") ? "PNG" : "JPEG";
          photoBase64 = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = () => resolve(null);
            reader.readAsDataURL(pBlob);
          });
        }
      } catch (pErr) {
        console.warn("Could not load student photo for PDF:", pErr);
      }
    }
  }

  // -------------------------------------------------------------
  // 1. EXECUTIVE TOP HEADER BANNER
  // -------------------------------------------------------------
  pdf.setFillColor(11, 17, 28); // Luxury Obsidian
  pdf.roundedRect(margin, y, contentWidth, 26, 3, 3, "F");

  // Gold outline
  pdf.setDrawColor(212, 160, 23);
  pdf.setLineWidth(0.6);
  pdf.roundedRect(margin, y, contentWidth, 26, 3, 3, "D");

  // Embed Academy Logo
  if (logoBase64) {
    try {
      pdf.addImage(logoBase64, "PNG", margin + 3, y + 2.5, 21, 21);
    } catch (err) {
      console.warn("Logo render note:", err);
    }
  }

  const textX = margin + (logoBase64 ? 27 : 6);

  // Academy Title & Subtitles
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(15);
  pdf.setTextColor(253, 224, 71); // 24K Gold
  pdf.text("MG CRICKETER'S DEN", textX, y + 8);

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(7.5);
  pdf.setTextColor(229, 231, 235);
  pdf.text("OFFICIAL CRICKET ACADEMY ENROLLMENT APPLICATION", textX, y + 14);

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(7);
  pdf.setTextColor(156, 163, 175);
  pdf.text("Thengaithittu Nets & Royapudupakkam Ground, Puducherry • +91 83008 79748", textX, y + 19.5);

  // Application Ref Badge (Top Right)
  const refBoxW = 44;
  const refBoxX = pageWidth - margin - refBoxW - 4;
  pdf.setFillColor(21, 30, 48);
  pdf.roundedRect(refBoxX, y + 3.5, refBoxW, 19, 2, 2, "F");
  pdf.setDrawColor(212, 160, 23);
  pdf.setLineWidth(0.3);
  pdf.roundedRect(refBoxX, y + 3.5, refBoxW, 19, 2, 2, "D");

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(6.5);
  pdf.setTextColor(212, 160, 23);
  pdf.text("APPLICATION NUMBER", refBoxX + refBoxW / 2, y + 8.5, { align: "center" });

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(8.5);
  pdf.setTextColor(255, 255, 255);
  const appNumber = admission.id ? ("MGD-" + String(admission.id).slice(0, 8).toUpperCase()) : ("MGD-" + new Date().getFullYear() + "-" + Date.now().toString().slice(-5));
  pdf.text(appNumber, refBoxX + refBoxW / 2, y + 15, { align: "center" });

  y += 31;

  // -------------------------------------------------------------
  // 2. PASSPORT PHOTO & APPLICANT SUMMARY
  // -------------------------------------------------------------
  const photoW = 34;
  const photoH = 42;
  const photoX = pageWidth - margin - photoW;
  const photoY = y;

  // Photo Frame
  pdf.setFillColor(245, 247, 250);
  pdf.roundedRect(photoX, photoY, photoW, photoH, 2, 2, "F");
  pdf.setDrawColor(212, 160, 23);
  pdf.setLineWidth(0.5);
  pdf.roundedRect(photoX, photoY, photoW, photoH, 2, 2, "D");

  if (photoBase64) {
    try {
      pdf.addImage(photoBase64, photoFormat, photoX + 1, photoY + 1, photoW - 2, photoH - 2);
    } catch (photoErr) {
      console.warn("Photo render note:", photoErr);
      drawPhotoPlaceholder(pdf, photoX, photoY, photoW, photoH);
    }
  } else {
    drawPhotoPlaceholder(pdf, photoX, photoY, photoW, photoH);
  }

  // Left Summary Meta Box
  const summaryW = contentWidth - photoW - 6;
  pdf.setFillColor(250, 250, 252);
  pdf.roundedRect(margin, photoY, summaryW, photoH, 2, 2, "F");
  pdf.setDrawColor(229, 231, 235);
  pdf.setLineWidth(0.3);
  pdf.roundedRect(margin, photoY, summaryW, photoH, 2, 2, "D");

  let sumY = photoY + 6.5;
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(13);
  pdf.setTextColor(17, 24, 39);
  pdf.text(admission.full_name || "Applicant Name", margin + 6, sumY);

  sumY += 6;
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(8.5);
  pdf.setTextColor(184, 134, 11);
  pdf.text("TRAINING BATCH: " + (admission.batch_name || "Regular Batch"), margin + 6, sumY);

  sumY += 5.5;
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8);
  pdf.setTextColor(75, 85, 99);
  pdf.text("Category: " + (admission.playing_category || "All-Rounder") + "   •   Jersey Size: " + (admission.jersey_size || "M"), margin + 6, sumY);

  sumY += 5.5;
  pdf.text("Joining Date: " + formatDate(admission.joining_date) + "   •   Fee: Rs. " + (admission.fee_amount || "Standard"), margin + 6, sumY);

  sumY += 5.5;
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(16, 185, 129);
  pdf.text("Application Status: SUBMITTED & VERIFIED", margin + 6, sumY);

  y += photoH + 7;

  // -------------------------------------------------------------
  // HELPER: RENDER STRUCTURED 2-COLUMN SECTION
  // -------------------------------------------------------------
  const ageVal = calculateAge(admission.dob);
  const dobText = admission.dob ? (formatDate(admission.dob) + " (Age: " + (ageVal || "-") + " Years)") : "-";

  const sections = [
    {
      title: "1. PERSONAL & IDENTITY DETAILS",
      fields: [
        ["Full Name", admission.full_name || "-"],
        ["Date of Birth", dobText],
        ["Gender", admission.gender || "-"],
        ["Blood Group", admission.blood_group || "-"],
        ["Aadhaar Number", admission.aadhaar_number || "-"],
        ["Contact Phone", admission.phone || "-"],
      ],
    },
    {
      title: "2. PARENT / GUARDIAN & CONTACT DETAILS",
      fields: [
        ["Guardian Type", admission.parent_type || "Parent"],
        ["Father's Name", admission.father_name || "-"],
        ["Mother's Name", admission.mother_name || "-"],
        ["Guardian Name", admission.guardian_name || "-"],
        ["Occupation", admission.parent_guardian_occupation || "-"],
        ["WhatsApp Number", admission.whatsapp || "-"],
        ["Residential Address", admission.address || "-"],
      ],
    },
    {
      title: "3. CRICKET PROFILE & PREVIOUS EXPERIENCE",
      fields: [
        ["Primary Role", admission.playing_category || "-"],
        ["Batting Style", admission.batting_style || "-"],
        ["Bowling Style", admission.bowling_style || "-"],
        ["Jersey Size", admission.jersey_size || "-"],
        ["Previous Academy", admission.previous_academy || "None (Fresh Trainee)"],
        ["Playing Experience", admission.playing_experience || "Beginner / Grassroots"],
        ["Medical / Injury Info", admission.medical_injury_info || "None (Medically Fit)"],
      ],
    },
  ];

  for (const sec of sections) {
    // Section Header Bar
    pdf.setFillColor(17, 24, 39); // Deep Slate
    pdf.roundedRect(margin, y, contentWidth, 6.5, 1.5, 1.5, "F");
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(8);
    pdf.setTextColor(253, 224, 71); // Gold
    pdf.text(sec.title, margin + 4, y + 4.6);
    y += 8.5;

    // Fields Grid (2 Columns)
    const colWidth = (contentWidth - 4) / 2;
    for (let i = 0; i < sec.fields.length; i += 2) {
      const f1 = sec.fields[i];
      const f2 = sec.fields[i + 1];

      renderField(pdf, margin, y, colWidth, f1[0], f1[1]);
      if (f2) {
        renderField(pdf, margin + colWidth + 4, y, colWidth, f2[0], f2[1]);
      }
      y += 6.5;
    }
    y += 2;
  }

  // -------------------------------------------------------------
  // 4. LEGAL DECLARATION & SIGNATURE BLOCKS
  // -------------------------------------------------------------
  y += 2;
  pdf.setFillColor(249, 250, 251);
  pdf.roundedRect(margin, y, contentWidth, 14, 2, 2, "F");
  pdf.setDrawColor(209, 213, 219);
  pdf.setLineWidth(0.3);
  pdf.roundedRect(margin, y, contentWidth, 14, 2, 2, "D");

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(6.5);
  pdf.setTextColor(17, 24, 39);
  pdf.text("OFFICIAL APPLICANT & PARENT DECLARATION:", margin + 3, y + 4);

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(6);
  pdf.setTextColor(75, 85, 99);
  const declarationText =
    "I hereby confirm that all the information provided above is true and accurate. I agree to abide by the academy code of conduct, training schedule, uniform discipline, and coaching guidelines of MG Cricketer's Den.";
  pdf.text(declarationText, margin + 3, y + 8, { maxWidth: contentWidth - 6 });

  y += 20;

  // Dual Formal Signature Lines
  const sigBoxW = (contentWidth - 10) / 2;

  // Parent Signature
  pdf.setDrawColor(156, 163, 175);
  pdf.setLineWidth(0.4);
  pdf.line(margin, y + 8, margin + sigBoxW, y + 8);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(7.5);
  pdf.setTextColor(55, 65, 81);
  pdf.text("Parent / Guardian Signature", margin + sigBoxW / 2, y + 12, { align: "center" });

  // Academy Official Seal
  const sealX = margin + sigBoxW + 10;
  pdf.line(sealX, y + 8, sealX + sigBoxW, y + 8);
  pdf.text("Head Coach / Director Seal", sealX + sigBoxW / 2, y + 12, { align: "center" });
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(6.5);
  pdf.setTextColor(107, 114, 128);
  pdf.text("MG Cricketer's Den Authority", sealX + sigBoxW / 2, y + 16, { align: "center" });

  // Official Footer Tagline
  pdf.setFont("helvetica", "italic");
  pdf.setFontSize(6);
  pdf.setTextColor(156, 163, 175);
  pdf.text(
    "MG Cricketer's Den • North St, Thengaithittu & Royapudupakkam Ground, Puducherry • Contact: +91 83008 79748 / +91 95973 18892",
    pageWidth / 2,
    pageHeight - 6,
    { align: "center" }
  );

  // Save / Download PDF
  const cleanFileName = "MG-Admission-" + (admission.full_name || "Application").replace(/[^a-zA-Z0-9]/g, "_") + ".pdf";
  pdf.save(cleanFileName);
}

function renderField(pdf, x, y, width, label, value) {
  pdf.setFillColor(243, 244, 246);
  pdf.rect(x, y, width, 5.5, "F");

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(6.5);
  pdf.setTextColor(107, 114, 128);
  pdf.text(label + ":", x + 2, y + 3.8);

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(7.2);
  pdf.setTextColor(17, 24, 39);
  pdf.text(String(value || "-"), x + 38, y + 3.8, { maxWidth: width - 40 });
}

function drawPhotoPlaceholder(pdf, x, y, w, h) {
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(7.5);
  pdf.setTextColor(156, 163, 175);
  pdf.text("PASSPORT PHOTO", x + w / 2, y + h / 2 - 2, { align: "center" });
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(6);
  pdf.text("AFFIXED HERE", x + w / 2, y + h / 2 + 3, { align: "center" });
}