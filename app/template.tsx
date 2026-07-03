/**
 * A template re-mounts on every navigation, so this wrapper's CSS enter
 * animation (.page-enter — fade + a short rise) plays each time the route
 * changes. The fixed Nav lives in the layout, outside this wrapper, so the
 * transform here never disturbs it. Reduced motion is respected globally.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
