import { ReactNode } from "react";

function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`max-w-[1380px] mx-auto px-5 ${className}`}>{children}</div>
  );
}

export default Container;
