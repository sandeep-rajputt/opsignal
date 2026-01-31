export type ResetPassword = { link: string };

export const resetPasswordSubject = "Reset your password - Opsignal";

function resetPasswordEmail({ link }: ResetPassword) {
  return `<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f7;">
    
    <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f5f5f7; padding: 60px 20px;">
        <tr>
            <td align="center">
                
                <!-- Main Container -->
                <table role="presentation" style="max-width: 560px; width: 100%; border-collapse: collapse; background: #ffffff; border-radius: 12px; box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08); overflow: hidden;">
                    
                    <!-- Header -->
                    <tr>
                        <td style="padding: 48px 48px 32px; text-align: center;">
                            <h1 style="margin: 0 0 12px; color: #1d1d1f; font-size: 28px; font-weight: 600; letter-spacing: -0.5px;">Reset your password</h1>
                            <p style="margin: 0; color: #86868b; font-size: 16px; line-height: 1.5;">We received a request to reset your password.</p>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 0 48px 48px;">
                            
                            <p style="margin: 0 0 32px; color: #1d1d1f; font-size: 15px; line-height: 1.6;">
                                Click the button below to create a new password. This link will expire in 1 hours for security reasons.
                            </p>
                            
                            <!-- CTA Button -->
                            <table role="presentation" style="width: 100%; border-collapse: collapse;">
                                <tr>
                                    <td align="center" style="padding: 0 0 32px;">
                                        <a href='${link}' style="display: inline-block; padding: 14px 32px; background-color: #0071e3; color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 15px; font-weight: 500; letter-spacing: -0.2px;">
                                            Reset Password
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="margin: 0 0 8px; color: #86868b; font-size: 13px; line-height: 1.5;">
                                Or copy and paste this link:
                            </p>
                            
                            <div style="padding: 12px 16px; background-color: #f5f5f7; border-radius: 6px; margin-bottom: 32px;">
                                <p style="margin: 0; color: #0071e3; font-size: 12px; word-break: break-all;">
                                    ${link}
                                </p>
                            </div>
                            
                            <p style="margin: 0; color: #86868b; font-size: 13px; line-height: 1.5;">
                                If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
                            </p>
                            
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 32px 48px; background-color: #fafafa; border-top: 1px solid #e8e8ed;">
                            <p style="margin: 0; color: #86868b; font-size: 12px; line-height: 1.5; text-align: center;">
                                © 2025 Opsignal. All rights reserved.
                            </p>
                        </td>
                    </tr>
                    
                </table>
                
            </td>
        </tr>
    </table>
    
</body>`;
}

export default resetPasswordEmail;
