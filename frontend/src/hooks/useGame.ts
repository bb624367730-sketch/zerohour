import { useQuery } from '@tanstack/react-query';
import { useSuiClient } from '@mysten/dapp-kit';
import { GAME_OBJECT_ID, PACKAGE_ID } from '../constants';

export interface GameData {
  round: number;
  round_start_ts: string;
  timer_end_ts: string;
  last_buyer: string;
  last_buyer_team: number;
  total_tickets_sold: string;
  total_sui_volume: string;
  jackpot: string;
  player_dividend_pool: string;
  community_fund: string;
  airdrop_pool: string;
  dividend_per_ticket: string;
  airdrop_chance_bps: string;
  airdrop_total_wins: string;
  airdrop_total_paid: string;
  team_tickets: string[];
  team_players: string[];
  team_volume: string[];
  zh_pool: string;
  zh_per_token: string;
  zh_total_supply: string;
  admin: string;
  paused: boolean;
}

function parseGameContent(content: any): GameData | null {
  if (!content) return null;
  try {
    const fields = content.fields ?? content;
    return {
      round: Number(fields.round),
      round_start_ts: String(fields.round_start_ts ?? '0'),
      timer_end_ts: String(fields.timer_end_ts ?? '0'),
      last_buyer: String(fields.last_buyer ?? ''),
      last_buyer_team: Number(fields.last_buyer_team ?? 0),
      total_tickets_sold: String(fields.total_tickets_sold ?? '0'),
      total_sui_volume: String(fields.total_sui_volume ?? '0'),
      jackpot: String(fields.jackpot ?? '0'),
      player_dividend_pool: String(fields.player_dividend_pool ?? '0'),
      community_fund: String(fields.community_fund ?? '0'),
      airdrop_pool: String(fields.airdrop_pool ?? '0'),
      dividend_per_ticket: String(fields.dividend_per_ticket ?? '0'),
      airdrop_chance_bps: String(fields.airdrop_chance_bps ?? '0'),
      airdrop_total_wins: String(fields.airdrop_total_wins ?? '0'),
      airdrop_total_paid: String(fields.airdrop_total_paid ?? '0'),
      team_tickets: Array.isArray(fields.team_tickets) ? fields.team_tickets.map(String) : ['0', '0', '0', '0'],
      team_players: Array.isArray(fields.team_players) ? fields.team_players.map(String) : ['0', '0', '0', '0'],
      team_volume: Array.isArray(fields.team_volume) ? fields.team_volume.map(String) : ['0', '0', '0', '0'],
      zh_pool: String(fields.zh_pool ?? '0'),
      zh_per_token: String(fields.zh_per_token ?? '0'),
      zh_total_supply: String(fields.zh_total_supply ?? '0'),
      admin: String(fields.admin ?? ''),
      paused: fields.paused === true,
    };
  } catch {
    return null;
  }
}

export interface PlayerData {
  id: string;
  owner: string;
  tickets_owned: number;
  team_id: number;
  last_dividend_per_ticket: string;
  round: number;
  zh_balance: string;
  zh_last_per_token: string;
}

export function useGame() {
  const client = useSuiClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['game', GAME_OBJECT_ID],
    queryFn: async () => {
      const obj = await client.getObject({
        id: GAME_OBJECT_ID,
        options: { showContent: true },
      });
      const content = obj.data?.content as any;
      if (content?.fields) {
        return parseGameContent(content);
      }
      return null;
    },
    refetchInterval: 5000,
  });

  return {
    game: data ?? null,
    isLoading,
    error: error ? String(error) : null,
  };
}

function parsePlayer(content: any): PlayerData | null {
  const f = content?.fields;
  if (!f) return null;
  const objId = typeof f.id === 'object' && f.id?.id ? f.id.id : String(f.id ?? '');
  return {
    id: objId,
    owner: String(f.owner ?? ''),
    tickets_owned: Number(f.tickets_owned ?? 0),
    team_id: Number(f.team_id ?? 0),
    last_dividend_per_ticket: String(f.last_dividend_per_ticket ?? '0'),
    round: Number(f.round ?? 0),
    zh_balance: String(f.zh_balance ?? '0'),
    zh_last_per_token: String(f.zh_last_per_token ?? '0'),
  };
}

export function usePlayer(address?: string) {
  const client = useSuiClient();

  const { data, isLoading } = useQuery({
    queryKey: ['player', address],
    queryFn: async () => {
      if (!address) return null;

      // Fetch game info and player objects in parallel — no race condition
      const [gameObj, owned] = await Promise.all([
        client.getObject({ id: GAME_OBJECT_ID, options: { showContent: true } }),
        client.getOwnedObjects({
          owner: address,
          filter: { StructType: `${PACKAGE_ID}::game::Player` },
          options: { showContent: true },
        }),
      ]);

      if (owned.data.length === 0) return null;

      // Parse all player objects
      const players = owned.data
        .map((obj) => parsePlayer((obj.data?.content as any)))
        .filter((p): p is PlayerData => p !== null);

      if (players.length === 0) return null;

      // Extract game round and accumulator from the game object
      const gf = (gameObj.data?.content as any)?.fields;
      const currentRound = gf ? Number(gf.round ?? 0) : 0;
      const dividendPerTicket = BigInt(gf?.dividend_per_ticket ?? '0');

      // Calculate pending dividends for each player, pick the one with the most
      const calcPending = (p: PlayerData): bigint => {
        if (p.tickets_owned === 0) return 0n;
        const checkpoint = BigInt(p.last_dividend_per_ticket);
        if (dividendPerTicket <= checkpoint) return 0n;
        const diff = dividendPerTicket - checkpoint;
        return (BigInt(p.tickets_owned) * diff) / BigInt(1_000_000_000);
      };

      // Prefer current round, then most pending dividends, then most tickets
      const inRound = players.filter((p) => p.round === currentRound);
      const candidates = inRound.length > 0 ? inRound : players;
      const best = candidates
        .sort((a, b) => {
          const pa = calcPending(a);
          const pb = calcPending(b);
          if (pa !== pb) return Number(pb - pa);
          return b.tickets_owned - a.tickets_owned;
        })[0];

      // Sum ZH across all players (ZH spans rounds)
      let totalZh = 0n;
      let totalZhCheckpoint = 0n;
      for (const p of players) {
        totalZh += BigInt(p.zh_balance);
        const cp = BigInt(p.zh_last_per_token);
        if (cp > totalZhCheckpoint) totalZhCheckpoint = cp;
      }

      return {
        ...best,
        zh_balance: String(totalZh),
        zh_last_per_token: String(totalZhCheckpoint),
      };
    },
    enabled: !!address,
    refetchInterval: 5000,
  });

  return {
    player: data ?? null,
    isLoading,
  };
}
