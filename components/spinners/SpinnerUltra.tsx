// components/Spinner.tsx
import React from "react";

interface SpinnerProps {
  fill?: string;
  width?: number;
  height?: number;
}

export default function SpinnerUltra({
  fill = "hsla(0, 0%, 100%, 1.00)",
  width = 24,
  height = 24,
}: SpinnerProps) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100vw",
        height: "100vh",
      }}
    >
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <circle
          cx="4"
          cy={height / 2}
          r="3"
          fill={fill}
          className="dot1"
        />
        <circle
          cx="12"
          cy={height / 2}
          r="3"
          fill={fill}
          className="dot2"
        />
        <circle
          cx="20"
          cy={height / 2}
          r="3"
          fill={fill}
          className="dot3"
        />
      </svg>

      <style jsx>{`
        /* Cubic Bezier matching React Native easing */
        .dot1, .dot2, .dot3 {
          animation-duration: 1s;
          animation-iteration-count: infinite;
          animation-direction: alternate;
          animation-timing-function: cubic-bezier(0.36, 0.6, 0.31, 1);
        }

        .dot1 {
          animation-name: move1;
        }
        .dot2 {
          animation-name: move2;
        }
        .dot3 {
          animation-name: move3;
        }

        @keyframes move1 {
          0% { cx: 4; }
          50% { cx: 20; }
          100% { cx: 4; }
        }
        @keyframes move2 {
          0% { cx: 12; }
          50% { cx: 4; }
          100% { cx: 12; }
        }
        @keyframes move3 {
          0% { cx: 20; }
          50% { cx: 12; }
          100% { cx: 20; }
        }
      `}</style>
    </div>
  );
}
