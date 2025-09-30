# Password Reset Email Fix - N8N Workflow Update

## Problem
The password reset emails are currently using localhost URLs instead of production URLs, causing users to receive broken links.

## Solution
Update the n8n workflow to use the correct production URL for password reset links.

## Updated Email Template

Replace the current `password_reset` case in your n8n workflow with this updated version:

```javascript
case 'password_reset':
  processedEmail = {
    to: webhookData.to,
    from: 'seb@henly.ai',
    subject: 'Reset your password - Henly AI',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Password - Henly AI</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8fafc;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%); padding: 40px 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0 0 10px 0; font-size: 28px; font-weight: 700;">🔑 Reset Your Password</h1>
            <p style="color: #fef2f2; font-size: 18px; margin: 0; font-weight: 300;">Secure your Henly AI account</p>
          </div>
          
          <!-- Main Content -->
          <div style="padding: 40px 30px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <p style="font-size: 16px; color: #4a5568; margin: 0 0 20px 0; line-height: 1.7;">
                Hi <strong style="color: #dc2626;">${webhookData.metadata?.userName || 'there'}</strong>, we received a request to reset your password for your <strong style="color: #dc2626;">Henly AI</strong> account.
              </p>
              
              <p style="font-size: 16px; color: #4a5568; margin: 0; line-height: 1.7;">
                If you didn't request this, you can safely ignore this email and your password will remain unchanged.
              </p>
            </div>
            
            <!-- CTA Button -->
            <div style="text-align: center; margin: 40px 0;">
              <a href="${webhookData.metadata?.resetUrl || 'https://henly.ai/reset-password'}" 
                 style="background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 16px; display: inline-block; box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3); transition: all 0.3s ease;">
                Reset Password
              </a>
            </div>
            
            <!-- Security Notice -->
            <div style="text-align: center; margin-top: 30px;">
              <p style="font-size: 14px; color: #718096; margin: 0; padding: 12px 20px; background-color: #fef2f2; border-radius: 8px; border-left: 4px solid #dc2626;">
                🔒 This reset link expires in 1 hour for security
              </p>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="color: #718096; font-size: 14px; margin: 0;">
              Questions? Contact us at <a href="mailto:seb@henly.ai" style="color: #595F39; text-decoration: none; font-weight: 500;">seb@henly.ai</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Reset Your Password - Henly AI

Hi ${webhookData.metadata?.userName || 'there'}, we received a request to reset your password for your Henly AI account.

If you didn't request this, you can safely ignore this email.

Reset your password: ${webhookData.metadata?.resetUrl || 'https://henly.ai/reset-password'}

This reset link expires in 1 hour.

Questions? Contact us at seb@henly.ai
    `
  };
  break;
```

## Key Changes Made

1. **Fixed URL Reference**: Changed from `${webhookData.metadata?.resetUrl || '#'}` to `${webhookData.metadata?.resetUrl || 'https://henly.ai/reset-password'}`

2. **Added Fallback URL**: Now uses `https://henly.ai/reset-password` as the fallback instead of `#`

3. **Enhanced User Experience**: Added user name in the greeting for better personalization

## Environment Variables to Update

Make sure your production environment has the correct URL:

```env
NEXT_PUBLIC_SITE_URL=https://henly.ai
NEXT_PUBLIC_APP_URL=https://henly.ai
```

## Testing

To test the password reset flow:

1. Go to `https://henly.ai/forgot-password`
2. Enter a valid email address
3. Check that the email contains the correct production URL
4. Click the reset link to verify it works

## Additional Features Added

The application now includes:

- ✅ **Forgot Password Page** (`/forgot-password`)
- ✅ **Password Reset Page** (`/reset-password`)
- ✅ **API Endpoint** (`/api/forgot-password`)
- ✅ **Updated Login Page** with "Forgot Password" link
- ✅ **Password Strength Validation**
- ✅ **Proper Error Handling**
- ✅ **Security Best Practices**

## Next Steps

1. Update your n8n workflow with the new email template
2. Deploy the updated application
3. Test the complete password reset flow
4. Update your environment variables in production
