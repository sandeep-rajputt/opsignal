"use client";
import { useQueryState } from "nuqs";
import { useVerifyMutation } from "@/Store/api/verifyAccountApi";
import { useEffect, useState } from "react";
import FlyingLoader from "@/components/shared/FlyingLoader";
import { MailCheck, TriangleAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import isApiError from "@/utils/isApiError";

function VerifyAccount() {
  const router = useRouter();
  const [token] = useQueryState("token");
  const [verify] = useVerifyMutation();

  const [error, setError] = useState<string | null>(null);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (!token) return;

    const verifyAccount = async () => {
      try {
        await verify(token).unwrap();
        setVerified(true);
        router.replace("/onboarding");
      } catch (err) {
        const apiError = isApiError(err);
        setError(
          apiError?.message ?? "Something went wrong, please try again later",
        );
      }
    };

    verifyAccount();
  }, [token, verify, router]);

  if (!token) {
    console.log(token);
    return (
      <div className="flex flex-col my-5 items-center justify-center gap-5">
        <TriangleAlert size={50} className="text-danger" />
        <p className="text-secondary">Verification link is invalid</p>
      </div>
    );
  }

  if (verified) {
    return (
      <div className="flex flex-col my-5 items-center justify-center gap-5">
        <MailCheck size={50} className="text-green-500" />
        <div>
          <p className="text-center">Account Verified Successfully</p>
          <p className="text-secondary text-center">Redirecting...</p>
        </div>
      </div>
    );
  }

  if (!error) {
    return (
      <div>
        <FlyingLoader height="h-[250px]" />
        <p className="text-center text-secondary">Verifying Your Account...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col my-5 items-center justify-center gap-3">
      <TriangleAlert size={40} className="text-danger" />
      <p className="text-secondary text-center">{error}</p>
    </div>
  );
}

export default VerifyAccount;
