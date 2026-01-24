import Background from "@/components/shared/Background";
import FlyingLoader from "@/components/shared/FlyingLoader";

export default function Loading() {
  return (
    <Background>
      <FlyingLoader height="min-h-screen" />
    </Background>
  );
}
