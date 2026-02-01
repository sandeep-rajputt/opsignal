import LogoSvg from "@/svg/Logo";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

function OnboardingHeader() {
  return (
    <header className="py-6  mx-auto flex items-center justify-between">
      <div className="flex items-center gap-2">
        <LogoSvg height={20} />
        <p className="font-bold  text-xl">OPSIGNAL</p>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="destructive">
          Log out <LogOut />
        </Button>
      </div>
    </header>
  );
}

export default OnboardingHeader;
