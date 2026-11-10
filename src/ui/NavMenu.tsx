import { portfolio } from '../data/portfolio';
import { navigationStore, useNavigation } from '../state/navigation';

const { focus, hover } = navigationStore.getState();

/** Accessible list of every body — the keyboard/screen-reader route into the solar system. */
export function NavMenu() {
  const active = useNavigation((s) => s.active);

  return (
    <nav className="nav-menu" aria-label="Solar system">
      <ul>
        {portfolio.sections.map((section) => (
          <li key={section.id}>
            <button
              type="button"
              aria-current={active === section.id ? 'true' : undefined}
              onClick={() => focus(section.id)}
              onMouseEnter={() => hover(section.id)}
              onMouseLeave={() => hover(null)}
              onFocus={() => hover(section.id)}
              onBlur={() => hover(null)}
            >
              <span
                className={`nav-dot nav-dot--${section.body.kind === 'sun' ? 'sun' : section.body.surface}`}
                aria-hidden="true"
              />
              {section.title}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
