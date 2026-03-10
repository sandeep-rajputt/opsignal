import * as React from "react";

interface IncidentSvgProps {
  width?: number;
  className?: string;
}

const IncidentSvg: React.FC<IncidentSvgProps> = ({ width = 24, className }) => {
  const height = (width / 24) * 24; // Maintains aspect ratio

  return (
    <svg
      width={width}
      height={height}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="7.25 1.25 13.5 15.5"
      className={className}
    >
      <path
        d="M12 2C12 2 8 6 8 10C8 13.31 10.69 16 14 16C17.31 16 20 13.31 20 10C20 6 16 2 16 2C16 2 15 4 14 5C13 4 12 2 12 2Z"
        fill="#EF4444"
      />
      <path
        d="M12 2C12 2 8 6 8 10C8 13.31 10.69 16 14 16C17.31 16 20 13.31 20 10C20 6 16 2 16 2C16 2 15 4 14 5C13 4 12 2 12 2Z"
        stroke="#DC2626"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 9C14 9 12 10 12 12C12 13.1 12.9 14 14 14C15.1 14 16 13.1 16 12C16 10 14 9 14 9Z"
        fill="#FCA5A5"
      />
    </svg>
  );
};

export default IncidentSvg;
