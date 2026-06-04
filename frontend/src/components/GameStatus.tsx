import type { GameData } from '../hooks/useGame';
import { CountdownTimer } from './CountdownTimer';
import { formatSui } from '../lib/sui';
import { useT } from '../i18n/context';

interface Props {
  game: GameData;
}

export function GameStatus({ game }: Props) {
  const { t } = useT();
  const jackpotSui = formatSui(game.jackpot);
  const totalKeys = BigInt(game.total_tickets_sold);
  const totalVolume = formatSui(game.total_sui_volume);
  const totalPlayers = game.team_players.reduce((sum, p) => sum + Number(p), 0);

  return (
    <>
      <div className="hero">
        <div className="hero-bg-glow" />
        <div className="hero-floating-emojis" aria-hidden="true">
          <span className="float-emoji e1">{'\u{1F436}'}</span>
          <span className="float-emoji e2">{'\u{1F438}'}</span>
          <span className="float-emoji e3">{'\u{1F412}'}</span>
          <span className="float-emoji e4">{'\u{1F431}'}</span>
        </div>

        <div className="hero-round">{t('game.round', { round: game.round })}</div>
        <div className="hero-tagline">
          {t('game.tagline')}
        </div>

        <div className="hero-jackpot-label">{t('game.jackpot')}</div>
        <div className="hero-jackpot">
          <span className="hero-jackpot-value">{jackpotSui}</span>
          <span className="hero-unit">SUI</span>
        </div>

        <div className="hero-stats-row">
          <div className="hero-stat">
            <div className="hero-stat-value">{Number(totalKeys).toLocaleString()}</div>
            <div className="hero-stat-label">{t('game.ticketsSold')}</div>
          </div>
          <div className="hero-stat-divider" />
          <div className="hero-stat">
            <div className="hero-stat-value">{totalPlayers.toLocaleString()}</div>
            <div className="hero-stat-label">{t('game.totalPlayers')}</div>
          </div>
          <div className="hero-stat-divider" />
          <div className="hero-stat">
            <div className="hero-stat-value gold">{totalVolume} SUI</div>
            <div className="hero-stat-label">{t('game.totalVolume')}</div>
          </div>
        </div>

        <div className="hero-timer">
          <CountdownTimer timerEndMs={game.timer_end_ts} />
        </div>
      </div>

    </>
  );
}
