import Background from "@/components/shared/Background";
import { ReactNode } from "react";
import Container from "@/components/shared/Comtainer";
import OnboardingHeader from "./_components/OnboardingHeader";
import { redirect } from "next/navigation";
import { checkServerAuth } from "@/lib/validateServerAuth";

async function OnboardingLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated, user } = await checkServerAuth();

  if (!isAuthenticated) {
    redirect("/login");
  }

  if (user.workspace) {
    redirect(`/dashboard/${user.workspace}`);
  }

  return (
    <Background>
      <Container className="px-3">
        <OnboardingHeader />
      </Container>
      <Container>{children}</Container>
    </Background>
  );
}

export default OnboardingLayout;
