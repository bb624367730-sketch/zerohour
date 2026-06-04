import { Header } from './components/Header';
import { GameStatus } from './components/GameStatus';
import { TeamSelector } from './components/TeamSelector';
import { BuyKeys } from './components/BuyKeys';
import { DividendPanel } from './components/DividendPanel';
import { Leaderboard } from './components/Leaderboard';
import { AirdropBanner } from './components/AirdropBanner';
import { HowToPlay } from './components/HowToPlay';
import { EventFeed } from './components/EventFeed';
import { RoundEnded } from './components/RoundEnded';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AdminPanel } from './components/AdminPanel';
import { Toast } from './components/Toast';
import { useGame } from './hooks/useGame';
import { useT } from './i18n/context';

export default function App() {
  const { game, isLoading, error } = useGame();
  const { t, lang } = useT();

  return (
    <ErrorBoundary lang={lang}>
    <div className="app">
      <Toast />
      <Header />

      <main className="container">
        {isLoading && (
          <div className="loading-screen">
            <div className="spinner" />
            <p>{t('app.loading')}</p>
          </div>
        )}

        {error && (
          <div className="error-banner">
            <p>{t('app.error')}</p>
            <p className="error-detail">{error}</p>
          </div>
        )}

        {game && (
          <>
            <GameStatus game={game} />
            <RoundEnded game={game} />
            <AirdropBanner game={game} />
            <HowToPlay />
            <TeamSelector game={game} />
            <div className="action-row">
              <BuyKeys game={game} />
              <DividendPanel game={game} />
            </div>
            <Leaderboard game={game} />
            <EventFeed />
            <AdminPanel game={game} />
          </>
        )}

      </main>

      <footer className="footer">
        <span>ZeroHour</span> &mdash; {t('app.footer')}
      </footer>
    </div>
    </ErrorBoundary>
  );
}
