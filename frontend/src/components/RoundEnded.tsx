import { useEffect } from 'react';
import { useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { buildEndRoundTx } from '../lib/sui';
import { formatSui, shortenAddress } from '../lib/sui';
import { getTeamInfo, getTeamTransKey } from '../constants';
import { useCountdown } from '../hooks/useCountdown';
import { useT } from '../i18n/context';
import type { GameData } from '../hooks/useGame';
import { playJackpot } from '../lib/sounds';

interface Props {
  game: GameData;
}

export function RoundEnded({ game }: Props) {
  const { isExpired } = useCountdown(Number(game.timer_end_ts));
  const { mutate: signAndExecute, isPending } = useSignAndExecuteTransaction();
  const { t } = useT();

  useEffect(() => {
    if (isExpired) playJackpot();
  }, [isExpired]);

  if (!isExpired) return null;

  const lastBuyer = game.last_buyer && game.last_buyer !== '0x0000000000000000000000000000000000000000000000000000000000000000';
  const teamInfo = getTeamInfo(game.last_buyer_team);
  const teamTransKey = getTeamTransKey(game.last_buyer_team);
  const jackpotSui = formatSui(game.jackpot);

  const handleEndRound = () => {
    const tx = buildEndRoundTx();
    signAndExecute({ transaction: tx });
  };

  return (
    <div className="round-ended-banner">
      <div className="round-ended-glow" />
      <div className="round-ended-content">
        <div className="round-ended-icon">&#x1F3C6;</div>
        <h2 className="round-ended-title">
          {lastBuyer ? t('roundEnded.title') : 'Round Ended'}
        </h2>

        {lastBuyer ? (
          <>
            <p className="round-ended-winner">
              {teamInfo.emoji} <strong>{shortenAddress(game.last_buyer)}</strong>
            </p>
            <p className="round-ended-jackpot">
              {t('roundEnded.jackpotLabel', { amount: jackpotSui })}
            </p>
          </>
        ) : (
          <p className="round-ended-no-tickets">{t('roundEnded.noTickets')}</p>
        )}

        <button
          className="btn btn-gold round-ended-btn"
          disabled={isPending}
          onClick={handleEndRound}
        >
          {isPending ? t('roundEnded.pending') : t('roundEnded.claimButton')}
        </button>

        {lastBuyer && (
          <p className="round-ended-hint">
            {t('roundEnded.hint', {
              emoji: teamInfo.emoji,
              team: t(`team.${teamTransKey}.name`),
            })}
          </p>
        )}
      </div>
    </div>
  );
}
