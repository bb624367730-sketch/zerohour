import { useCountdown } from '../hooks/useCountdown';
import { useT } from '../i18n/context';

interface Props {
  timerEndMs?: string | number | null;
}

export function CountdownTimer({ timerEndMs }: Props) {
  const cd = useCountdown(timerEndMs);
  const { t } = useT();

  if (cd.isExpired) {
    return (
      <span style={{ color: 'var(--red)', fontWeight: 600 }}>{t('countdown.ended')}</span>
    );
  }

  const pad = (n: number) => String(n).padStart(2, '0');
  const cls = cd.isUrgent ? 'countdown-inline urgent' : 'countdown-inline';

  return (
    <span className={cls}>
      <span className="seg">{pad(cd.hours)}</span>
      <span className="sep">:</span>
      <span className="seg">{pad(cd.minutes)}</span>
      <span className="sep">:</span>
      <span className="seg">{pad(cd.seconds)}</span>
    </span>
  );
}
