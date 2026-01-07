import nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Helper function to log emails to database
async function logEmail(
  email: string,
  emailType: string,
  subject: string,
  recipientName: string | null,
  userId: string | null,
  messageId: string | null,
  status: 'sent' | 'failed',
  errorMessage: string | null = null,
  metadata: any = null
) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    await supabase.from('email_logs').insert({
      email,
      email_type: emailType,
      subject,
      recipient_name: recipientName,
      user_id: userId || null,
      message_id: messageId,
      status,
      error_message: errorMessage,
      metadata: metadata || null,
    });
  } catch (logError: any) {
    // Don't throw - logging failure shouldn't break email sending
    console.error('Failed to log email:', logError);
  }
}

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

const emailStyles = `
  body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
  .container { max-width: 600px; margin: 0 auto; padding: 20px; }
  .header { background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
  .content { background: white; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
  .button { display: inline-block; background: #fbbf24; color: #000; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
  .footer { text-align: center; margin-top: 20px; color: #999; font-size: 12px; }
  .progress-bar { background: #f3f4f6; border-radius: 10px; height: 24px; margin: 10px 0; overflow: hidden; }
  .progress-fill { background: linear-gradient(90deg, #fbbf24 0%, #f59e0b 100%); height: 100%; display: flex; align-items: center; justify-content: center; color: #000; font-weight: bold; font-size: 12px; }
`;

