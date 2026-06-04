import { useState } from 'react';
import { useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import toast from 'react-hot-toast';
import type { GameData } from '../hooks/useGame';
import { buildWithdrawCommunityFundTx, buildSeedJackpotTx, buildPauseGameTx, buildUnpauseGameTx, formatSui } from '../lib/sui';
import { useT } from '../i18n/context';

interface Props {
  game: GameData;
}

export function AdminPanel({ game }: Props) {
  const account = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const [open, setOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [seedAmount, setSeedAmount] = useState('');
  const [busy, setBusy] = useState<'withdraw' | 'seed' | null>(null);
  const { t } = useT();

  const isAdmin = account && account.address === game.admin;

  if (!isAdmin) return null;

  const communityFund = formatSui(game.community_fund);
  const canSeed = Number(game.total_tickets_sold) === 0;

  const handleWithdraw = () => {
    const mist = Math.round(parseFloat(withdrawAmount) * 1_000_000_000);
    if (!mist || mist <= 0) return;
    setBusy('withdraw');
    const tx = buildWithdrawCommunityFundTx(mist);
    signAndExecute(
      { transaction: tx },
      {
        onSuccess: () => {
          toast.success(t('admin.withdrawSuccess', { amount: withdrawAmount }));
          setWithdrawAmount('');
          setBusy(null);
        },
        onError: (err) => {
          toast.error(t('admin.withdrawFailed', { msg: String(err?.message ?? err).substring(0, 80) }));
          setBusy(null);
        },
      },
    );
  };

  const handlePause = () => {
    setBusy('withdraw'); // reuse busy state
    const tx = game.paused ? buildUnpauseGameTx() : buildPauseGameTx();
    signAndExecute(
      { transaction: tx },
      {
        onSuccess: () => {
          toast.success(game.paused ? t('admin.unpaused') : t('admin.paused'));
          setBusy(null);
        },
        onError: (err) => {
          toast.error(t('admin.actionFailed', { msg: String(err?.message ?? err).substring(0, 80) }));
          setBusy(null);
        },
      },
    );
  };

  const handleSeed = () => {
    const mist = Math.round(parseFloat(seedAmount) * 1_000_000_000);
    if (!mist || mist <= 0) return;
    setBusy('seed');
    const tx = buildSeedJackpotTx(mist);
    signAndExecute(
      { transaction: tx },
      {
        onSuccess: () => {
          toast.success(t('admin.seedSuccess', { amount: seedAmount }));
          setSeedAmount('');
          setBusy(null);
        },
        onError: (err) => {
          toast.error(t('admin.seedFailed', { msg: String(err?.message ?? err).substring(0, 80) }));
          setBusy(null);
        },
      },
    );
  };

  return (
    <div className="admin-panel">
      <button
        className="btn btn-secondary admin-toggle"
        onClick={() => setOpen(!open)}
      >
        {open ? t('admin.hide') : t('admin.show')}
      </button>

      {open && (
        <div className="card admin-panel-body">
          <h3 className="admin-title">{t('admin.title')}</h3>
          <p className="admin-info">{t('admin.communityFund', { amount: communityFund })}</p>

          <div className="admin-section">
            <button
              className={`btn btn-sm ${game.paused ? 'btn-primary' : 'btn-danger'}`}
              disabled={busy !== null && busy !== 'withdraw'}
              onClick={handlePause}
            >
              {busy === 'withdraw' ? t('admin.pending') : game.paused ? t('admin.unpause') : t('admin.pause')}
            </button>
            {game.paused && <p style={{color: '#e74c3c', marginTop: 8}}>{t('admin.pausedWarning')}</p>}
          </div>

          <div className="admin-section">
            <label>{t('admin.withdrawLabel')}</label>
            <div className="input-row">
              <input
                type="number"
                min={0}
                step={0.1}
                placeholder="0.0"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
              />
              <button
                className="btn btn-gold btn-sm"
                disabled={!withdrawAmount || busy !== null}
                onClick={handleWithdraw}
              >
                {busy === 'withdraw' ? t('admin.pending') : t('admin.withdraw')}
              </button>
            </div>
          </div>

          {canSeed && (
            <div className="admin-section">
              <label>{t('admin.seedLabel')}</label>
              <div className="input-row">
                <input
                  type="number"
                  min={0}
                  step={0.1}
                  placeholder="0.0"
                  value={seedAmount}
                  onChange={(e) => setSeedAmount(e.target.value)}
                />
                <button
                  className="btn btn-primary btn-sm"
                  disabled={!seedAmount || busy !== null}
                  onClick={handleSeed}
                >
                  {busy === 'seed' ? t('admin.pending') : t('admin.seed')}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
