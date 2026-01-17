import ResetPasswordForm from "@/app/(auth)/reset-password/ResetPasswordForm";

export const metadata = {
  title: "Reset Your Password - Recover Account Access | Opsignal",
  description:
    "Forgot your Opsignal password? Enter your email address to receive a secure password reset link and regain access to your incident management and engineering workflow tools.",
};

function Register() {
  return (
    <div>
      <div>
        <ResetPasswordForm />
      </div>
    </div>
  );
}

export default Register;
