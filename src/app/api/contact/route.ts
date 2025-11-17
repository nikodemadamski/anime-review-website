import { NextRequest, NextResponse } from 'next/server';

// Generate a random reference code
function generateReferenceCode(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ANI-${timestamp}-${random}`;
}

// Anime-themed auto-reply messages
const animeMessages = [
  "Your message has been received! We'll respond faster than Goku can teleport! 🐉",
  "Message received! We'll get back to you quicker than Luffy can say 'I'm gonna be King of the Pirates!' 🏴‍☠️",
  "Got your message! We'll reply faster than Light can write in the Death Note! 📓",
  "Message delivered! We'll respond before the next episode's cliffhanger! 📺",
  "Your feedback has been received! We'll get back to you faster than All Might can say 'I am here!' 💪",
  "Message received! We'll respond quicker than Saitama can finish a fight! 👊",
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validate input
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Generate reference code
    const referenceCode = generateReferenceCode();
    const randomMessage = animeMessages[Math.floor(Math.random() * animeMessages.length)];

    // In a production environment, you would use a service like:
    // - SendGrid
    // - Resend
    // - AWS SES
    // - Nodemailer with SMTP
    
    // For now, we'll simulate the email sending
    // You'll need to set up an email service and add your API keys to .env.local
    
    console.log('Contact Form Submission:');
    console.log('Reference Code:', referenceCode);
    console.log('From:', name, '<' + email + '>');
    console.log('Subject:', subject);
    console.log('Message:', message);
    console.log('---');

    // TODO: Implement actual email sending here
    // Example with Resend (recommended):
    /*
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    // Send to your email
    await resend.emails.send({
      from: 'noreply@yourdomain.com',
      to: 'theoneothree@gmail.com',
      subject: `[Contact Form] ${subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Reference Code:</strong> ${referenceCode}</p>
        <p><strong>From:</strong> ${name} (${email})</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `
    });

    // Send auto-reply to user
    await resend.emails.send({
      from: 'noreply@yourdomain.com',
      to: email,
      subject: 'We received your message! 🎌',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #3B82F6;">Thank You for Contacting Us! 🎉</h1>
          <p style="font-size: 16px; color: #374151;">
            ${randomMessage}
          </p>
          <div style="background: #F3F4F6; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <p style="margin: 0; color: #6B7280; font-size: 14px;">Your Reference Code:</p>
            <p style="margin: 10px 0 0 0; font-size: 24px; font-weight: bold; color: #3B82F6; font-family: monospace;">
              ${referenceCode}
            </p>
          </div>
          <p style="color: #6B7280; font-size: 14px;">
            We've received your message and will get back to you as soon as possible. 
            Please keep this reference code for your records.
          </p>
          <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 30px 0;">
          <p style="color: #9CA3AF; font-size: 12px; text-align: center;">
            This is an automated message. Please do not reply to this email.
          </p>
        </div>
      `
    });
    */

    return NextResponse.json({
      success: true,
      referenceCode,
      message: 'Message sent successfully'
    });

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
