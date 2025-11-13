import nodemailer from 'nodemailer';

// Gmail SMTP configuration
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER || 'khamareclarke@gmail.com',
    pass: process.env.EMAIL_PASS || 'ovga hgzy rltc ifyh',
  },
});

export async function sendVerificationCode(email: string, code: string) {
  try {
    const mailOptions = {
      from: `"Leverage Journal" <${process.env.EMAIL_USER || 'khamareclarke@gmail.com'}>`,
      to: email,
      subject: 'Your Leverage Journal Verification Code',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: white; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .code { background: #f3f4f6; border: 2px dashed #fbbf24; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 20px 0; border-radius: 8px; }
            .footer { text-align: center; margin-top: 20px; color: #999; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="color: #000; margin: 0; font-size: 28px; font-weight: bold;">Leverage Journal™</h1>
            </div>
            <div class="content">
              <h2 style="color: #1a1a1a; margin-top: 0;">Your Verification Code</h2>
              <p>Thank you for registering with Leverage Journal™!</p>
              <p>Use this code to complete your sign-in:</p>
              <div class="code">${code}</div>
              <p style="color: #666;">This code will expire in 10 minutes.</p>
              <p style="color: #999; font-size: 12px; margin-top: 30px;">
                If you didn't request this code, you can safely ignore this email.
              </p>
            </div>
            <div class="footer">
              <p>© 2024 Leverage Journal™. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Leverage Journal - Verification Code
        
        Thank you for registering!
        
        Your verification code is: ${code}
        
        This code will expire in 10 minutes.
        
        If you didn't request this code, you can safely ignore this email.
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error('Email send error:', error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
}




