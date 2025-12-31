import LoginForm from "@/app/(auth)/login/LoginForm";

function Login() {
  return (
    <div>
      <div>
        <h2 className="text-4xl text-center font-bold text-foreground mt-3">
          Log in
        </h2>
        <p className="text-secondary text-center mt-3 mb-7">
          Log in to manage your account and workspaces.
        </p>
        <LoginForm />
      </div>
    </div>
  );
}

export default Login;
