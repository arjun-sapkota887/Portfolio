import { useEffect, useRef } from 'react';
import { portfolio } from '../data/portfolio';
import { navigationStore, useNavigation } from '../state/navigation';

const { enter, finishIntro } = navigationStore.getState();

/** Galaxy-view greeting; Enter dives the camera into the solar system. */
export function Intro({ instant, diveMs = 1600 }: { instant: boolean; diveMs?: number }) {
  const introDone = useNavigation((s) => s.introDone);
  const diving = useNavigation((s) => s.diving);
  const enterButton = useRef<HTMLButtonElement>(null);

  useEffect(() => enterButton.current?.focus(), []);

  useEffect(() => {
    if (!diving) return;
    const timer = setTimeout(finishIntro, diveMs);
    return () => clearTimeout(timer);
  }, [diving, diveMs]);

  if (introDone) return null;

  return (
    <div className={`intro${diving ? ' intro--leaving' : ''}`} role="dialog" aria-label="Welcome">
      <p className="intro-eyebrow">Welcome to the universe of</p>
      <p className="intro-name">{portfolio.owner.name}</p>
      <p className="intro-role">{portfolio.owner.role}</p>
      <div className="intro-actions">
        <button
          ref={enterButton}
          type="button"
          className="intro-enter"
          disabled={diving}
          onClick={() => (instant ? finishIntro() : enter())}
        >
          Enter the system
        </button>
        <button type="button" className="intro-skip" onClick={finishIntro}>
          Skip intro
        </button>
      </div>
    </div>
  );
}
