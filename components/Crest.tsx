/**
 * The group seal: the 3 → 1 mark (three inputs, one decision) inside two
 * rings, with the full name set around the outer one. Drawn for a dark
 * ground; the ring of text turns slowly and the decision node breathes.
 * Decorative: the page names the group in text beside it.
 */
export default function Crest({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 400" aria-hidden="true" className={`crest ${className}`}>
      <defs>
        <path id="crest-ring" d="M200,200 m-150,0 a150,150 0 1,1 300,0 a150,150 0 1,1 -300,0" />
      </defs>

      <circle className="crest-rule" cx="200" cy="200" r="182" />
      <circle className="crest-rule" cx="200" cy="200" r="122" />

      <g className="crest-ring">
        <text className="crest-text">
          <textPath href="#crest-ring" textLength="930" lengthAdjust="spacing">UNIVERSITY OF TORONTO · DECISION SYSTEMS ·</textPath>
        </text>
      </g>

      <g className="crest-edges">
        <line x1="140" y1="150" x2="250" y2="200" pathLength={1} />
        <line x1="140" y1="200" x2="250" y2="200" pathLength={1} />
        <line x1="140" y1="250" x2="250" y2="200" pathLength={1} />
      </g>
      <g className="crest-inputs">
        <circle cx="140" cy="150" r="11" />
        <circle cx="140" cy="200" r="11" />
        <circle cx="140" cy="250" r="11" />
      </g>
      <circle className="crest-decision" cx="250" cy="200" r="20" />
    </svg>
  );
}

/**
 * The crest as the site logo: the same seal at nav size. The ring lettering
 * would be about 2px tall here, so this version keeps the navy disc, both
 * rings and the 3 → 1 mark, and drops the text. Static, unlike the full crest.
 */
export function CrestBadge({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 400" aria-hidden="true" className={className}>
      <circle cx="200" cy="200" r="198" fill="#0a1838" />
      <circle cx="200" cy="200" r="168" fill="none" stroke="rgb(255 255 255 / 0.45)" strokeWidth="10" />
      <circle cx="200" cy="200" r="112" fill="none" stroke="rgb(255 255 255 / 0.45)" strokeWidth="10" />
      <g stroke="#ffffff" strokeWidth="16" strokeLinecap="round">
        <line x1="140" y1="150" x2="250" y2="200" />
        <line x1="140" y1="200" x2="250" y2="200" />
        <line x1="140" y1="250" x2="250" y2="200" />
      </g>
      <g fill="#ffffff">
        <circle cx="140" cy="150" r="20" />
        <circle cx="140" cy="200" r="20" />
        <circle cx="140" cy="250" r="20" />
      </g>
      <circle cx="250" cy="200" r="34" fill="#3d6bff" />
    </svg>
  );
}
