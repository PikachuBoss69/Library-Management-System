import dotenv from 'dotenv'
import {createTransport, getTestMessageUrl} from "nodemailer";
dotenv.config();

const bank_email = process.env.EMAIL_USER
const client_id = process.env.CLIENT_ID
const client_secret = process.env.CLIENT_SECRET
const refresh_token = process.env.REFRESH_TOKEN

const transporter = createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    type: 'OAuth2',
    user: bank_email,
    clientId: client_id,
    clientSecret: client_secret,
    refreshToken: refresh_token,
  },
});

// Verify the connection configuration
transporter.verify((error: Error | null, success: boolean) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

// Function to send email
const sendEmail = async (to: string, subject: string, text: string, html: string) => {
  try {
    const info = await transporter.sendMail({
      from: `"Central Library" <${bank_email}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

export async function sendingEmailOtp(email: string, otp: number): Promise<void> {
  const subject = 'Your OTP for Email Verification';
  const text = `Your OTP for email verification is: ${otp}`;
  const html = `<p>Your OTP for email verification is: <strong>${otp}</strong></p>`;

  await sendEmail(email, subject, text, html);
}


    