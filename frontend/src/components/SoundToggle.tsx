import { useState, useCallback } from 'react';
import { isSoundEnabled, setSoundEnabled } from '../lib/sounds';
import { useT } from '../i18n/context';

export function SoundToggle() {
  const [on, setOn] = useState(isSoundEnabled);
  const { t } = useT();

  const handleToggle = useCallback(() => {
    const next = !on;
    setOn(next);
    setSoundEnabled(next);
  }, [on]);

  return (
    <button
      className="sound-toggle"
      onClick={handleToggle}
      title={on ? t('sound.mute') : t('sound.enable')}
      aria-label={on ? t('sound.mute') : t('sound.enable')}
    >
      {on ? '\u{1F50A}' : '\u{1F507}'}
    </button>
  );
}
