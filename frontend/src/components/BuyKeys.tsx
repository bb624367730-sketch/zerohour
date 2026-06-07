import { useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { useQueryClient } from '@tanstack/react-query';
import { useState, useMemo } from 'react';
import toast from 'react-hot-toast';
import type { GameData } from '../hooks/useGame';
import { usePlayer } from '../hooks/useGame';
import { buildBuyTicketsFirstTx, buildBuyTicketsTx, formatSui, calculateTicketCost } from '../lib/sui';
import { TEAM_LIST, getTeamTransKey } from '../constants';
import { TeamSelector } from './TeamSelector';
import { ReferralLink } from './ReferralLink';
import { useT } from '../i18n/context';
import { playBuy, playError } from '../lib/sounds';

interface Props {
  game: GameData;
}

export function BuyKeys({ game }: Props) {
  const account = useCurrentAccount();
  const { player, isLoading: playerLoading } = usePlayer(account?.address);
  const { mutate: signAndExecute, isPending } = useSignAndExecuteTransaction();
  const queryClient = useQueryClient();
  const [selectedTeam, setSelectedTeam] = useState(0);
  const [ticketInput, setTicketInput] = useState('1');
  const ticketCount = Number(ticketInput) || 0;
  const [referrer, setReferrer] = useState('');
  const [status, setStatus] = useState<'idle' | 'buying' | 'success' | 'error'>('idle');
  const [flashTeamId, setFlashTeamId] = useState(-1);
  const [pricePop, setPricePop] = useState(false);
  const { t } = useT();

  // Add 10% slippage — excess is refunded by the contract
  const SLIPPAGE_BPS = 1000n; // 10%
  const exactCost = useMemo(() => {
    return calculateTicketCost(game.total_tickets_sold, ticketCount);
  }, [game.total_tickets_sold, ticketCount]);

  const totalCost = useMemo(() => {
    return exactCost + (exactCost * SLIPPAGE_BPS) / 10000n;
  }, [exactCost]);

  const teamInfo = TEAM_LIST[selectedTeam];
  const transKey = getTeamTransKey(selectedTeam);
  const isWalletConnected = !!account;

  const handleBuy = async () => {
    if (!account || ticketCount < 1 || ticketCount > 500) return;
    setStatus('buying');

    try {
      const tx = player
        ? buildBuyTicketsTx(player.id, totalCost, selectedTeam, ticketCount, referrer)
        : buildBuyTicketsFirstTx(totalCost, selectedTeam, ticketCount, referrer);

      signAndExecute(
        { transaction: tx },
        {
          onSuccess: (result) => {
            const effects = (result as any)?.effects;
            if (effects?.status?.status === 'failure') {
              playError();
              const errMsg = effects?.status?.error ?? 'Transaction failed';
              toast.error(t('buy.txFailed', { msg: String(errMsg).substring(0, 80) }));
              setStatus('idle');
              return;
            }
            playBuy();
            toast.success(t('buy.success', { n: ticketCount }));
            queryClient.invalidateQueries({ queryKey: ['game'] });
            queryClient.invalidateQueries({ queryKey: ['player'] });
            setStatus('idle');
            setFlashTeamId(selectedTeam);
            setPricePop(true);
            setTimeout(() => setFlashTeamId(-1), 600);
            setTimeout(() => setPricePop(false), 450);
          },
          onError: (err) => {
            playError();
            toast.error(t('buy.txFailed', { msg: String(err?.message ?? err).substring(0, 80) }));
            setStatus('idle');
          },
        },
      );
    } catch (err: any) {
      toast.error(t('buy.error', { msg: String(err?.message ?? err).substring(0, 80) }));
      setStatus('idle');
    }
  };

  return (
    <div className="card buy-keys">
      <div className="section-header">
        <h3>{t('buy.chooseTeam')}</h3>
        <div className="section-divider" />
      </div>
      <TeamSelector game={game} selectedTeam={selectedTeam} onSelect={setSelectedTeam} flashTeam={flashTeamId} />

      <label>{t('buy.ticketCount')}</label>
      <div className="input-row">
        <input
          type="number"
          min={1}
          max={500}
          placeholder="1"
          value={ticketInput}
          onChange={(e) => setTicketInput(e.target.value)}
          onBlur={() => {
            const n = Number(ticketInput);
            if (!ticketInput || n < 1) setTicketInput('1');
            else if (n > 500) setTicketInput('500');
          }}
        />
        <button className="btn btn-secondary btn-sm" onClick={() => setTicketInput('1')}>
          {t('buy.reset')}
        </button>
      </div>

      <div className="price-row">
        <span className="label">{t('buy.estimatedCost')}</span>
        <span className={`amount${pricePop ? ' pop' : ''}`}>{formatSui(exactCost)} SUI</span>
        {ticketCount > 1 && (
          <span className="avg">{t('buy.avgPrice', { price: formatSui(exactCost / BigInt(ticketCount)) })}</span>
        )}
        <span className="slippage-note">+10% buffer (excess refunded)</span>
      </div>

      <div className="team-hint">
        {t('buy.teamHint', {
          emoji: teamInfo.emoji,
          name: t(`team.${transKey}.name`),
          div: teamInfo.playerDivPct,
          jackpot: teamInfo.jackpotPct,
          zh: teamInfo.zhPct,
        })}
      </div>

      <ReferralLink value={referrer} onChange={setReferrer} />

      <button
        className="btn btn-primary"
        disabled={!isWalletConnected || isPending || status === 'buying'}
        onClick={handleBuy}
        style={{ marginTop: 14 }}
      >
        {!isWalletConnected
          ? t('buy.connectWallet')
          : isPending || status === 'buying'
            ? t('buy.confirming')
            : t('buy.button', { n: ticketCount, cost: formatSui(exactCost) })}
      </button>

      {playerLoading && <div className="msg" style={{ color: 'var(--text-muted)' }}>{t('buy.loadingPlayer')}</div>}
    </div>
  );
}
