"use client";

import dynamic from "next/dynamic";
import FlyingLoader from "@/components/shared/FlyingLoader";

const ChangePasswordForm = dynamic(
  () => import("@/app/(auth)/change-password/ChangePasswordForm"),
  {
    ssr: false,
    loading: () => (
      <div>
        <FlyingLoader height="h-[250px]" />
        <p className="text-center text-secondary">Checking your link</p>
      </div>
    ),
  },
);

function ChangePasswordClient() {
  return <ChangePasswordForm />;
}

export default ChangePasswordClient;
