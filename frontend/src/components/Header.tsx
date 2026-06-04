import { ConnectButton, useCurrentAccount } from '@mysten/dapp-kit';
import { useBalance } from '../hooks/useBalance';
import { formatSui } from '../lib/sui';
import { useT } from '../i18n/context';
import type { Lang } from '../i18n/translations';
import { ZeroHourLogo } from './ZeroHourLogo';
import { SoundToggle } from './SoundToggle';

export function Header() {
  const account = useCurrentAccount();
  const balance = useBalance(account?.address);
  const { lang, setLang, langLabels } = useT();

  const handleLangChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLang(e.target.value as Lang);
  };

  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-brand">
          <ZeroHourLogo size={44} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <SoundToggle />
          {account && (
            <div className="balance-badge">
              <span className="balance-amount">{formatSui(balance)}</span>
              <span className="balance-unit">SUI</span>
            </div>
          )}
          <select
            className="lang-switcher"
            value={lang}
            onChange={handleLangChange}
          >
            {Object.entries(langLabels).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
          <ConnectButton />
        </div>
      </div>
    </header>
  );
}
