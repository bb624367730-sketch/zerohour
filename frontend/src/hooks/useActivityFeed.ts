import { useQuery } from '@tanstack/react-query';
import { useSuiClient } from '@mysten/dapp-kit';
import { PACKAGE_ID } from '../constants';

export interface ActivityEvent {
  type: 'ticket' | 'airdrop' | 'dividend' | 'round_end';
  timestamp: number;
  round: number;
  buyer?: string;
  team?: number;
  tickets?: number;
  amount?: string;
  player?: string;
  winner?: string;
  winner_team?: number;
  jackpot_amount?: string;
  total_tickets_sold?: string;
  total_volume?: string;
}

interface RawEvent {
  type: string;
  parsedJson?: {
    round?: string;
    buyer?: string;
    team?: number;
    tickets?: string;
    amount?: string;
    player?: string;
    winner?: string;
    winner_team?: number;
    jackpot_amount?: string;
    total_tickets_sold?: string;
    total_volume?: string;
    [key: string]: unknown;
  };
  timestampMs?: string;
}

function parseEvent(raw: RawEvent): ActivityEvent | null {
  const data = raw.parsedJson;
  if (!data) return null;

  const timestamp = raw.timestampMs ? Number(raw.timestampMs) : Date.now();
  const round = data.round ? Number(data.round) : 0;

  if (raw.type.endsWith('::TicketPurchased')) {
    return {
      type: 'ticket',
      timestamp,
      round,
      buyer: data.buyer,
      team: data.team,
      tickets: data.tickets ? Number(data.tickets) : 0,
      amount: data.amount,
    };
  }

  if (raw.type.endsWith('::AirdropWon')) {
    return {
      type: 'airdrop',
      timestamp,
      round,
      player: data.player,
      amount: data.amount,
    };
  }

  if (raw.type.endsWith('::DividendsClaimed')) {
    return {
      type: 'dividend',
      timestamp,
      round,
      player: data.player,
      amount: data.amount,
    };
  }

  if (raw.type.endsWith('::RoundEnded')) {
    return {
      type: 'round_end',
      timestamp,
      round,
      winner: data.winner,
      winner_team: data.winner_team,
      jackpot_amount: data.jackpot_amount,
      total_tickets_sold: data.total_tickets_sold,
      total_volume: data.total_volume,
    };
  }

  return null;
}

export function useActivityFeed(limit = 20) {
  const client = useSuiClient();

  const { data, isLoading } = useQuery({
    queryKey: ['activityFeed', PACKAGE_ID, limit],
    queryFn: async () => {
      const events = await client.queryEvents({
        query: {
          MoveModule: {
            package: PACKAGE_ID,
            module: 'game',
          },
        },
        order: 'descending',
        limit,
      });

      const parsed: ActivityEvent[] = [];
      for (const ev of events.data) {
        const parsedEvent = parseEvent({
          type: ev.type,
          parsedJson: ev.parsedJson as RawEvent['parsedJson'],
          timestampMs: ev.timestampMs ?? undefined,
        });
        if (parsedEvent) {
          parsed.push(parsedEvent);
        }
      }

      return parsed;
    },
    refetchInterval: 10_000,
    enabled: !!PACKAGE_ID,
  });

  return {
    events: data ?? [],
    isLoading,
  };
}
