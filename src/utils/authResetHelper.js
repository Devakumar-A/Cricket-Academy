import { supabase } from "../lib/supabase.js";

/**
 * Standardized password reset helper for MG CRICKETER'S DEN
 * Shared across AuthModal ("forgot" view) and standalone ForgotPasswordPage.
 */

export function validateEmail(email) {
  if (!email || typeof email !== "string") return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim());
}

export function getPasswordResetRedirectUrl() {
  if (typeof window !== "undefined" && window.location && window.location.origin) {
    return `${window.location.origin}/reset-password`;
  }
  return "https://mgcricketersden.com/reset-password";
}

export async function sendPasswordResetEmail(rawEmail) {
  const email = (rawEmail || "").trim();

  if (!email) {
    return {
      success: false,
      message: "Please enter your registered email address.",
    };
  }

  if (!validateEmail(email)) {
    return {
      success: false,
      message: "Please enter a valid email address.",
    };
  }

  const redirectTo = getPasswordResetRedirectUrl();

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });

    if (error) {
      // Diagnostic check for Supabase GoTrue 500 error (SMTP delivery failure)
      if (
        error.status === 500 ||
        error.code === "500" ||
        (error.message && error.message.toLowerCase().includes("recovery email"))
      ) {
        return {
          success: false,
          isSmtpError: true,
          message:
            "Automated email delivery is currently undergoing maintenance. Please reach out to our desk via WhatsApp (+91 81224 32905) or email (mgcricketersden@gmail.com) for prompt assistance.",
          rawError: error.message,
        };
      }

      return {
        success: false,
        message: error.message || "Unable to send reset instructions. Please try again.",
        rawError: error.message,
      };
    }

    return {
      success: true,
      message:
        "Password reset link has been sent. Please check your inbox and spam folder.",
    };
  } catch (err) {
    return {
      success: false,
      message:
        "Network connection error. Please verify your internet connection and try again.",
      rawError: err?.message,
    };
  }
}
