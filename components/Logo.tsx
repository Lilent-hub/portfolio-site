/** The JD brand mark — same drawing as app/icon.svg so tab icon and nav match. */
export function Logo({ size = 36, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={className}
      aria-hidden
      focusable="false"
    >
      <rect x="1" y="1" width="62" height="62" rx="14" fill="#111c33" stroke="rgba(255,255,255,0.16)" strokeWidth="2" />
      <g fill="none" stroke="#22d3ee" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M26 20v16.5a5.75 5.75 0 0 1 -11.5 0" />
        <path d="M36.5 20v24M36.5 20h4.5a12 12 0 0 1 0 24h-4.5" />
      </g>
    </svg>
  )
}
