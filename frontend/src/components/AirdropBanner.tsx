import type { GameData } from '../hooks/useGame';
import { useT } from '../i18n/context';

interface Props {
  game: GameData;
}

export function AirdropBanner({ game }: Props) {
  const { t } = useT();
  const poolAmount = (Number(game.airdrop_pool) / 1e9).toFixed(4);
  const chanceBps = Number(game.airdrop_chance_bps);
  const chancePct = (chanceBps / 100).toFixed(1);
  const totalWins = Number(game.airdrop_total_wins);
  const totalPaid = (Number(game.airdrop_total_paid) / 1e9).toFixed(2);

  return (
    <div className="airdrop-strip">
      <div className="airdrop-left">
        <div className="airdrop-icon">&#9733;</div>
        <div>
          <div>{t('airdrop.pool', { amount: poolAmount })}</div>
          <div className="airdrop-sub">
            {t('airdrop.stats', { pct: chancePct, paid: totalPaid, wins: totalWins })}
          </div>
        </div>
      </div>
      <div className="airdrop-right">
        {t('airdrop.hint')}
      </div>
    </div>
  );
}
