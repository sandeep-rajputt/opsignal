export type WorkspaceMemberAdded = {
  name: string;
  workspaceId: string;
  role: string;
};

export const workspaceMemberAddedSubject =
  "You've been added to a workspace - Opsignal";

function workspaceMemberAddedEmail({
  name,
  workspaceId,
  role,
}: WorkspaceMemberAdded) {
  const workspaceUrl = `${process.env.FRONTEND_URL}/dashboard/${workspaceId}`;

  return `<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f7;">
    
    <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f5f5f7; padding: 60px 20px;">
        <tr>
            <td align="center">
                
                <!-- Main Container -->
                <table role="presentation" style="max-width: 560px; width: 100%; border-collapse: collapse; background: #ffffff; border-radius: 12px; box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08); overflow: hidden;">
                    
                    <!-- Header -->
                    <tr>
                        <td style="padding: 48px 48px 32px; text-align: center;">
                            <h1 style="margin: 0 0 12px; color: #1d1d1f; font-size: 28px; font-weight: 600; letter-spacing: -0.5px;">Welcome to the workspace!</h1>
                            <p style="margin: 0; color: #86868b; font-size: 16px; line-height: 1.5;">You've been added as a ${role}</p>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 0 48px 48px;">
                            
                            <p style="margin: 0 0 32px; color: #1d1d1f; font-size: 15px; line-height: 1.6;">
                                Hi ${name},
                            </p>
                            
                            <p style="margin: 0 0 32px; color: #1d1d1f; font-size: 15px; line-height: 1.6;">
                                You've been added to a workspace on Opsignal with the role of <strong>${role}</strong>. You can now access the workspace and start collaborating with your team.
                            </p>
                            
                            <!-- CTA Button -->
                            <table role="presentation" style="width: 100%; border-collapse: collapse;">
                                <tr>
                                    <td align="center" style="padding: 0 0 32px;">
                                        <a href='${workspaceUrl}' style="display: inline-block; padding: 14px 32px; background-color: #0071e3; color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 15px; font-weight: 500; letter-spacing: -0.2px;">
                                            Go to Workspace
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="margin: 0 0 8px; color: #86868b; font-size: 13px; line-height: 1.5;">
                                Or copy and paste this link:
                            </p>
                            
                            <div style="padding: 12px 16px; background-color: #f5f5f7; border-radius: 6px; margin-bottom: 32px;">
                                <p style="margin: 0; color: #0071e3; font-size: 12px; word-break: break-all;">
                                    ${workspaceUrl}
                                </p>
                            </div>
                            
                            <p style="margin: 0; color: #86868b; font-size: 13px; line-height: 1.5;">
                                If you have any questions, feel free to reach out to your workspace administrator.
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

export default workspaceMemberAddedEmail;
