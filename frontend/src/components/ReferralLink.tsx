import { useCurrentAccount } from '@mysten/dapp-kit';
import { isValidSuiAddress } from '../lib/sui';
import { useT } from '../i18n/context';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export function ReferralLink({ value, onChange }: Props) {
  const account = useCurrentAccount();
  const { t } = useT();

  const myReferralLink = account
    ? `${window.location.origin}?ref=${account.address}`
    : '';

  const handleCopy = () => {
    if (myReferralLink) {
      navigator.clipboard.writeText(myReferralLink).catch(() => {});
    }
  };

  const showInvalid = value.length > 0 && !isValidSuiAddress(value);

  return (
    <div className="referral-block">
      <label>{t('ref.label')}</label>
      <input
        type="text"
        placeholder="0x..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={showInvalid ? { borderColor: 'var(--red, #ef4444)' } : undefined}
      />
      {showInvalid && (
        <div style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: 4 }}>Invalid Sui address</div>
      )}

      {account && (
        <div className="ref-link-row">
          {t('ref.yourLink')}<code>{myReferralLink}</code>
          <button className="copy-btn" onClick={handleCopy}>{t('ref.copy')}</button>
        </div>
      )}

      <div className="ref-note">
        {t('ref.note')}
      </div>
    </div>
  );
}
