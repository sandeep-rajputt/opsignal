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
        <h2 className="text-4xl text-center font-bold text-foreground">
          Register
        </h2>
        <p className="text-secondary w-full mx-auto  mt-3 mb-7 max-w-sm text-center">
          Create your account to manage your workspaces and get started.
        </p>
        <RegisterForm />
      </div>
    </div>
  );
}

export default Register;
