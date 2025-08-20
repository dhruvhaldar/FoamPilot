import React from 'react';

export function Logo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 150 40"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
    >
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: 'hsl(var(--primary))', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: 'hsl(var(--accent))', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <path
        d="M 10 10 C 20 0, 30 0, 40 10 S 50 20, 60 10"
        stroke="url(#grad1)"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />
      <text
        x="5"
        y="35"
        fontFamily="var(--font-family-headline, Inter, sans-serif)"
        fontSize="24"
        fontWeight="bold"
        fill="hsl(var(--foreground))"
      >
        FoamPilot
      </text>
    </svg>
  );
}
