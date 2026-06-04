import { useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { useState } from 'react';
import toast from 'react-hot-toast';
import type { GameData } from '../hooks/useGame';
import { usePlayer } from '../hooks/useGame';
import { buildClaimDividendsTx, buildClaimZhDividendsTx } from '../lib/sui';
import { formatSui, shortenAddress } from '../lib/sui';
import { getTeamInfo, getTeamTransKey } from '../constants';
import { useT } from '../i18n/context';
import { playClaim, playError } from '../lib/sounds';

interface Props {
  game: GameData;
}

export function DividendPanel({ game }: Props) {
  const account = useCurrentAccount();
  const { player } = usePlayer(account?.address);
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const [claiming, setClaiming] = useState(false);
  const [claimingZh, setClaimingZh] = useState(false);
  const { t } = useT();

  if (!account) {
    return (
      <div className="card dividend-panel">
        <div className="div-label">{t('div.yourDividends')}</div>
        <div className="div-amount" style={{ color: 'var(--text-muted)' }}>—</div>
        <div className="div-detail" style={{ marginTop: 12 }}>{t('div.connectWallet')}</div>
      </div>
    );
  }

  if (!player) {
    return (
      <div className="card dividend-panel">
        <div className="div-label">{t('div.yourDividends')}</div>
        <div className="div-amount">0 SUI</div>
        <div className="div-detail" style={{ marginTop: 12 }}>{t('div.noTickets')}</div>
      </div>
    );
  }

  const pendingDividends = calculatePending(game, player);
  const pendingZh = calculatePendingZh(game, player);
  const teamInfo = getTeamInfo(player.team_id);
  const transKey = getTeamTransKey(player.team_id);

  const handleClaim = async () => {
    if (!player) return;
    setClaiming(true);
    try {
      const tx = buildClaimDividendsTx(player.id);
      signAndExecute(
        { transaction: tx },
        {
          onSuccess: () => {
            playClaim();
            toast.success(t('div.claimSuccess', { amount: formatSui(pendingDividends) }));
            setClaiming(false);
          },
          onError: (err) => {
            playError();
            toast.error(t('div.claimFailed', { msg: String(err?.message ?? err).substring(0, 80) }));
            setClaiming(false);
          },
        },
      );
    } catch (err: any) {
      toast.error(t('div.claimFailed', { msg: String(err?.message ?? err).substring(0, 80) }));
      setClaiming(false);
    }
  };

  const handleClaimZh = async () => {
    if (!player) return;
    setClaimingZh(true);
    try {
      const tx = buildClaimZhDividendsTx(player.id);
      signAndExecute(
        { transaction: tx },
        {
          onSuccess: () => {
            playClaim();
            toast.success(t('div.zhClaimSuccess', { amount: formatSui(pendingZh) }));
            setClaimingZh(false);
          },
          onError: (err) => {
            playError();
            toast.error(t('div.zhClaimFailed', { msg: String(err?.message ?? err).substring(0, 80) }));
            setClaimingZh(false);
          },
        },
      );
    } catch (err: any) {
      toast.error(t('div.zhClaimFailed', { msg: String(err?.message ?? err).substring(0, 80) }));
      setClaimingZh(false);
    }
  };

  return (
    <div className="card dividend-panel">
      <div className="div-label">{t('div.yourDividends')}</div>
      <div className="div-amount">{formatSui(pendingDividends)} SUI</div>

      <div className="div-detail">
        {t('div.holding', { n: player.tickets_owned.toLocaleString(), emoji: teamInfo.emoji, name: t(`team.${transKey}.name`) })}
      </div>
      <div className="div-detail">
        {t('div.address', { addr: shortenAddress(account.address) })}
      </div>

      <button
        className="btn btn-gold"
        disabled={pendingDividends === '0' || claiming}
        onClick={handleClaim}
        style={{ marginTop: 14 }}
      >
        {claiming ? t('div.claiming') : t('div.claim')}
      </button>

      {/* ZH token section */}
      <div className="zh-section" style={{ marginTop: 18, paddingTop: 14, borderTop: '1px solid var(--border-subtle)' }}>
        <div className="div-detail" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="badge badge-zh" style={{ fontSize: 11, padding: '1px 6px', borderRadius: 4, background: 'var(--gold)', color: '#000' }}>
            {t('div.zhBadge')}
          </span>
          <span>{t('div.zhBalance', { amount: formatSui(player.zh_balance) })}</span>
        </div>
        <div className="div-detail" style={{ color: 'var(--text-muted)', fontSize: 13 }}>
          {formatSui(pendingZh)} SUI {t('div.yourDividends').toLowerCase()}
        </div>
        <button
          className="btn btn-sm"
          disabled={pendingZh === '0' || claimingZh}
          onClick={handleClaimZh}
          style={{ marginTop: 8, width: '100%' }}
        >
          {claimingZh ? t('div.zhClaiming') : t('div.zhClaim')}
        </button>
      </div>
    </div>
  );
}

function calculatePending(game: GameData, player: any): string {
  if (!player || player.tickets_owned === 0) return '0';
  const accumulated = BigInt(game.dividend_per_ticket);
  const checkpoint = BigInt(player.last_dividend_per_ticket);
  if (accumulated <= checkpoint) return '0';
  const diff = accumulated - checkpoint;
  const owed = (BigInt(player.tickets_owned) * diff) / BigInt(1_000_000_000);
  return String(owed);
}

function calculatePendingZh(game: GameData, player: any): string {
  if (!player || !player.zh_balance || BigInt(player.zh_balance) === 0n) return '0';
  const accumulated = BigInt(game.zh_per_token);
  const checkpoint = BigInt(player.zh_last_per_token);
  if (accumulated <= checkpoint) return '0';
  const diff = accumulated - checkpoint;
  const owed = (BigInt(player.zh_balance) * diff) / BigInt(1_000_000_000);
  return String(owed);
}
