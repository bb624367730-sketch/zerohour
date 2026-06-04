import { Transaction } from '@mysten/sui/transactions';
import { PACKAGE_ID, MODULE_NAME, GAME_OBJECT_ID } from '../constants';

const ZERO_ADDR = '0x0000000000000000000000000000000000000000000000000000000000000000';

function resolveReferrer(referrer: string): string {
  if (referrer && isValidSuiAddress(referrer)) return referrer;
  return ZERO_ADDR;
}

export function buildBuyTicketsFirstTx(
  totalCost: bigint | number,
  team: number,
  tickets: number,
  referrer: string,
): Transaction {
  const tx = new Transaction();

  // Split payment from gas coin so we don't need a separate coin for payment
  const [payment] = tx.splitCoins(tx.gas, [totalCost]);

  tx.moveCall({
    target: `${PACKAGE_ID}::${MODULE_NAME}::buy_tickets_first`,
    arguments: [
      tx.object(GAME_OBJECT_ID),
      payment,
      tx.pure.u8(team),
      tx.pure.u64(tickets),
      tx.pure.address(resolveReferrer(referrer)),
      tx.object.clock(),
      tx.object.random(),
    ],
  });

  return tx;
}

export function buildBuyTicketsTx(
  playerId: string,
  totalCost: bigint | number,
  team: number,
  tickets: number,
  referrer: string,
): Transaction {
  const tx = new Transaction();

  // Split payment from gas coin so we don't need a separate coin for payment
  const [payment] = tx.splitCoins(tx.gas, [totalCost]);

  tx.moveCall({
    target: `${PACKAGE_ID}::${MODULE_NAME}::buy_tickets`,
    arguments: [
      tx.object(GAME_OBJECT_ID),
      tx.object(playerId),
      payment,
      tx.pure.u8(team),
      tx.pure.u64(tickets),
      tx.pure.address(resolveReferrer(referrer)),
      tx.object.clock(),
      tx.object.random(),
    ],
  });

  return tx;
}

export function buildClaimDividendsTx(
  playerId: string,
): Transaction {
  const tx = new Transaction();

  tx.moveCall({
    target: `${PACKAGE_ID}::${MODULE_NAME}::claim_dividends`,
    arguments: [
      tx.object(GAME_OBJECT_ID),
      tx.object(playerId),
      tx.object.clock(),
    ],
  });

  return tx;
}

export function buildClaimZhDividendsTx(
  playerId: string,
): Transaction {
  const tx = new Transaction();

  tx.moveCall({
    target: `${PACKAGE_ID}::${MODULE_NAME}::claim_zh_dividends`,
    arguments: [
      tx.object(GAME_OBJECT_ID),
      tx.object(playerId),
      tx.object.clock(),
    ],
  });

  return tx;
}

export function buildEndRoundTx(): Transaction {
  const tx = new Transaction();

  tx.moveCall({
    target: `${PACKAGE_ID}::${MODULE_NAME}::end_round_if_expired`,
    arguments: [
      tx.object(GAME_OBJECT_ID),
      tx.object.clock(),
    ],
  });

  return tx;
}

export function buildPauseGameTx(): Transaction {
  const tx = new Transaction();
  tx.moveCall({
    target: `${PACKAGE_ID}::${MODULE_NAME}::pause_game`,
    arguments: [tx.object(GAME_OBJECT_ID)],
  });
  return tx;
}

export function buildUnpauseGameTx(): Transaction {
  const tx = new Transaction();
  tx.moveCall({
    target: `${PACKAGE_ID}::${MODULE_NAME}::unpause_game`,
    arguments: [tx.object(GAME_OBJECT_ID)],
  });
  return tx;
}

export function buildWithdrawCommunityFundTx(amount: bigint | number): Transaction {
  const tx = new Transaction();

  tx.moveCall({
    target: `${PACKAGE_ID}::${MODULE_NAME}::withdraw_community_fund`,
    arguments: [
      tx.object(GAME_OBJECT_ID),
      tx.pure.u64(amount),
    ],
  });

  return tx;
}

export function buildSeedJackpotTx(amount: bigint | number): Transaction {
  const tx = new Transaction();

  const [payment] = tx.splitCoins(tx.gas, [amount]);

  tx.moveCall({
    target: `${PACKAGE_ID}::${MODULE_NAME}::seed_jackpot`,
    arguments: [
      tx.object(GAME_OBJECT_ID),
      payment,
      tx.object.clock(),
    ],
  });

  return tx;
}

const TICKET_PRICE_BASE = 10_000_000n;
const TICKET_PRICE_INCREMENT = 100_000n;

export function calculateTicketCost(currentTotal: string | number | bigint, tickets: number): bigint {
  const total = BigInt(currentTotal);
  const n = BigInt(tickets);
  const firstPrice = TICKET_PRICE_BASE + total * TICKET_PRICE_INCREMENT;
  const lastPrice = TICKET_PRICE_BASE + (total + n - 1n) * TICKET_PRICE_INCREMENT;
  return (n * (firstPrice + lastPrice)) / 2n;
}

export function formatSui(mist: string | number | bigint): string {
  const bn = BigInt(mist);
  const intPart = bn / 1_000_000_000n;
  const fracPart = bn % 1_000_000_000n;
  const fracStr = String(fracPart).padStart(9, '0');

  if (intPart === 0n) {
    // Show up to 6 decimal places for small amounts
    const trimmed = fracStr.replace(/0+$/, '');
    return `0.${trimmed || '0'}`.slice(0, 8);
  }
  // 4 decimal places for amounts >= 1 SUI
  return `${intPart}.${fracStr.slice(0, 4)}`;
}

const SUI_ADDRESS_RE = /^0x[0-9a-fA-F]{64}$/;

export function isValidSuiAddress(addr: string): boolean {
  return SUI_ADDRESS_RE.test(addr);
}

export function shortenAddress(addr: string): string {
  if (!addr || addr.length < 10) return addr;
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export function timeAgo(ts: number): string {
  const seconds = Math.floor((Date.now() - ts) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
