import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

export const sendResetEmail = async (email, resetToken, userName) => {
  try {
    // Check if email configuration is set
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      throw new Error("Email service is not configured. Please set EMAIL_USER and EMAIL_PASSWORD in .env file");
    }

    if (!process.env.CLIENT_URL) {
      throw new Error("CLIENT_URL is not configured in .env file");
    }

    const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Request - AI Library",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #030712; padding: 20px; border-radius: 10px; color: white; text-align: center;">
            <h1 style="color: #00d9ff; margin: 0;">AI Library</h1>
            <p style="margin-top: 10px;">Password Reset Request</p>
          </div>
          
          <div style="padding: 20px; background-color: #f5f5f5; margin-top: 20px; border-radius: 10px;">
            <p>Hi <strong>${userName}</strong>,</p>
            <p>You recently requested to reset your password. Click the button below to reset it.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" style="background-color: #00d9ff; color: #030712; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                Reset Password
              </a>
            </div>
            
            <p style="color: #666; font-size: 12px;">
              Or copy and paste this link in your browser:<br>
              <span style="word-break: break-all;">${resetLink}</span>
            </p>
            
            <p style="color: #666; font-size: 12px; margin-top: 30px;">
              This link will expire in 1 hour.<br>
              If you didn't request a password reset, please ignore this email.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
            <p>&copy; 2024 AI Library. All rights reserved.</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    return true;

  } catch (error) {
    console.error("Email sending error:", error);
    throw error;
  }
};
