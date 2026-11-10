import { portfolio } from '../data/portfolio';
import { useNavigation } from '../state/navigation';

const sections = new Map(portfolio.sections.map((s) => [s.id, s]));

/** Small caption naming the body under the pointer. */
export function HoverLabel() {
  const hovered = useNavigation((s) => s.hovered);
  const active = useNavigation((s) => s.active);
  const section = hovered && !active ? sections.get(hovered) : undefined;

  return (
    <div className="hover-label" role="status" aria-live="polite">
      {section && (
        <>
          <strong>{section.title}</strong>
          <span>{section.tagline}</span>
        </>
      )}
    </div>
  );
}
