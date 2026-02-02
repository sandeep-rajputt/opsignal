"use client";
import { ReactNode, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";

function ClientPage({
  children,
  status,
}: {
  children: ReactNode;
  status: number;
}) {
  const router = useRouter();

  useEffect(() => {
    if (status === 401) {
      toast.error("Authentication Required", {
        description: "Please log in to continue accessing your workspace.",
      });
      router.push("/");
    } else if (status === 500) {
      toast.error("Server Error", {
        description:
          "Something went wrong on our end. Please try again in a few moments.",
      });
      router.push("/");
    } else if (status !== 400 && status !== 200) {
      toast.error("Unexpected Error", {
        description:
          "An unexpected error occurred. Please refresh the page or try again later.",
      });
      router.push("/");
    }
  }, [status, router]);

  if (status !== 400 && status !== 200) {
    return (
      <div className="w-full h-full flex items-center justify-center pt-40">
        <Spinner />
      </div>
    );
  }

  return <>{children}</>;
}

export default ClientPage;
