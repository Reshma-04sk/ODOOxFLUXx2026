import React from "react";

export function SquareLogo({
  size = 20,
  className = "",
  innerClassName = "",
}: {
  size?: number;
  className?: string;
  innerClassName?: string;
}) {
  const innerSize = Math.max(4, Math.round(size * 0.4));
  return (
    <div
      style={{ width: size, height: size }}
      className={`border-2 border-current flex items-center justify-center shrink-0 ${className}`}
      aria-label="PlanLedger Logo"
    >
      <div
        style={{ width: innerSize, height: innerSize }}
        className={`bg-current ${innerClassName}`}
      />
    </div>
  );
}