// components/Spinner.tsx
import React from "react";

interface SpinnerProps {
  fill?: string;
  width?: number;
  height?: number;
}

export default function Spinner({
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
          style={{
            animation: "move1 1s infinite alternate",
          }}
        />
        <circle
          cx="12"
          cy={height / 2}
          r="3"
          fill={fill}
          style={{
            animation: "move2 1s infinite alternate",
          }}
        />
        <circle
          cx="20"
          cy={height / 2}
          r="3"
          fill={fill}
          style={{
            animation: "move3 1s infinite alternate",
          }}
        />
      </svg>

      <style jsx>{`
        @keyframes move1 {
          0% {
            cx: 4;
          }
          50% {
            cx: 20;
          }
          100% {
            cx: 4;
          }
        }
        @keyframes move2 {
          0% {
            cx: 12;
          }
          50% {
            cx: 4;
          }
          100% {
            cx: 12;
          }
        }
        @keyframes move3 {
          0% {
            cx: 20;
          }
          50% {
            cx: 12;
          }
          100% {
            cx: 20;
          }
        }
      `}</style>
    </div>
  );
}
