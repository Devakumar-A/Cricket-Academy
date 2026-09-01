// -------------------------------------------------------------------------
// 📲 OWNER WHATSAPP CONFIGURATION
// To update the owner's WhatsApp number in the future, change the value below:
// Example: "916383066764" (Include country code without '+' or spaces)
// -------------------------------------------------------------------------
export const OWNER_WHATSAPP_NUMBER = "916383066764";

/**
 * Sends a pre-filled booking summary message to the owner's WhatsApp.
 */
export function sendTurfBookingToWhatsApp({
  turfName,
  bookingDate,
  startTime,
  endTime,
  duration,
  userName,
  userPhone,
  userEmail,
}) {
  const message = `🏏 *NEW TURF BOOKING REQUEST - MG CRICKETER'S DEN* 🏏\n\n` +
    `🏟️ *Turf / Net:* ${turfName || "Turf Slot"}\n` +
    `📅 *Date:* ${bookingDate}\n` +
    `⏰ *Time:* ${startTime} - ${endTime} (${duration} hr${duration > 1 ? "s" : ""})\n\n` +
    `👤 *Player / Booker:* ${userName}\n` +
    `📞 *Phone:* ${userPhone}\n` +
    `✉️ *Email:* ${userEmail || "Not provided"}\n\n` +
    `_Please verify slot availability and payment confirmation._`;

  const url = `https://wa.me/${OWNER_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
}

/**
 * Sends a pre-filled admission application notification to the owner's WhatsApp.
 */
export function sendAdmissionToWhatsApp({
  fullName,
  dob,
  gender,
  phone,
  batchName,
  feeAmount,
  joiningDate,
}) {
  const message = `📝 *NEW ADMISSION APPLICATION - MG CRICKETER'S DEN* 📝\n\n` +
    `👤 *Player Name:* ${fullName}\n` +
    `🎂 *DOB:* ${dob} (${gender})\n` +
    `📞 *Phone:* ${phone}\n` +
    `🏏 *Batch:* ${batchName || "Academy Batch"}\n` +
    `💰 *Fee:* ₹${feeAmount || "1999"} / Month\n` +
    `📅 *Joining Date:* ${joiningDate}\n\n` +
    `_Player application has been submitted and registered._`;

  const url = `https://wa.me/${OWNER_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
}

export default {
  OWNER_WHATSAPP_NUMBER,
  sendTurfBookingToWhatsApp,
  sendAdmissionToWhatsApp,
};
