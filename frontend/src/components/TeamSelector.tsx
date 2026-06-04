import type { GameData } from '../hooks/useGame';
import { TEAM_LIST, getTeamTransKey } from '../constants';
import { useT } from '../i18n/context';

interface Props {
  game: GameData;
  selectedTeam?: number;
  onSelect?: (teamId: number) => void;
  flashTeam?: number;
}

export function TeamSelector({ game, selectedTeam, onSelect, flashTeam }: Props) {
  const { t } = useT();

  return (
    <div className="team-row">
      {TEAM_LIST.map((team) => {
        const idx = team.id;
        const keys = Number(game.team_tickets?.[idx] ?? 0);
        const players = Number(game.team_players?.[idx] ?? 0);
        const isSelected = selectedTeam === team.id;
        const transKey = getTeamTransKey(team.id);

        return (
          <div
            key={team.id}
            className={`team-card${isSelected ? ' selected' : ''}${flashTeam === team.id ? ' flash-success' : ''}`}
            onClick={() => onSelect?.(team.id)}
          >
            {isSelected && <div className="team-badge">&#10003;</div>}
            <div className="team-emoji">{team.emoji}</div>
            <div className="team-name">{t(`team.${transKey}.name`)}</div>
            <div className="team-pct">{t('team.divPct', { pct: team.playerDivPct })} · {t('team.jackpotPct', { pct: team.jackpotPct })}</div>
            <div className="team-stats">
              <span>{t('team.tickets', { n: keys.toLocaleString() })}</span>
              <span>{t('team.players', { n: players.toLocaleString() })}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
