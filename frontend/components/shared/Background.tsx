import { ReactNode } from "react";

function Background({ children }: { children: ReactNode }) {
  return (
    <>
      <div
        className="fixed inset-0 dark:hidden bg-[#f8fafc] -z-10"
        style={{
          backgroundImage: `
            linear-gradient(to right, #e2e8f0 1px, transparent 1px),
            linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)
          `,
          backgroundSize: "20px 30px",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 60% at 50% 0%, #000 5%, transparent 100%)",
          maskImage:
            "radial-gradient(ellipse 70% 50% at 50% 0%, #000 5%, transparent 100%)",
        }}
      />

      <div
        className="fixed inset-0 hidden dark:block bg-black -z-10"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(226, 232, 240, 0.15), transparent 70%), #000000",
        }}
      />

      {children}
    </>
  );
}

export default Background;
