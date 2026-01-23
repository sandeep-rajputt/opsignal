import VerifyAccountClient from "@/app/(auth)/verify/VerifyAccount.client";

export const metadata = {
  title: "Verify Your Email - Complete Registration | Opsignal",
  description:
    "Complete your Opsignal account setup by verifying your email address. Check your inbox for the verification link to activate your account and start using our engineering operations platform.",
};

function Verify() {
  return (
    <div>
      <div>
        <VerifyAccountClient />
      </div>
    </div>
  );
}

export default Verify;
