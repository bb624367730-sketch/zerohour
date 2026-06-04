import type { GameData } from '../hooks/useGame';
import { TEAM_LIST, getTeamTransKey } from '../constants';
import { useT } from '../i18n/context';

interface Props {
  game: GameData;
}

export function Leaderboard({ game }: Props) {
  const { t } = useT();
  const totalKeys = Number(game.total_tickets_sold);

  const teams = TEAM_LIST.map((team) => {
    const idx = team.id;
    const keys = Number(game.team_tickets?.[idx] ?? 0);
    const players = Number(game.team_players?.[idx] ?? 0);
    const volume = (Number(game.team_volume?.[idx] ?? 0) / 1e9).toFixed(2);
    const share = totalKeys > 0 ? ((keys / totalKeys) * 100).toFixed(1) : '0.0';
    const transKey = getTeamTransKey(team.id);
    return { ...team, keys, players, volume, share, transKey };
  });

  teams.sort((a, b) => b.keys - a.keys);

  if (totalKeys === 0) {
    return (
      <div className="card leaderboard">
        <h3>{t('lb.title')}</h3>
        <div className="empty-state">{t('lb.empty')}</div>
      </div>
    );
  }

  return (
    <div className="card leaderboard">
      <h3>{t('lb.title')}</h3>
      <table className="lb-table">
        <thead>
          <tr>
            <th>{t('lb.colRank')}</th>
            <th>{t('lb.colTeam')}</th>
            <th>{t('lb.colTickets')}</th>
            <th>{t('lb.colShare')}</th>
            <th>{t('lb.colPlayers')}</th>
            <th>{t('lb.colVolume')}</th>
          </tr>
        </thead>
        <tbody>
          {teams.map((team, i) => (
            <tr key={team.id}>
              <td className="rank">{i + 1}</td>
              <td>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span>{team.emoji}</span>
                  <span style={{ fontWeight: 600 }}>{t(`team.${team.transKey}.name`)}</span>
                </span>
              </td>
              <td>{team.keys.toLocaleString()}</td>
              <td>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div className="lb-bar-bg">
                    <div
                      className="lb-bar-fill"
                      style={{ width: `${team.share}%`, background: team.color }}
                    />
                  </div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{team.share}%</span>
                </span>
              </td>
              <td>{team.players.toLocaleString()}</td>
              <td>{team.volume} SUI</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
