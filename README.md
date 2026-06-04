# ZeroHour

<p align="center">
  <strong>Countdown-driven strategy game on Sui Network</strong><br>
  Buy tickets. Extend the clock. Win when it hits zero.
</p>

---

## What is ZeroHour?

ZeroHour is a decentralized game where players buy tickets to extend a countdown timer. When the timer hits **zero**, the **last ticket buyer wins the jackpot**. Every ticket purchase also earns **real-time dividends** for fellow team members.

A countdown-driven game — rebuilt on Sui for speed, fairness, and low fees.

## Game Mechanics

1. **Pick a team** — Doge, Pepe, Monkey, or Cat. Each has a different dividend/jackpot split.
2. **Buy tickets** — Each ticket costs ~0.01 SUI + 0.0001 SUI per ticket sold so far. Buying extends the countdown by 30 seconds (max 24 hours).
3. **Earn dividends** — When anyone on your team buys tickets, you earn a share. Claim anytime.
4. **Win the jackpot** — Be the last ticket buyer when the timer hits zero, and take the prize pool.

### Team Allocation

| Team | Player Dividends | Jackpot |
|------|:---:|:---:|
| Doge | 66% | 20% |
| Pepe | 51% | 35% |
| Monkey | 36% | 50% |
| Cat | 43% | 43% |

*(Community fund 2% + Airdrop pool 1% + Pot swap 1% + Referral 10% = 14% deducted first; remainder split as above)*

### Jackpot Distribution (when round ends)

| Winner | Share |
|--------|:---:|
| Last buyer | 48% |
| Team pool (shared) | 30% |
| Next round seeding | 10% |
| Community fund | 12% |

## Why Sui

- **No block stuffing** — Sui's parallel execution eliminates mempool manipulation
- **Secure randomness** — Uses `sui::random` (validator DKG) instead of predictable block hashes
- **No pre-mine** — Fair launch, community-owned from day one
- **Linear bonding curve** — Gas-efficient, easy to understand pricing
- **Batch dividends** — Claim across rounds efficiently

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Smart Contract | Sui Move (2024 edition) |
| Frontend | React 18 + TypeScript + Vite |
| Wallet | @mysten/dapp-kit v0.15 |
| SDK | @mysten/sui v1.25 |
| i18n | English / 简体中文 / 日本語 |

## Contract Addresses

### Testnet

| Resource | Address |
|----------|---------|
| Package | `0xd962187b9d66ec60d7dd23209cd9c42d5b0170e5ff4db7a3ba0928daa2131997` |
| Game Object | `0x768dbc9fc7d912841b5ac0e09211245653b733669968313aa7216dfd6dfd884c` |
| Upgrade Cap | `0xad3b1b315a8601239f2aec626b5dd013c14f8f6f32853144afb621e2b50ec009` |

### Mainnet

> Coming soon — deploying after testnet validation.

## Project Structure

```
zerohour/
├── move/                    # Sui Move smart contract
│   ├── Move.toml
│   ├── sources/
│   │   └── game.move        # All game logic (single module)
│   └── tests/
│       └── game_tests.move
├── frontend/                # React SPA
│   ├── src/
│   │   ├── components/      # UI components
│   │   ├── hooks/           # useGame, useCountdown
│   │   ├── i18n/            # translations + context
│   │   ├── lib/             # Sui SDK helpers
│   │   └── styles/          # CSS
│   └── package.json
└── README.md
```

## Quick Start

### Prerequisites

- [Sui CLI](https://docs.sui.io/guides/developer/getting-started/sui-install) (v1.72+)
- [Node.js](https://nodejs.org/) 18+
- [Sui Wallet](https://chromewebstore.google.com/detail/sui-wallet) browser extension

### Frontend (dev)

```bash
cd frontend
npm install
npm run dev
```

The dev server starts at `http://localhost:5173`. Connect your Sui Wallet (testnet mode) to play.

### Contract (build & test)

```bash
cd move
sui move build
sui move test
```

### Deploy Contract

```bash
cd move
sui client publish --gas-budget 50000000
```

## Fees & Revenue

| Allocation | % |
|------------|:--:|
| Player Dividends | ~37-57% |
| Jackpot | ~17-43% |
| Referral Rewards | 10% |
| Community Fund (dev) | 2% |
| Airdrop Pool | 1% |
| Pot Swap | 1% |

All percentages are fixed in the contract and verifiable on-chain.

## Security

- No admin keys can withdraw player funds
- Dividend claims are non-custodial
- Timer extensions are capped at 24 hours
- Max 100 tickets per transaction
- All game logic is open source and auditable

## License

MIT

---

# ZeroHour （零时）

<p align="center">
  <strong>基于 Sui Network 的倒计时策略链游</strong><br>
  买Ticket，续时间。倒计时归零，赢下所有。
</p>

## 游戏规则

1. **选战队** — Doge、Pepe、猴子、猫猫，四个战队分红/大奖比例不同。
2. **买Ticket** — 每张Ticket起始价 0.01 SUI，每售出1张涨 0.0001 SUI。购买延长倒计时 30 秒（上限 24 小时）。
3. **领分红** — 同队队友买Ticket，你实时分到SUI，随时领取。
4. **赢大奖** — 倒计时归零那一刻，最后一张Ticket的买家抱走奖池。

### 战队分配

| 战队 | 玩家分红 | 大奖池 |
|------|:---:|:---:|
| Doge | 66% | 20% |
| Pepe | 51% | 35% |
| 猴子 | 36% | 50% |
| 猫猫 | 43% | 43% |

### 奖池分配（本轮结束）

| 赢家 | 比例 |
|------|:---:|
| 最后买家 | 48% |
| 团队共享 | 30% |
| 下轮启动 | 10% |
| 社区基金 | 12% |

## 为什么选择 Sui

- **无区块拥堵** — Sui 并行执行，无 mempool，杜绝矿工阻塞攻击
- **安全随机数** — `sui::random` 验证者联合生成，不可预测
- **公平启动** — 无预挖、无团队预留，社区共有
- **线性定价曲线** — Gas节省，简单透明

## 技术栈

- 合约：Sui Move (2024 edition)
- 前端：React 18 + TypeScript + Vite
- 钱包：@mysten/dapp-kit v0.15
- 多语言：English / 简体中文 / 日本語

## 快速开始

```bash
cd frontend && npm install && npm run dev
```

用 Sui Wallet（testnet 模式）连接即可游玩。

## 费用透明

所有比例在合约中硬编码，任何人可链上查验。团队无超权限，无法提取玩家资金。

## 社区链接

- Twitter/X: [待创建]
- Discord: [待创建]
- Telegram: [待创建]
