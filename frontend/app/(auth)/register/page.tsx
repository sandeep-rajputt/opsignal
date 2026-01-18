import RegisterForm from "@/app/(auth)/register/RegisterForm";

export const metadata = {
  title: "Create Your Opsignal Account - Sign Up | Opsignal",
  description:
    "Join Opsignal to streamline your engineering operations. Create your account to access intelligent incident tracking, task management, and team collaboration tools. Sign up with email or connect via Google/GitHub.",
};

function Register() {
  return (
    <div>
      <div>
        <RegisterForm />
      </div>
    </div>
  );
}

export default Register;
