// Contract configuration — update these after deployment
export const PACKAGE_ID = '0xa2f8be24ba14514b7b4bc105e2779a7fadda17d750f4a33777abf549e13c0420';
export const GAME_OBJECT_ID = '0x798e1e37da40fbf95923eaacccd31822187c6bbebdb3cde4b057aaee5bd1b7ee';
export const MODULE_NAME = 'game';

// Team definitions
export const TEAMS = {
  DOGE: 0,
  PEPE: 1,
  MONKEY: 2,
  CAT: 3,
} as const;

export interface TeamInfo {
  id: number;
  name: string;
  emoji: string;
  playerDivPct: number;
  jackpotPct: number;
  zhPct: number;
  description: string;
  color: string;
}

export const TEAM_LIST: TeamInfo[] = [
  {
    id: 0,
    name: 'Doge',
    emoji: '🐕',
    playerDivPct: 56,
    jackpotPct: 21,
    zhPct: 10,
    description: '狗币精神，忠诚拿分红',
    color: '#f59e0b',
  },
  {
    id: 1,
    name: 'Pepe',
    emoji: '🐸',
    playerDivPct: 43,
    jackpotPct: 36,
    zhPct: 8,
    description: '悲伤蛙蛙，均衡发育',
    color: '#4ade80',
  },
  {
    id: 2,
    name: '猴子',
    emoji: '🐒',
    playerDivPct: 30,
    jackpotPct: 51,
    zhPct: 6,
    description: '无脑冲塔，大奖在此',
    color: '#ef4444',
  },
  {
    id: 3,
    name: '猫猫',
    emoji: '🐱',
    playerDivPct: 43,
    jackpotPct: 44,
    zhPct: 0,
    description: '躺着也赢，佛系玩家',
    color: '#3b82f6',
  },
];

export function getTeamInfo(teamId: number): TeamInfo {
  return TEAM_LIST[teamId] ?? TEAM_LIST[0];
}

const TEAM_TRANS_KEYS = ['doge', 'pepe', 'monkey', 'cat'] as const;
export type TeamTransKey = typeof TEAM_TRANS_KEYS[number];

export function getTeamTransKey(teamId: number): TeamTransKey {
  return TEAM_TRANS_KEYS[teamId] ?? 'doge';
}

// Sui constants
export const SUI_DECIMALS = 1_000_000_000;

// Network config — default to testnet
export const NETWORK = 'testnet';
