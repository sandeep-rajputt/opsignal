import * as React from "react";

interface ImprovementSvgProps {
  width?: number;
  className?: string;
}

const ImprovementSvg: React.FC<ImprovementSvgProps> = ({
  width = 24,
  className,
}) => {
  const height = (width / 24) * 24; // Maintains aspect ratio

  return (
    <svg
      width={width}
      height={height}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="6.25 1.25 11.5 20.5"
      className={className}
    >
      <path
        d="M12 2C9.24 2 7 4.24 7 7C7 8.85 7.92 10.48 9.34 11.43C9.74 11.72 10 12.17 10 12.66V14C10 15.1 10.9 16 12 16C13.1 16 14 15.1 14 14V12.66C14 12.17 14.26 11.72 14.66 11.43C16.08 10.48 17 8.85 17 7C17 4.24 14.76 2 12 2Z"
        fill="#10B981"
      />
      <path
        d="M12 2C9.24 2 7 4.24 7 7C7 8.85 7.92 10.48 9.34 11.43C9.74 11.72 10 12.17 10 12.66V14C10 15.1 10.9 16 12 16C13.1 16 14 15.1 14 14V12.66C14 12.17 14.26 11.72 14.66 11.43C16.08 10.48 17 8.85 17 7C17 4.24 14.76 2 12 2Z"
        stroke="#059669"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 19C10 20.1 10.9 21 12 21C13.1 21 14 20.1 14 19"
        stroke="#059669"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 16H14"
        stroke="#059669"
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      <circle cx={12} cy={7} r={2} fill="#D1FAE5" />
    </svg>
  );
};

export default ImprovementSvg;
