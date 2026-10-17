import logging
from ..config import settings

logger = logging.getLogger(__name__)


def send_password_reset_email(to_email: str, reset_link: str) -> None:
    """
    Send a password reset email via Resend.
    Falls back to printing the link if RESEND_API_KEY is not configured
    (useful for local development without email credentials).
    """
    if not settings.resend_api_key:
        logger.warning(
            "[email] RESEND_API_KEY not set — printing reset link instead: %s",
            reset_link,
        )
        print(f"[password reset] {to_email} -> {reset_link}")
        return

    try:
        import resend

        resend.api_key = settings.resend_api_key

        resend.Emails.send({
            "from": settings.email_from,
            "to": [to_email],
            "subject": "Reset your SignWyz password",
            "html": f"""
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background-color:#f9fafb;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width:520px;background:#ffffff;border-radius:12px;border:1px solid #e5e7eb;overflow:hidden;">

          <!-- Header -->
          <tr>
            <td style="padding:32px 40px 24px;border-bottom:1px solid #e5e7eb;">
              <p style="margin:0;font-size:12px;font-weight:700;letter-spacing:2px;color:#6b7280;">SIGNWYZ</p>
              <h1 style="margin:12px 0 0;font-size:26px;letter-spacing:-0.5px;color:#111827;line-height:1.2;">
                Reset your password
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px 40px;">
              <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#4b5563;">
                We received a request to reset the password for your SignWyz account.
                Click the button below to choose a new password.
              </p>
              <p style="margin:0 0 28px;font-size:15px;line-height:1.6;color:#4b5563;">
                This link expires in <strong>30 minutes</strong> and can only be used once.
              </p>
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="border-radius:8px;background-color:#111827;">
                    <a href="{reset_link}"
                       style="display:inline-block;padding:14px 28px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:8px;">
                      Reset Password
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin:28px 0 0;font-size:13px;line-height:1.6;color:#9ca3af;">
                If you didn't request a password reset, you can safely ignore this email.
                Your password will not be changed.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px;border-top:1px solid #e5e7eb;">
              <p style="margin:0;font-size:12px;color:#9ca3af;">
                © 2026 SignWyz. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
            """,
        })

        logger.info("[email] Password reset email sent to %s", to_email)

    except Exception as exc:
        # Log the error but don't expose it to the caller — the endpoint
        # always returns the same response regardless of whether the email
        # was delivered, to avoid leaking whether an address is registered.
        logger.error("[email] Failed to send reset email to %s: %s", to_email, exc)
