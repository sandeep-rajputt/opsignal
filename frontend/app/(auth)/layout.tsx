import Background from "@/components/shared/Background";
import SimpleCard from "@/components/shared/SimpleCard";
import { ReactNode } from "react";
import Container from "@/components/shared/Comtainer";
import Logo from "@/svg/Logo";

function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <Background>
      <Container>
        <div className="w-full">
          <div className="my-20 w-full max-w-xl mx-auto">
            <div className="flex gap-1 mb-2 items-center">
              <div className="h-fit">
                <Logo height={18} />
              </div>
              <h1 className="font-bold  text-xl">OPSIGNAL</h1>
            </div>
            <SimpleCard className="w-full px-7  py-7">{children}</SimpleCard>
          </div>
        </div>
      </Container>
    </Background>
  );
}

export default AuthLayout;
