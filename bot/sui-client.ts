import { SuiClient, getFullnodeUrl } from "@mysten/sui/client";
import { config } from "./config.js";

export function createSuiClient(): SuiClient {
  return new SuiClient({
    url: getFullnodeUrl(config.network as "mainnet" | "testnet"),
  });
}

// Event type identifiers are: <PACKAGE_ID>::<MODULE>::<STRUCT_NAME>
export const EVENT_TYPES = {
  TicketPurchased: `${config.packageId}::game::TicketPurchased`,
  DividendsClaimed: `${config.packageId}::game::DividendsClaimed`,
  AirdropWon: `${config.packageId}::game::AirdropWon`,
  RoundEnded: `${config.packageId}::game::RoundEnded`,
} as const;

// Sui EventId is { txDigest: string, eventSeq: string }
export interface CursorState {
  txDigest: string;
  eventSeq: string;
}

export interface TicketPurchasedEvent {
  round: string;
  buyer: string;
  team: string;
  tickets: string;
  amount: string;
  new_timer_end_ts: string;
  total_tickets: string;
}

export interface DividendsClaimedEvent {
  round: string;
  player: string;
  amount: string;
}

export interface AirdropWonEvent {
  round: string;
  player: string;
  amount: string;
  purchase_amount: string;
}

export interface RoundEndedEvent {
  round: string;
  winner: string;
  winner_team: string;
  jackpot_amount: string;
  total_tickets_sold: string;
  total_volume: string;
}

export type GameEvent =
  | { type: "TicketPurchased"; data: TicketPurchasedEvent }
  | { type: "DividendsClaimed"; data: DividendsClaimedEvent }
  | { type: "AirdropWon"; data: AirdropWonEvent }
  | { type: "RoundEnded"; data: RoundEndedEvent };

export function parseEvent(e: any): GameEvent | null {
  try {
    const type = e.type as string;
    const fields = e.parsedJson ?? {};

    if (type.includes("::TicketPurchased")) {
      return {
        type: "TicketPurchased",
        data: {
          round: String(fields.round ?? "0"),
          buyer: String(fields.buyer ?? ""),
          team: String(fields.team ?? "0"),
          tickets: String(fields.tickets ?? "0"),
          amount: String(fields.amount ?? "0"),
          new_timer_end_ts: String(fields.new_timer_end_ts ?? "0"),
          total_tickets: String(fields.total_tickets ?? "0"),
        },
      };
    }
    if (type.includes("::DividendsClaimed")) {
      return {
        type: "DividendsClaimed",
        data: {
          round: String(fields.round ?? "0"),
          player: String(fields.player ?? ""),
          amount: String(fields.amount ?? "0"),
        },
      };
    }
    if (type.includes("::AirdropWon")) {
      return {
        type: "AirdropWon",
        data: {
          round: String(fields.round ?? "0"),
          player: String(fields.player ?? ""),
          amount: String(fields.amount ?? "0"),
          purchase_amount: String(fields.purchase_amount ?? "0"),
        },
      };
    }
    if (type.includes("::RoundEnded")) {
      return {
        type: "RoundEnded",
        data: {
          round: String(fields.round ?? "0"),
          winner: String(fields.winner ?? ""),
          winner_team: String(fields.winner_team ?? "0"),
          jackpot_amount: String(fields.jackpot_amount ?? "0"),
          total_tickets_sold: String(fields.total_tickets_sold ?? "0"),
          total_volume: String(fields.total_volume ?? "0"),
        },
      };
    }
    return null;
  } catch (err) {
    console.error("Failed to parse event:", err);
    return null;
  }
}

export type GameEventHandler = (event: GameEvent) => void | Promise<void>;

/** Subscribe to all game events via WebSocket. Returns an unsubscribe function. */
export async function subscribeToGameEvents(
  client: SuiClient,
  onEvent: GameEventHandler,
): Promise<() => Promise<void>> {
  const eventTypes = Object.values(EVENT_TYPES);

  let stopped = false;
  let lastEventTime = Date.now();
  let retryCount = 0;
  let currentUnsubs: (() => Promise<unknown>)[] = [];

  function onMessage(raw: any) {
    lastEventTime = Date.now();
    retryCount = 0;
    const parsed = parseEvent(raw);
    if (parsed) {
      const result = onEvent(parsed);
      if (result instanceof Promise) {
        result.catch((err) => console.error("Event handler error:", err));
      }
    }
  }

  async function subscribeAll(): Promise<void> {
    const newUnsubs: (() => Promise<unknown>)[] = [];
    for (const eventType of eventTypes) {
      try {
        const unsub = await client.subscribeEvent({
          filter: { MoveEventType: eventType },
          onMessage,
        });
        newUnsubs.push(unsub);
      } catch (err) {
        console.error(`Failed to subscribe to ${eventType}:`, err);
      }
    }
    // Replace old unsubs
    const old = currentUnsubs;
    currentUnsubs = newUnsubs;
    // Unsubscribe old subscriptions asynchronously
    for (const f of old) {
      try { await f(); } catch { /* ignore */ }
    }
  }

  await subscribeAll();

  // Silent-connection watch: if no events arrive for 5 min, reconnect
  const SILENCE_TIMEOUT = 5 * 60 * 1000;
  const CHECK_INTERVAL = 30_000;

  const watchdog = setInterval(async () => {
    if (stopped) return;
    const silent = Date.now() - lastEventTime;
    if (silent > SILENCE_TIMEOUT) {
      retryCount++;
      const delay = Math.min(2000 * Math.pow(2, Math.min(retryCount, 5)), 120_000);
      console.log(`[WS] Silent for ${Math.round(silent / 1000)}s, reconnecting (attempt ${retryCount}, delay ${delay}ms)...`);
      await new Promise((r) => setTimeout(r, delay));
      await subscribeAll();
    }
  }, CHECK_INTERVAL);

  return async () => {
    stopped = true;
    clearInterval(watchdog);
    for (const unsub of currentUnsubs) {
      try { await unsub(); } catch { /* ignore */ }
    }
  };
}
