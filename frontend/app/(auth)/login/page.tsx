import LoginForm from "@/app/(auth)/login/LoginForm";

export const metadata = {
  title: "Sign In to Opsignal - Access Your Dashboard | Opsignal",
  description:
    "Sign in to your Opsignal account to manage incidents, track tasks, and collaborate with your engineering team. Access real-time updates, audit logs, and powerful workflow management tools.",
};

function Login() {
  return (
    <div>
      <div>
        <h2 className="text-3xl sm:text-4xl text-center font-bold text-foreground mt-3">
          Log in
        </h2>
        <p className="text-secondary text-center mt-3 mb-7 text-sm sm:text-base">
          Log in to manage your account and workspaces.
        </p>
        <LoginForm />
      </div>
    </div>
  );
}

export default Login;
