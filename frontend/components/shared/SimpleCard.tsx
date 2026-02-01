"use client";
import { ReactNode } from "react";

function SimpleCard({
  className = "",
  children,
  onClick,
}: {
  className?: string;
  children: ReactNode;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`w-fit bg-card dark:bg-card/80 rounded-lg px-5 py-4 ${className}`}
    >
      {children}
    </div>
  );
}

export default SimpleCard;
