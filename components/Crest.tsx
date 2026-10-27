/**
 * The group seal: the 3 → 1 mark (three inputs, one decision) inside two
 * rings, with the full name set around the outer one. Drawn for a dark
 * ground by default, or in ink with `tone="light"`; the ring of text turns slowly and the decision node breathes.
 * Decorative: the page names the group in text beside it.
 */
export default function Crest({ className = "", tone = "dark" }: { className?: string; tone?: "dark" | "light" }) {
  return (
    <svg viewBox="0 0 400 400" aria-hidden="true" className={`crest ${tone === "light" ? "crest-light" : ""} ${className}`}>
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
