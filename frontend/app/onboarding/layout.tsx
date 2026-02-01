import Background from "@/components/shared/Background";
import { ReactNode } from "react";
import Container from "@/components/shared/Comtainer";
import OnboardingHeader from "./_components/OnboardingHeader";

function OnboardingLayout({ children }: { children: ReactNode }) {
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
