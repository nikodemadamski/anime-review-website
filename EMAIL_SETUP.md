# Email Setup Guide for Contact Form

Your contact form is ready! To enable actual email sending, follow these steps:

## Option 1: Resend (Recommended - Easiest Setup)

Resend is a modern email API that's perfect for Next.js apps.

### Steps:

1. **Sign up for Resend**
   - Go to https://resend.com
   - Sign up for a free account (100 emails/day free)

2. **Get your API key**
   - Go to API Keys in your dashboard
   - Create a new API key
   - Copy the key

3. **Add to your project**
   ```bash
   npm install resend
   ```

4. **Create `.env.local` file** (if you don't have one)
   ```env
   RESEND_API_KEY=re_your_api_key_here
   ```

5. **Update the API route**
   - Open `src/app/api/contact/route.ts`
   - Uncomment the Resend code (lines marked with TODO)
   - Update `from` email to match your verified domain or use `onboarding@resend.dev` for testing

6. **Verify your domain** (for production)
   - In Resend dashboard, add your domain
   - Add the DNS records they provide
   - Once verified, update the `from` email in the code

### Quick Test Setup:
For testing, you can use Resend's test domain:
```typescript
from: 'onboarding@resend.dev'
```

## Option 2: SendGrid

1. Sign up at https://sendgrid.com
2. Get API key
3. Install: `npm install @sendgrid/mail`
4. Add to `.env.local`: `SENDGRID_API_KEY=your_key`

## Option 3: Nodemailer (Use your own SMTP)

1. Install: `npm install nodemailer`
2. Add SMTP credentials to `.env.local`
3. Configure in the API route

## Current Status

Right now, the form:
- ✅ Validates input
- ✅ Generates reference codes
- ✅ Shows success/error messages
- ✅ Logs submissions to console
- ⏳ Needs email service configured (see above)

## Testing

Once configured, test by:
1. Go to http://localhost:3000/contact
2. Fill out the form
3. Check your email (theoneothree@gmail.com) for the submission
4. Check the sender's email for the auto-reply with reference code

## Auto-Reply Features

The auto-reply includes:
- Random anime-themed message (6 different variations)
- Unique reference code (format: ANI-TIMESTAMP-RANDOM)
- Professional formatting
- "Do not reply" notice

## Need Help?

If you need help setting this up, let me know which email service you'd prefer and I can provide more detailed instructions!
