import React from "react";

interface LoaderProps {
  width?: number;
}

const Loader: React.FC<LoaderProps> = ({ width = 44 }) => {
  const halfWidth = width / 2;

  const cubeStyle: React.CSSProperties = {
    width: `${width}px`,
    height: `${width}px`,
    animation: "spinCube 2s infinite ease",
    transformStyle: "preserve-3d",
  };

  const faceStyle: React.CSSProperties = {
    height: "100%",
    position: "absolute",
    width: "100%",
  };

  return (
    <>
      <style>{`
        @keyframes spinCube {
          0% {
            transform: rotate(45deg) rotateX(-25deg) rotateY(25deg);
          }
          50% {
            transform: rotate(45deg) rotateX(-385deg) rotateY(25deg);
          }
          100% {
            transform: rotate(45deg) rotateX(-385deg) rotateY(385deg);
          }
        }
      `}</style>

      <div style={cubeStyle} className="relative">
        <div
          style={{
            ...faceStyle,
            transform: `translateZ(-${halfWidth}px) rotateY(180deg)`,
          }}
          className="border-2 border-foreground"
        />
        <div
          style={{
            ...faceStyle,
            transform: "rotateY(-270deg) translateX(50%)",
            transformOrigin: "top right",
          }}
          className="border-2 border-foreground"
        />
        <div
          style={{
            ...faceStyle,
            transform: "rotateY(270deg) translateX(-50%)",
            transformOrigin: "center left",
          }}
          className="border-2 border-foreground"
        />
        <div
          style={{
            ...faceStyle,
            transform: "rotateX(90deg) translateY(-50%)",
            transformOrigin: "top center",
          }}
          className="border-2 border-foreground"
        />
        <div
          style={{
            ...faceStyle,
            transform: "rotateX(-90deg) translateY(50%)",
            transformOrigin: "bottom center",
          }}
          className="border-2 border-foreground"
        />
        <div
          style={{
            ...faceStyle,
            transform: `translateZ(${halfWidth}px)`,
          }}
          className="border-2 border-foreground"
        />
      </div>
    </>
  );
};
export default Loader;
