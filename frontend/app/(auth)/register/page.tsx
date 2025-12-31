import RegisterForm from "@/app/(auth)/register/RegisterForm";

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
