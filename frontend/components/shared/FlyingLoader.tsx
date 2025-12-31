// Background Lines Component
interface BackgroundLinesProps {
  width?: string;
}

function BackgroundLines({ width = "w-[30%]" }: BackgroundLinesProps) {
  return (
    <div className="longfazers">
      <span className={`${width} h-0.5 bg-foreground absolute`}></span>
      <span className={`${width} h-0.5 bg-foreground absolute`}></span>
      <span className={`${width} h-0.5 bg-foreground absolute`}></span>
      <span className={`${width} h-0.5 bg-foreground absolute`}></span>
    </div>
  );
}

// Flying Man Component
interface FlyingManProps {
  width?: number;
}

function FlyingMan({ width = 60 }: FlyingManProps) {
  return (
    <div
      className="loader text-foreground"
      style={{ "--scale": width / 100 } as React.CSSProperties}
    >
      <span className="bg-foreground">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </span>
      <div className="base">
        <span></span>
        <div className="face"></div>
      </div>
    </div>
  );
}

// Main Component
interface FlyingLoaderProps {
  lineWidth?: string;
  manWidth?: number;
  height?: string;
}

export default function FlyingLoader({
  lineWidth = "w-[30%]",
  manWidth = 60,
  height = "h-full",
}: FlyingLoaderProps) {
  return (
    <>
      <style>{`
        .longfazers {
          position: absolute;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }
        
        .longfazers span:nth-child(1) {
          top: 20%;
          animation: lf 0.8s ease-in-out infinite;
          animation-delay: -5s;
        }
        
        .longfazers span:nth-child(2) {
          top: 40%;
          animation: lf2 1s ease-in-out infinite;
          animation-delay: -1s;
        }
        
        .longfazers span:nth-child(3) {
          top: 60%;
          animation: lf3 0.9s ease-in-out infinite;
        }
        
        .longfazers span:nth-child(4) {
          top: 80%;
          animation: lf4 0.7s ease-in-out infinite;
          animation-delay: -3s;
        }
        
        @keyframes lf {
          0% {
            left: 120%;
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            left: -30%;
            opacity: 0;
          }
        }
        
        @keyframes lf2 {
          0% {
            left: 120%;
            opacity: 0;
          }
          15% {
            opacity: 1;
          }
          85% {
            opacity: 1;
          }
          100% {
            left: -30%;
            opacity: 0;
          }
        }
        
        @keyframes lf3 {
          0% {
            left: 120%;
            opacity: 0;
          }
          12% {
            opacity: 1;
          }
          88% {
            opacity: 1;
          }
          100% {
            left: -30%;
            opacity: 0;
          }
        }
        
        @keyframes lf4 {
          0% {
            left: 120%;
            opacity: 0;
          }
          18% {
            opacity: 1;
          }
          82% {
            opacity: 1;
          }
          100% {
            left: -30%;
            opacity: 0;
          }
        }

        .loader {
          position: absolute;
          top: 50%;
          left: 50%;
          margin-left: -25px;
          margin-top: -10px;
          transform: scale(var(--scale, 0.6));
          animation: speeder 0.4s linear infinite;
        }
        
        .loader > span {
          height: 5px;
          width: 35px;
          position: absolute;
          top: -19px;
          left: 60px;
          border-radius: 2px 10px 1px 0;
        }
        
        .base span {
          position: absolute;
          width: 0;
          height: 0;
          border-top: 6px solid transparent;
          border-right: 100px solid currentColor;
          border-bottom: 6px solid transparent;
        }
        
        .base span:before {
          content: "";
          height: 22px;
          width: 22px;
          border-radius: 50%;
          background: currentColor;
          position: absolute;
          right: -110px;
          top: -16px;
        }
        
        .base span:after {
          content: "";
          position: absolute;
          width: 0;
          height: 0;
          border-top: 0 solid transparent;
          border-right: 55px solid currentColor;
          border-bottom: 16px solid transparent;
          top: -16px;
          right: -98px;
        }
        
        .face {
          position: absolute;
          height: 12px;
          width: 20px;
          background: currentColor;
          border-radius: 20px 20px 0 0;
          transform: rotate(-40deg);
          right: -125px;
          top: -15px;
        }
        
        .face:after {
          content: "";
          height: 12px;
          width: 12px;
          background: currentColor;
          right: 4px;
          top: 7px;
          position: absolute;
          transform: rotate(40deg);
          transform-origin: 50% 50%;
          border-radius: 0 0 0 2px;
        }
        
        .loader > span > span:nth-child(1),
        .loader > span > span:nth-child(2),
        .loader > span > span:nth-child(3),
        .loader > span > span:nth-child(4) {
          width: 30px;
          height: 1px;
          background: currentColor;
          position: absolute;
          animation: fazer1 0.2s linear infinite;
        }
        
        .loader > span > span:nth-child(2) {
          top: 3px;
          animation: fazer2 0.4s linear infinite;
        }
        
        .loader > span > span:nth-child(3) {
          top: 1px;
          animation: fazer3 0.4s linear infinite;
          animation-delay: -1s;
        }
        
        .loader > span > span:nth-child(4) {
          top: 4px;
          animation: fazer4 1s linear infinite;
          animation-delay: -1s;
        }
        
        @keyframes fazer1 {
          0% {
            left: 0;
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
          100% {
            left: -80px;
            opacity: 0;
          }
        }
        
        @keyframes fazer2 {
          0% {
            left: 0;
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
          100% {
            left: -100px;
            opacity: 0;
          }
        }
        
        @keyframes fazer3 {
          0% {
            left: 0;
            opacity: 1;
          }
          50% {
            opacity: 0.9;
          }
          100% {
            left: -50px;
            opacity: 0;
          }
        }
        
        @keyframes fazer4 {
          0% {
            left: 0;
            opacity: 1;
          }
          50% {
            opacity: 0.6;
          }
          100% {
            left: -150px;
            opacity: 0;
          }
        }
        
        @keyframes speeder {
          0% {
            transform: translate(2px, 1px) rotate(0deg) scale(var(--scale, 0.6));
          }
          10% {
            transform: translate(-1px, -3px) rotate(-1deg) scale(var(--scale, 0.6));
          }
          20% {
            transform: translate(-2px, 0px) rotate(1deg) scale(var(--scale, 0.6));
          }
          30% {
            transform: translate(1px, 2px) rotate(0deg) scale(var(--scale, 0.6));
          }
          40% {
            transform: translate(1px, -1px) rotate(1deg) scale(var(--scale, 0.6));
          }
          50% {
            transform: translate(-1px, 3px) rotate(-1deg) scale(var(--scale, 0.6));
          }
          60% {
            transform: translate(-1px, 1px) rotate(0deg) scale(var(--scale, 0.6));
          }
          70% {
            transform: translate(3px, 1px) rotate(-1deg) scale(var(--scale, 0.6));
          }
          80% {
            transform: translate(-2px, -1px) rotate(1deg) scale(var(--scale, 0.6));
          }
          90% {
            transform: translate(2px, 1px) rotate(0deg) scale(var(--scale, 0.6));
          }
          100% {
            transform: translate(1px, -2px) rotate(-1deg) scale(var(--scale, 0.6));
          }
        }
      `}</style>

      <div className={`relative w-full ${height} overflow-hidden`}>
        <BackgroundLines width={lineWidth} />
        <FlyingMan width={manWidth} />
      </div>
    </>
  );
}
