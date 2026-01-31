import ChangePasswordClient from "@/app/(auth)/change-password/ChangePasswordForm.client";

export const metadata = {
  title: "Change Password - Update Account Security | Opsignal",
  description:
    " Update your Opsignal account password to maintain security. Change your password to continue accessing your incident tracking, task management, and team collaboration features safely.",
};

function Login() {
  return (
    <div>
      <div>
        <ChangePasswordClient />
      </div>
    </div>
  );
}

export default Login;
