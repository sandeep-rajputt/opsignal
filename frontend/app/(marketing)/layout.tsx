import Background from "@/components/shared/Background";
import { ReactNode } from "react";
import Container from "@/components/shared/Comtainer";

function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <Background>
      <Container>
        <div className="w-full">{children}</div>
      </Container>
    </Background>
  );
}

export default AuthLayout;
