import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendVerificationCode = async (email: string, code: string) => {
  await transporter.sendMail({
    from: `"EcoPantry" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: '🔒 EcoPantry Email Verification Code',
    text: `Your EcoPantry verification code is: ${code}`,
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #f9f9f9;">
        <h2 style="text-align: center; color: #2e7d32;">EcoPantry</h2>
        <p>Hello,</p>
        <p>To complete your signup, please use the following verification code:</p>
        <div style="text-align: center; margin: 20px 0;">
          <span style="font-size: 28px; font-weight: bold; color: #2e7d32;">${code}</span>
        </div>
        <p>This code will expire in 10 minutes.</p>
        <p>If you did not request this, you can ignore this email.</p>
        <p style="margin-top: 40px; font-size: 13px; color: #777;">— The EcoPantry Team</p>
      </div>
    `
  });
};

