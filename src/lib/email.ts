import { Resend } from "resend";

let _resend: Resend | undefined;

function getResend(): Resend {
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY!);
  }
  return _resend;
}

const FROM_EMAIL = process.env.EMAIL_FROM || "Clarion <noreply@clarionwriter.com>";

export async function sendPasswordResetEmail(email: string, token: string) {
  const baseUrl = process.env.NEXTAUTH_URL || "https://fastr-pi.vercel.app";
  const resetUrl = `${baseUrl}/reset-password?token=${token}`;

  await getResend().emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: "Reset your Clarion password",
    html: `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">
        <h1 style="font-size: 24px; font-weight: 600; color: #1a1a1a; margin-bottom: 16px;">Reset your password</h1>
        <p style="font-size: 15px; color: #555; line-height: 1.6; margin-bottom: 24px;">
          We received a request to reset your Clarion password. Click the button below to choose a new one.
          This link expires in 1 hour.
        </p>
        <a href="${resetUrl}" style="display: inline-block; background-color: #7A9E7E; color: white; font-size: 15px; font-weight: 500; text-decoration: none; padding: 12px 28px; border-radius: 8px;">
          Reset Password
        </a>
        <p style="font-size: 13px; color: #999; line-height: 1.5; margin-top: 32px;">
          If you didn't request this, you can safely ignore this email. Your password won't be changed.
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0 16px;" />
        <p style="font-size: 12px; color: #bbb;">Clarion — Professional content for health professionals.</p>
      </div>
    `,
  });
}
