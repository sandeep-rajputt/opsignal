import ChangePasswordForm from "./ChangePasswordForm";

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
