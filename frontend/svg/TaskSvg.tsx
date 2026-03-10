import * as React from "react";

interface TaskSvgProps {
  width?: number;
  className?: string;
}

const TaskSvg: React.FC<TaskSvgProps> = ({ width = 24, className }) => {
  const height = (width / 24) * 24; // Maintains aspect ratio

  return (
    <svg
      width={width}
      height={height}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="2.25 2.25 19.5 19.5"
      className={className}
    >
      <rect x={3} y={3} width={18} height={18} rx={4} fill="#3B82F6" />
      <rect
        x={3}
        y={3}
        width={18}
        height={18}
        rx={4}
        stroke="#2563EB"
        strokeWidth={1.5}
      />
      <path
        d="M7 12L10.5 15.5L17 9"
        stroke="white"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default TaskSvg;
