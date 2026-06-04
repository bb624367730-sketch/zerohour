import type { GameEvent } from "./sui-client.js";

const SUI_DECIMALS = 1_000_000_000n;

const TEAM_EMOJI = ["🐕", "🐸", "🐒", "🐱"] as const;
const TEAM_NAME = ["Doge", "Pepe", "Monkey", "Cat"] as const;

function fmtSui(mist: string): string {
  const bn = BigInt(mist);
  const intPart = bn / SUI_DECIMALS;
  const frac = bn % SUI_DECIMALS;
  if (intPart === 0n) {
    const f = String(frac).padStart(9, "0").replace(/0+$/, "");
    return `0.${f || "0"}`.slice(0, 8);
  }
  return `${intPart}.${String(frac).padStart(9, "0").slice(0, 2)}`;
}

function fmtAddr(addr: string): string {
  if (!addr || addr.length < 10) return addr;
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

function teamLabel(teamId: string): string {
  const id = Number(teamId);
  return `${TEAM_EMOJI[id] ?? "❓"} ${TEAM_NAME[id] ?? "Unknown"}`;
}

export function formatTweet(event: GameEvent): string | null {
  switch (event.type) {
    case "TicketPurchased": {
      const e = event.data;
      const team = teamLabel(e.team);
      const amount = fmtSui(e.amount);
      const tickets = Number(e.tickets);
      const totalTickets = Number(e.total_tickets);
      const round = Number(e.round);
      const buyer = fmtAddr(e.buyer);

      return [
        `🎫 ${buyer} bought ${tickets} ticket(s)`,
        ``,
        `Team: ${team}`,
        `Amount: ${amount} SUI`,
        ``,
        `Round #${round} | Total: ${totalTickets.toLocaleString()} tickets`,
        ``,
        `#ZeroHour #Sui`,
      ].join("\n");
    }
    case "AirdropWon": {
      const e = event.data;
      const amount = fmtSui(e.amount);
      const purchase = fmtSui(e.purchase_amount);
      const player = fmtAddr(e.player);
      const round = Number(e.round);

      return [
        `🎰 AIRDROP WINNER!`,
        ``,
        `${player} triggered airdrop with ${purchase} SUI purchase`,
        `Won ${amount} SUI`,
        ``,
        `Round #${round}`,
        ``,
        `#ZeroHour #Sui #Airdrop`,
      ].join("\n");
    }
    case "RoundEnded": {
      const e = event.data;
      const winner = fmtAddr(e.winner);
      const team = teamLabel(e.winner_team);
      const jackpot = fmtSui(e.jackpot_amount);
      const volume = fmtSui(e.total_volume);
      const tickets = Number(e.total_tickets_sold);
      const round = Number(e.round);

      return [
        `🏆 Round #${round} has ended!`,
        ``,
        `${winner} won ${jackpot} SUI`,
        `Team: ${team}`,
        ``,
        `Round stats: ${tickets.toLocaleString()} tickets | ${volume} SUI volume`,
        ``,
        `#ZeroHour #Sui`,
      ].join("\n");
    }
    case "DividendsClaimed": {
      const e = event.data;
      const amount = fmtSui(e.amount);
      const bn = BigInt(e.amount);
      if (bn < SUI_DECIMALS / 100n) return null; // skip < 0.01 SUI
      const player = fmtAddr(e.player);
      const round = Number(e.round);

      return [
        `💰 ${player} claimed ${amount} SUI dividends`,
        `Round #${round}`,
        ``,
        `#ZeroHour #Sui`,
      ].join("\n");
    }
    default:
      return null;
  }
}