export async function sendVerificationCode(email: string, code: string, userId: string | null = null) {
  const subject = 'Your Leverage Journal Verification Code';
  try {
    const mailOptions = {
      from: `"Leverage Journal" <${process.env.EMAIL_USER || 'khamareclarke@gmail.com'}>`,
      to: email,
      subject,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>${emailStyles}
            .code { background: #f3f4f6; border: 2px dashed #fbbf24; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 20px 0; border-radius: 8px; }
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
    
    // Log successful email
    await logEmail(email, 'verification_code', subject, null, userId, info.messageId || null, 'sent', null, { code: '******' });
    
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error('Email send error:', error);
    
    // Log failed email
    await logEmail(email, 'verification_code', subject, null, userId, null, 'failed', error.message, null);
    
    throw new Error(`Failed to send email: ${error.message}`);
  }
}

export async function sendJournalReminder(email: string, userName: string, userId: string | null = null) {
  const subject = '📔 Don\'t forget your daily journal entry!';
  try {
    const mailOptions = {
      from: `"Leverage Journal" <${process.env.EMAIL_USER || 'khamareclarke@gmail.com'}>`,
      to: email,
      subject,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>${emailStyles}</style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="color: #000; margin: 0; font-size: 28px; font-weight: bold;">📔 Daily Reminder</h1>
            </div>
            <div class="content">
              <h2 style="color: #1a1a1a; margin-top: 0;">Hi ${userName || 'there'}!</h2>
              <p>You haven't filled out your journal entry for today yet. Take a few minutes to reflect on your day and track your progress.</p>
              <p style="color: #666;">Remember: Consistency is key to transformation! 🎯</p>
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://leveragejournal.com'}/dashboard/daily" class="button">Fill Journal Entry</a>
              <p style="color: #999; font-size: 12px; margin-top: 30px;">
                This is an automated reminder. You can manage your email preferences in your account settings.
              </p>
            </div>
            <div class="footer">
              <p>© 2024 Leverage Journal™. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `Daily Journal Reminder\n\nHi ${userName || 'there'}!\n\nYou haven't filled out your journal entry for today yet. Take a few minutes to reflect on your day and track your progress.\n\nVisit: ${process.env.NEXT_PUBLIC_APP_URL || 'https://leveragejournal.com'}/dashboard/daily`,
    };

    const info = await transporter.sendMail(mailOptions);
    
    // Log successful email
    await logEmail(email, 'journal_reminder', subject, userName, userId, info.messageId || null, 'sent', null, null);
    
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error('Journal reminder email error:', error);
    
    // Log failed email
    await logEmail(email, 'journal_reminder', subject, userName, userId, null, 'failed', error.message, null);
    
    throw new Error(`Failed to send email: ${error.message}`);
  }
}

export async function sendGoalProgressReminder(email: string, userName: string, goals: Array<{title: string, progress: number}>, userId: string | null = null) {
  const subject = '🎯 Keep pushing toward your goals!';
  try {
    const goalsHtml = goals.map(goal => {
      const remaining = 100 - goal.progress;
      return `
        <div style="margin: 20px 0; padding: 15px; background: #f9fafb; border-radius: 8px; border-left: 4px solid #fbbf24;">
          <h3 style="margin: 0 0 10px 0; color: #1a1a1a;">${goal.title}</h3>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${goal.progress}%;">${goal.progress}%</div>
          </div>
          <p style="margin: 10px 0 0 0; color: #666; font-size: 14px;">
            <strong>Completed:</strong> ${goal.progress}% | <strong>Remaining:</strong> ${remaining}%
          </p>
        </div>
      `;
    }).join('');

    const mailOptions = {
      from: `"Leverage Journal" <${process.env.EMAIL_USER || 'khamareclarke@gmail.com'}>`,
      to: email,
      subject,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>${emailStyles}</style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="color: #000; margin: 0; font-size: 28px; font-weight: bold;">🎯 Goal Progress</h1>
            </div>
            <div class="content">
              <h2 style="color: #1a1a1a; margin-top: 0;">Hi ${userName || 'there'}!</h2>
              <p>Here's your current progress on your goals. Keep up the momentum! 💪</p>
              ${goalsHtml}
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://leveragejournal.com'}/dashboard/goals" class="button">View All Goals</a>
              <p style="color: #999; font-size: 12px; margin-top: 30px;">
                This is an automated reminder. You can manage your email preferences in your account settings.
              </p>
            </div>
            <div class="footer">
              <p>© 2024 Leverage Journal™. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `Goal Progress Reminder\n\nHi ${userName || 'there'}!\n\nHere's your current progress:\n${goals.map(g => `${g.title}: ${g.progress}% complete (${100-g.progress}% remaining)`).join('\n')}\n\nVisit: ${process.env.NEXT_PUBLIC_APP_URL || 'https://leveragejournal.com'}/dashboard/goals`,
    };

    const info = await transporter.sendMail(mailOptions);
    
    // Log successful email
    await logEmail(email, 'goal_reminder', subject, userName, userId, info.messageId || null, 'sent', null, { goalsCount: goals.length });
    
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error('Goal reminder email error:', error);
    
    // Log failed email
    await logEmail(email, 'goal_reminder', subject, userName, userId, null, 'failed', error.message, { goalsCount: goals.length });
    
    throw new Error(`Failed to send email: ${error.message}`);
  }
}

export async function sendWeeklyReviewReminder(email: string, userName: string, weekNumber: number, userId: string | null = null) {
  const subject = '📊 Time for your weekly review!';
  try {
    const mailOptions = {
      from: `"Leverage Journal" <${process.env.EMAIL_USER || 'khamareclarke@gmail.com'}>`,
      to: email,
      subject,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>${emailStyles}</style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="color: #000; margin: 0; font-size: 28px; font-weight: bold;">📊 Weekly Review</h1>
            </div>
            <div class="content">
              <h2 style="color: #1a1a1a; margin-top: 0;">Hi ${userName || 'there'}!</h2>
              <p>It's time for your <strong>Week ${weekNumber}</strong> review! Reflect on your wins, obstacles, and lessons learned this week.</p>
              <p style="color: #666;">Weekly reviews help you track progress and adjust your strategy for the week ahead. 📈</p>
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://leveragejournal.com'}/dashboard/review" class="button">Fill Weekly Review</a>
              <p style="color: #999; font-size: 12px; margin-top: 30px;">
                This is an automated reminder. You can manage your email preferences in your account settings.
              </p>
            </div>
            <div class="footer">
              <p>© 2024 Leverage Journal™. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `Weekly Review Reminder\n\nHi ${userName || 'there'}!\n\nIt's time for your Week ${weekNumber} review! Reflect on your wins, obstacles, and lessons learned this week.\n\nVisit: ${process.env.NEXT_PUBLIC_APP_URL || 'https://leveragejournal.com'}/dashboard/review`,
    };

    const info = await transporter.sendMail(mailOptions);
    
    // Log successful email
    await logEmail(email, 'weekly_review', subject, userName, userId, info.messageId || null, 'sent', null, { weekNumber });
    
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error('Weekly review reminder email error:', error);
    
    // Log failed email
    await logEmail(email, 'weekly_review', subject, userName, userId, null, 'failed', error.message, { weekNumber });
    
    throw new Error(`Failed to send email: ${error.message}`);
  }
}

export async function sendTestEmail(email: string, userName: string, userId: string | null = null) {
  const subject = '🧪 Test Email - Leverage Journal';
  try {
    const mailOptions = {
      from: `"Leverage Journal" <${process.env.EMAIL_USER || 'khamareclarke@gmail.com'}>`,
      to: email,
      subject,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>${emailStyles}</style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="color: #000; margin: 0; font-size: 28px; font-weight: bold;">🧪 Test Email</h1>
            </div>
            <div class="content">
              <h2 style="color: #1a1a1a; margin-top: 0;">Hi ${userName || 'there'}!</h2>
              <p>This is a <strong>test email</strong> from Leverage Journal™ to verify that our email system is working correctly.</p>
              <p style="color: #666;">If you received this email, it means our email delivery system is functioning properly! ✅</p>
              <p style="color: #999; font-size: 12px; margin-top: 30px;">
                This is a test email sent for system verification purposes.
              </p>
            </div>
            <div class="footer">
              <p>© 2024 Leverage Journal™. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `Test Email - Leverage Journal\n\nHi ${userName || 'there'}!\n\nThis is a test email from Leverage Journal™ to verify that our email system is working correctly.\n\nIf you received this email, it means our email delivery system is functioning properly!`,
    };

    const info = await transporter.sendMail(mailOptions);
    
    // Log successful email
    await logEmail(email, 'test_email', subject, userName, userId, info.messageId || null, 'sent', null, null);
    
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error('Test email error:', error);
    
    // Log failed email
    await logEmail(email, 'test_email', subject, userName, userId, null, 'failed', error.message, null);
    
    throw new Error(`Failed to send email: ${error.message}`);
  }
}

export async function sendOrderConfirmationEmail(
  customerEmail: string,
  orderDetails: {
    orderId: string;
    productName: string;
    price: string;
    quantity: number;
    customerName?: string;
    phone?: string;
    shippingAddress?: string | null;
    shippingAddressRaw?: any;
    billingAddress?: string | null;
    billingAddressRaw?: any;
    shippingName?: string | null;
  },
  adminEmail: string = 'clarkekhamare@gmail.com'
) {
  const subject = '✅ Order Confirmed - Leverage Journal';
  
  try {
    // Send to customer
    const customerMailOptions = {
      from: `"Leverage Journal" <${process.env.EMAIL_USER || 'khamareclarke@gmail.com'}>`,
      to: customerEmail,
      subject,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>${emailStyles}</style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="color: #000; margin: 0; font-size: 28px; font-weight: bold;">✅ Order Confirmed!</h1>
            </div>
            <div class="content">
              <h2 style="color: #1a1a1a; margin-top: 0;">Hi ${orderDetails.customerName || 'there'}!</h2>
              <p>Thank you for your purchase! Your order has been confirmed and payment has been received.</p>
              
              <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #fbbf24;">
                <h3 style="margin: 0 0 10px 0; color: #1a1a1a;">Order Details</h3>
                <p style="margin: 5px 0;"><strong>Order ID:</strong> ${orderDetails.orderId}</p>
                <p style="margin: 5px 0;"><strong>Product:</strong> ${orderDetails.productName}</p>
                <p style="margin: 5px 0;"><strong>Quantity:</strong> ${orderDetails.quantity}</p>
                <p style="margin: 5px 0;"><strong>Total:</strong> ${orderDetails.price}</p>
              </div>
              
              <p style="color: #666; font-weight: bold;">🚚 Your order will be delivered very soon!</p>
              <p style="color: #999; font-size: 12px; margin-top: 30px;">
                We'll send you another email with tracking information once your order ships.
              </p>
            </div>
            <div class="footer">
              <p>© 2024 Leverage Journal™. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `Order Confirmed - Leverage Journal\n\nHi ${orderDetails.customerName || 'there'}!\n\nThank you for your purchase! Your order has been confirmed.\n\nOrder Details:\nOrder ID: ${orderDetails.orderId}\nProduct: ${orderDetails.productName}\nQuantity: ${orderDetails.quantity}\nTotal: ${orderDetails.price}\n\nYour order will be delivered very soon!`,
    };

    const customerInfo = await transporter.sendMail(customerMailOptions);
    console.log('Customer confirmation email sent:', customerInfo.messageId);

    // Send to admin
    const adminMailOptions = {
      from: `"Leverage Journal" <${process.env.EMAIL_USER || 'khamareclarke@gmail.com'}>`,
      to: adminEmail,
      subject: `🛒 New Order Received - ${orderDetails.orderId}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>${emailStyles}</style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="color: #000; margin: 0; font-size: 28px; font-weight: bold;">🛒 New Order Received</h1>
            </div>
            <div class="content">
              <h2 style="color: #1a1a1a; margin-top: 0;">Order Notification</h2>
              <p>A new order has been received and payment has been confirmed.</p>
              
              <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #fbbf24;">
                <h3 style="margin: 0 0 10px 0; color: #1a1a1a;">Order Details</h3>
                <p style="margin: 5px 0;"><strong>Order ID:</strong> ${orderDetails.orderId}</p>
                <p style="margin: 5px 0;"><strong>Customer Email:</strong> ${customerEmail}</p>
                <p style="margin: 5px 0;"><strong>Customer Name:</strong> ${orderDetails.customerName || 'Not provided'}</p>
                ${orderDetails.phone ? `<p style="margin: 5px 0;"><strong>Phone:</strong> ${orderDetails.phone}</p>` : ''}
                <p style="margin: 5px 0;"><strong>Product:</strong> ${orderDetails.productName}</p>
                <p style="margin: 5px 0;"><strong>Quantity:</strong> ${orderDetails.quantity}</p>
                <p style="margin: 5px 0;"><strong>Total Amount:</strong> ${orderDetails.price}</p>
                <p style="margin: 5px 0;"><strong>Payment Status:</strong> ✅ Paid</p>
              </div>
              
              ${orderDetails.shippingAddress || orderDetails.billingAddress ? `
              <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;">
                <h3 style="margin: 0 0 15px 0; color: #1a1a1a;">📍 Shipping & Billing Information</h3>
                ${orderDetails.shippingAddress ? `
                <div style="margin-bottom: 15px;">
                  <p style="margin: 0 0 5px 0; font-weight: bold; color: #1a1a1a;">Shipping Address:</p>
                  ${orderDetails.shippingName && orderDetails.shippingName !== orderDetails.customerName ? `<p style="margin: 0 0 5px 0; color: #666;">Name: ${orderDetails.shippingName}</p>` : ''}
                  <p style="margin: 0; color: #666; line-height: 1.6;">${orderDetails.shippingAddress}</p>
                  ${orderDetails.shippingAddressRaw ? `
                  <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #666;">
                    ${orderDetails.shippingAddressRaw.line1 ? `<p style="margin: 2px 0;">Street: ${orderDetails.shippingAddressRaw.line1}</p>` : ''}
                    ${orderDetails.shippingAddressRaw.line2 ? `<p style="margin: 2px 0;">Address Line 2: ${orderDetails.shippingAddressRaw.line2}</p>` : ''}
                    ${orderDetails.shippingAddressRaw.city ? `<p style="margin: 2px 0;">City: ${orderDetails.shippingAddressRaw.city}</p>` : ''}
                    ${orderDetails.shippingAddressRaw.state ? `<p style="margin: 2px 0;">State/County: ${orderDetails.shippingAddressRaw.state}</p>` : ''}
                    ${orderDetails.shippingAddressRaw.postal_code ? `<p style="margin: 2px 0;">Postal Code: ${orderDetails.shippingAddressRaw.postal_code}</p>` : ''}
                    ${orderDetails.shippingAddressRaw.country ? `<p style="margin: 2px 0;"><strong>Country:</strong> ${orderDetails.shippingAddressRaw.country}</p>` : ''}
                  </div>
                  ` : ''}
                </div>
                ` : '<p style="margin: 0; color: #999; font-style: italic;">No shipping address provided</p>'}
                ${orderDetails.billingAddress ? `
                <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #e5e7eb;">
                  <p style="margin: 0 0 5px 0; font-weight: bold; color: #1a1a1a;">Billing Address:</p>
                  <p style="margin: 0; color: #666; line-height: 1.6;">${orderDetails.billingAddress}</p>
                  ${orderDetails.billingAddressRaw ? `
                  <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #666;">
                    ${orderDetails.billingAddressRaw.line1 ? `<p style="margin: 2px 0;">Street: ${orderDetails.billingAddressRaw.line1}</p>` : ''}
                    ${orderDetails.billingAddressRaw.line2 ? `<p style="margin: 2px 0;">Address Line 2: ${orderDetails.billingAddressRaw.line2}</p>` : ''}
                    ${orderDetails.billingAddressRaw.city ? `<p style="margin: 2px 0;">City: ${orderDetails.billingAddressRaw.city}</p>` : ''}
                    ${orderDetails.billingAddressRaw.state ? `<p style="margin: 2px 0;">State/County: ${orderDetails.billingAddressRaw.state}</p>` : ''}
                    ${orderDetails.billingAddressRaw.postal_code ? `<p style="margin: 2px 0;">Postal Code: ${orderDetails.billingAddressRaw.postal_code}</p>` : ''}
                    ${orderDetails.billingAddressRaw.country ? `<p style="margin: 2px 0;"><strong>Country:</strong> ${orderDetails.billingAddressRaw.country}</p>` : ''}
                  </div>
                  ` : ''}
                </div>
                ` : ''}
              </div>
              ` : ''}
              
              <p style="color: #666;">Please process this order and prepare for shipping.</p>
            </div>
            <div class="footer">
              <p>© 2024 Leverage Journal™. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `New Order Received\n\nOrder ID: ${orderDetails.orderId}\nCustomer Email: ${customerEmail}\nCustomer Name: ${orderDetails.customerName || 'Not provided'}\n${orderDetails.phone ? `Phone: ${orderDetails.phone}\n` : ''}Product: ${orderDetails.productName}\nQuantity: ${orderDetails.quantity}\nTotal: ${orderDetails.price}\nPayment Status: Paid\n\n${orderDetails.shippingAddress ? `Shipping Address:\n${orderDetails.shippingName && orderDetails.shippingName !== orderDetails.customerName ? `Name: ${orderDetails.shippingName}\n` : ''}${orderDetails.shippingAddress}\n${orderDetails.shippingAddressRaw?.country ? `Country: ${orderDetails.shippingAddressRaw.country}\n` : ''}\n` : ''}${orderDetails.billingAddress ? `Billing Address:\n${orderDetails.billingAddress}\n${orderDetails.billingAddressRaw?.country ? `Country: ${orderDetails.billingAddressRaw.country}\n` : ''}\n` : ''}Please process this order and prepare for shipping.`,
    };

    const adminInfo = await transporter.sendMail(adminMailOptions);
    console.log('Admin notification email sent:', adminInfo.messageId);
    
    return { 
      success: true, 
      customerMessageId: customerInfo.messageId,
      adminMessageId: adminInfo.messageId
    };
  } catch (error: any) {
    console.error('Order confirmation email error:', error);
    throw new Error(`Failed to send order confirmation email: ${error.message}`);
  }
}





