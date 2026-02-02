import Background from "@/components/shared/Background";
import { ReactNode } from "react";
import Container from "@/components/shared/Comtainer";
import OnboardingHeader from "./_components/OnboardingHeader";
import { redirect } from "next/navigation";
import checkPrimaryWorkspace from "@/lib/checkPrimaryWorkspace";
import ClientPage from "@/app/onboarding/_components/ClientPage";

async function OnboardingLayout({ children }: { children: ReactNode }) {
  const { status, hasWorkspace, workspaceId } = await checkPrimaryWorkspace();

  if (status === 200 && hasWorkspace && workspaceId) {
    redirect(`/dashboard/${workspaceId}`);
  }

  return (
    <Background>
      <Container className="px-3">
        <OnboardingHeader />
      </Container>
      <Container>
        <ClientPage status={status}>{children}</ClientPage>
      </Container>
    </Background>
  );
}

export default OnboardingLayout;
