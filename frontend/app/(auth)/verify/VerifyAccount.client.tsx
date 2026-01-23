"use client";

import dynamic from "next/dynamic";
import FlyingLoader from "@/components/shared/FlyingLoader";

const VerifyAccount = dynamic(() => import("./VerifyAccount"), {
  ssr: false,
  loading: () => (
    <div>
      <FlyingLoader height="h-[250px]" />
      <p className="text-center text-secondary">Verifying Your Account...</p>
    </div>
  ),
});

export default function VerifyAccountClient() {
  return <VerifyAccount />;
}
