import ChangePasswordForm from "@/app/(auth)/change-password/ChangePasswordForm";

export const metadata = {
  title: "Change Password - Update Account Security | Opsignal",
  description:
    " Update your Opsignal account password to maintain security. Change your password to continue accessing your incident tracking, task management, and team collaboration features safely.",
};

function Login() {
  return (
    <div>
      <div>
        <h2 className="text-4xl text-center font-bold text-foreground">
          Change password
        </h2>

        <p className="text-secondary w-full mx-auto mt-3 mb-7 max-w-sm text-center">
          Set a new password to keep your account secure and continue.
        </p>

        <ChangePasswordForm />
      </div>
    </div>
  );
}

export default Login;
