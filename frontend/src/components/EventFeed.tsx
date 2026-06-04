import { useActivityFeed, type ActivityEvent } from '../hooks/useActivityFeed';
import { formatSui, shortenAddress, timeAgo } from '../lib/sui';
import { getTeamInfo, getTeamTransKey } from '../constants';
import { useT } from '../i18n/context';

function EventRow({ event, t }: { event: ActivityEvent; t: (key: string, params?: Record<string, string | number>) => string }) {
  const icon = EVENT_ICONS[event.type];
  const message = formatEventMessage(event, t);

  return (
    <div className="event-row">
      <span className="event-icon">{icon}</span>
      <span className="event-msg">{message}</span>
      <span className="event-time">{timeAgo(event.timestamp)}</span>
    </div>
  );
}

const EVENT_ICONS: Record<ActivityEvent['type'], string> = {
  ticket: '\u{1F3AB}',
  airdrop: '\u{2728}',
  dividend: '\u{1F4B0}',
  round_end: '\u{1F3C6}',
};

function formatEventMessage(
  e: ActivityEvent,
  t: (key: string, params?: Record<string, string | number>) => string,
): string {
  switch (e.type) {
    case 'ticket': {
      const teamInfo = getTeamInfo(e.team ?? 0);
      const transKey = getTeamTransKey(e.team ?? 0);
      return t('feed.ticket', {
        buyer: shortenAddress(e.buyer ?? ''),
        tickets: e.tickets ?? 0,
        emoji: teamInfo.emoji,
        team: t(`team.${transKey}.name`),
        amount: formatSui(e.amount ?? '0'),
      });
    }
    case 'airdrop':
      return t('feed.airdrop', {
        player: shortenAddress(e.player ?? ''),
        amount: formatSui(e.amount ?? '0'),
      });
    case 'dividend':
      return t('feed.dividend', {
        player: shortenAddress(e.player ?? ''),
        amount: formatSui(e.amount ?? '0'),
      });
    case 'round_end': {
      const teamInfo = getTeamInfo(e.winner_team ?? 0);
      const transKey = getTeamTransKey(e.winner_team ?? 0);
      return t('feed.roundEnd', {
        round: e.round ?? 0,
        winner: shortenAddress(e.winner ?? ''),
        emoji: teamInfo.emoji,
        team: t(`team.${transKey}.name`),
        amount: formatSui(e.jackpot_amount ?? '0'),
      });
    }
  }
}

export function EventFeed() {
  const { events, isLoading } = useActivityFeed(15);
  const { t } = useT();

  if (isLoading && events.length === 0) {
    return (
      <div className="card event-feed">
        <div className="card-header">{t('feed.title')}</div>
        <div className="event-empty">{t('app.loading')}</div>
      </div>
    );
  }

  if (!isLoading && events.length === 0) {
    return (
      <div className="card event-feed">
        <div className="card-header">{t('feed.title')}</div>
        <div className="event-empty">{t('feed.empty')}</div>
      </div>
    );
  }

  return (
    <div className="card event-feed">
      <div className="card-header">{t('feed.title')}</div>
      <div className="event-list">
        {events.map((event, i) => (
          <EventRow key={`${event.type}-${event.timestamp}-${i}`} event={event} t={t} />
        ))}
      </div>
    </div>
  );
}
