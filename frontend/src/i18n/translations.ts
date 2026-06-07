export type Lang = 'en' | 'zh-CN' | 'ja' | 'ko';

export interface Translations {
  // Header
  'app.title': string;
  // GameStatus
  'game.round': string;
  'game.jackpot': string;
  'game.ticketsSold': string;
  'game.totalVolume': string;
  'game.leader': string;
  'game.none': string;
  'game.tagline': string;
  'game.totalPlayers': string;
  // Countdown
  'countdown.ended': string;
  // Team Selector
  'team.divPct': string;
  'team.jackpotPct': string;
  'team.tickets': string;
  'team.players': string;
  // Team names & descriptions
  'team.doge.name': string;
  'team.doge.desc': string;
  'team.pepe.name': string;
  'team.pepe.desc': string;
  'team.monkey.name': string;
  'team.monkey.desc': string;
  'team.cat.name': string;
  'team.cat.desc': string;
  // BuyKeys
  'buy.chooseTeam': string;
  'buy.ticketCount': string;
  'buy.reset': string;
  'buy.estimatedCost': string;
  'buy.avgPrice': string;
  'buy.teamHint': string;
  'buy.connectWallet': string;
  'buy.confirming': string;
  'buy.button': string;
  'buy.confirmWallet': string;
  'buy.success': string;
  'buy.txFailed': string;
  'buy.error': string;
  'buy.loadingPlayer': string;
  // DividendPanel
  'div.yourDividends': string;
  'div.connectWallet': string;
  'div.noTickets': string;
  'div.holding': string;
  'div.address': string;
  'div.claiming': string;
  'div.claim': string;
  'div.claimSuccess': string;
  'div.claimFailed': string;
  'div.zhBalance': string;
  'div.zhClaim': string;
  'div.zhClaiming': string;
  'div.zhClaimSuccess': string;
  'div.zhClaimFailed': string;
  'div.zhBadge': string;
  'div.noDividends': string;
  'div.alreadyClaimed': string;
  'div.zhAlreadyClaimed': string;
  // RoundEnded
  'roundEnded.title': string;
  'roundEnded.jackpotLabel': string;
  'roundEnded.noTickets': string;
  'roundEnded.claimButton': string;
  'roundEnded.pending': string;
  'roundEnded.hint': string;
  'roundEnded.claimSuccess': string;
  'roundEnded.claimFailed': string;
  // Leaderboard
  'lb.title': string;
  'lb.empty': string;
  'lb.colRank': string;
  'lb.colTeam': string;
  'lb.colTickets': string;
  'lb.colShare': string;
  'lb.colPlayers': string;
  'lb.colVolume': string;
  // AirdropBanner
  'airdrop.pool': string;
  'airdrop.stats': string;
  'airdrop.hint': string;
  // Referral
  'ref.label': string;
  'ref.yourLink': string;
  'ref.copy': string;
  'ref.note': string;
  // HowToPlay
  'htp.step1.title': string;
  'htp.step1.desc': string;
  'htp.step1.tag1': string;
  'htp.step1.tag2': string;
  'htp.step1.tag3': string;
  'htp.step1.tag4': string;
  'htp.step2.title': string;
  'htp.step2.desc': string;
  'htp.step2.note': string;
  'htp.step3.title': string;
  'htp.step3.desc': string;
  'htp.step3.note': string;
  'htp.showDetails': string;
  'htp.hideDetails': string;
  // HowToPlay - Rule Sections
  'htp.rule.mechanics': string;
  'htp.rule.mechanics.1': string;
  'htp.rule.mechanics.2': string;
  'htp.rule.mechanics.3': string;
  'htp.rule.mechanics.4': string;
  'htp.rule.pricing': string;
  'htp.rule.pricing.1': string;
  'htp.rule.pricing.2': string;
  'htp.rule.pricing.3': string;
  'htp.rule.teams': string;
  'htp.rule.teams.th1': string;
  'htp.rule.teams.th2': string;
  'htp.rule.teams.th3': string;
  'htp.rule.teams.th4': string;
  'htp.rule.teams.th5': string;
  'htp.rule.teams.row1col4': string;
  'htp.rule.teams.row2col4': string;
  'htp.rule.teams.row3col4': string;
  'htp.rule.teams.row4col4': string;
  'htp.rule.teams.row1col5': string;
  'htp.rule.teams.row2col5': string;
  'htp.rule.teams.row3col5': string;
  'htp.rule.teams.row4col5': string;
  'htp.rule.zh.title': string;
  'htp.rule.zh.1': string;
  'htp.rule.zh.2': string;
  'htp.rule.zh.3': string;
  'htp.rule.zh.4': string;
  'htp.rule.zh.5': string;
  'htp.rule.funds': string;
  'htp.rule.funds.th1': string;
  'htp.rule.funds.th2': string;
  'htp.rule.funds.th3': string;
  'htp.rule.funds.row1col1': string;
  'htp.rule.funds.row1col3': string;
  'htp.rule.funds.row2col1': string;
  'htp.rule.funds.row2col3': string;
  'htp.rule.funds.row3col1': string;
  'htp.rule.funds.row3col3': string;
  'htp.rule.funds.row4col1': string;
  'htp.rule.funds.row4col3': string;
  'htp.rule.funds.row5col1': string;
  'htp.rule.funds.row5col3': string;
  'htp.rule.funds.row6col1': string;
  'htp.rule.funds.row6col3': string;
  'htp.rule.funds.teamDecides': string;
  'htp.rule.dividends': string;
  'htp.rule.dividends.1': string;
  'htp.rule.dividends.2': string;
  'htp.rule.dividends.3': string;
  'htp.rule.dividends.4': string;
  'htp.rule.dividends.5': string;
  'htp.rule.jackpot': string;
  'htp.rule.jackpot.th1': string;
  'htp.rule.jackpot.th2': string;
  'htp.rule.jackpot.th3': string;
  'htp.rule.jackpot.row1col1': string;
  'htp.rule.jackpot.row1col3': string;
  'htp.rule.jackpot.row2col1': string;
  'htp.rule.jackpot.row2col3': string;
  'htp.rule.jackpot.row3col1': string;
  'htp.rule.jackpot.row3col3': string;
  'htp.rule.jackpot.row4col1': string;
  'htp.rule.jackpot.row4col3': string;
  'htp.rule.airdrop': string;
  'htp.rule.airdrop.1': string;
  'htp.rule.airdrop.2': string;
  'htp.rule.airdrop.3': string;
  'htp.rule.referral': string;
  'htp.rule.referral.1': string;
  'htp.rule.referral.2': string;
  'htp.rule.referral.3': string;
  'htp.rule.security': string;
  'htp.rule.security.1': string;
  'htp.rule.security.2': string;
  'htp.rule.security.3': string;
  'htp.rule.security.4': string;
  'htp.rule.flow': string;
  'htp.rule.flow.desc': string;
  'htp.rule.flow.divLabel': string;
  'htp.rule.flow.divDesc': string;
  'htp.rule.flow.jpLabel': string;
  'htp.rule.flow.jpDesc': string;
  'htp.rule.flow.zhLabel': string;
  'htp.rule.flow.zhDesc': string;
  'htp.rule.flow.refDesc': string;
  'htp.rule.flow.comDesc': string;
  'htp.rule.flow.adDesc': string;
  'htp.rule.strategy': string;
  'htp.rule.strategy.1': string;
  'htp.rule.strategy.2': string;
  'htp.rule.strategy.3': string;
  'htp.rule.strategy.4': string;
  'htp.rule.faq': string;
  'htp.rule.faq.q1': string;
  'htp.rule.faq.a1': string;
  'htp.rule.faq.q2': string;
  'htp.rule.faq.a2': string;
  'htp.rule.faq.q3': string;
  'htp.rule.faq.a3': string;
  'htp.rule.faq.q4': string;
  'htp.rule.faq.a4': string;
  // Admin
  'admin.show': string;
  'admin.hide': string;
  'admin.title': string;
  'admin.communityFund': string;
  'admin.withdrawLabel': string;
  'admin.withdraw': string;
  'admin.withdrawSuccess': string;
  'admin.withdrawFailed': string;
  'admin.seedLabel': string;
  'admin.seed': string;
  'admin.seedSuccess': string;
  'admin.seedFailed': string;
  'admin.pending': string;
  'admin.pause': string;
  'admin.unpause': string;
  'admin.paused': string;
  'admin.unpaused': string;
  'admin.pausedWarning': string;
  'admin.actionFailed': string;
  // App
  'app.loading': string;
  'app.error': string;
  'app.footer': string;
  // Sound
  'sound.mute': string;
  'sound.enable': string;
  // EventFeed
  'feed.title': string;
  'feed.empty': string;
  'feed.ticket': string;
  'feed.airdrop': string;
  'feed.dividend': string;
  'feed.roundEnd': string;
  'feed.zhClaim': string;
}

const en: Translations = {
  'app.title': 'ZeroHour',
  'game.round': 'Round {round}',
  'game.jackpot': 'Current Jackpot',
  'game.ticketsSold': 'Tickets Sold',
  'game.totalVolume': 'Total Volume',
  'game.leader': 'Leader',
  'game.none': 'None',
  'game.tagline': 'Last buyer wins the jackpot — each ticket adds 30 seconds',
  'game.totalPlayers': 'Team Joins',
  'countdown.ended': 'Round Ended',
  'team.divPct': 'Div {pct}%',
  'team.jackpotPct': 'Jackpot {pct}%',
  'team.tickets': '{n} tickets',
  'team.players': '{n} players',
  'team.doge.name': 'Doge',
  'team.doge.desc': 'Doge spirit, loyal dividends',
  'team.pepe.name': 'Pepe',
  'team.pepe.desc': 'Sad frog, balanced growth',
  'team.monkey.name': 'Monkey',
  'team.monkey.desc': 'Reckless charges, big prizes',
  'team.cat.name': 'Cat',
  'team.cat.desc': 'Chill and win, zen player',
  'buy.chooseTeam': 'Choose Team',
  'buy.ticketCount': 'Ticket Count',
  'buy.reset': 'Reset',
  'buy.estimatedCost': 'Estimated Cost',
  'buy.avgPrice': 'Avg {price} SUI/ticket',
  'buy.teamHint': '{emoji} {name}: Div {div}% · JP {jackpot}% · ZH {zh}% · +30s/ticket',
  'buy.connectWallet': 'Connect Wallet to Buy',
  'buy.confirming': 'Confirming...',
  'buy.button': 'Buy {n} Tickets — {cost} SUI',
  'buy.confirmWallet': 'Please confirm the transaction in your wallet...',
  'buy.success': 'Purchase successful! {n} tickets received',
  'buy.txFailed': 'Transaction failed: {msg}',
  'buy.error': 'Error: {msg}',
  'buy.loadingPlayer': 'Loading player data...',
  'div.yourDividends': 'Your Dividends',
  'div.connectWallet': 'Connect wallet to view dividends',
  'div.noTickets': 'No tickets yet. Buy one to start!',
  'div.holding': 'Holding {n} tickets · {emoji} {name}',
  'div.address': 'Address {addr}',
  'div.claiming': 'Claiming...',
  'div.claim': 'Claim Dividends',
  'div.claimSuccess': 'Claimed {amount} SUI dividends!',
  'div.claimFailed': 'Claim failed: {msg}',
  'div.zhBalance': 'ZH Balance: {amount} ZH',
  'div.zhClaim': 'Claim ZH Dividends',
  'div.zhClaiming': 'Claiming ZH...',
  'div.zhClaimSuccess': 'Claimed {amount} SUI from ZH dividends!',
  'div.zhClaimFailed': 'ZH claim failed: {msg}',
  'div.zhBadge': 'ZH',
  'div.noDividends': 'No Dividends',
  'div.alreadyClaimed': 'Dividends already auto-claimed during ticket purchase',
  'div.zhAlreadyClaimed': 'ZH dividends already auto-claimed during ticket purchase',
  'roundEnded.title': 'Round Ended — Jackpot Time!',
  'roundEnded.jackpotLabel': 'Jackpot: {amount} SUI',
  'roundEnded.noTickets': 'No tickets were sold this round. Starting fresh!',
  'roundEnded.claimButton': 'End Round & Distribute Jackpot',
  'roundEnded.pending': 'Processing...',
  'roundEnded.hint': 'Winner is {emoji} {team} — last buyer takes it all!',
  'roundEnded.claimSuccess': 'Round ended! Jackpot {amount} SUI distributed. You are the winner!',
  'roundEnded.claimFailed': 'End round failed: {msg}',
  'lb.title': 'Team Rankings',
  'lb.empty': 'No players yet. Be the first!',
  'lb.colRank': '#',
  'lb.colTeam': 'Team',
  'lb.colTickets': 'Tickets',
  'lb.colShare': 'Share',
  'lb.colPlayers': 'Players',
  'lb.colVolume': 'Volume',
  'airdrop.pool': 'Airdrop Pool {amount} SUI',
  'airdrop.stats': 'Win Rate {pct}% · Paid {paid} SUI · {wins} wins',
  'airdrop.hint': 'Purchases ≥ 0.1 SUI may trigger an airdrop',
  'ref.label': 'Referrer Address (optional)',
  'ref.yourLink': 'Your referral link: ',
  'ref.copy': 'Copy',
  'ref.note': 'Referrer earns 10% of purchase amount. Leave blank and 10% goes to the dividend pool.',
  'htp.step1.title': 'Choose Team',
  'htp.step1.desc': 'Pick one of 4 meme teams. Each team has different dividend/jackpot ratios',
  'htp.step1.tag1': 'Doge: High Div',
  'htp.step1.tag2': 'Pepe: Balanced',
  'htp.step1.tag3': 'Monkey: Jackpot',
  'htp.step1.tag4': 'Cat: Chill',
  'htp.step2.title': 'Buy Tickets',
  'htp.step2.desc': 'Buy tickets with SUI. Each ticket extends the countdown by 30 seconds. Price increases with total tickets sold',
  'htp.step2.note': 'Starting at 0.01 SUI · +0.0001 SUI per ticket',
  'htp.step3.title': 'Earn Profits',
  'htp.step3.desc': 'Hold tickets to earn dividends continuously. When the timer hits zero, the last buyer wins the jackpot!',
  'htp.step3.note': 'Claim dividends anytime · No waiting required',
  'htp.showDetails': 'View Detailed Rules',
  'htp.hideDetails': 'Hide Detailed Rules',
  'htp.rule.mechanics': 'Core Mechanics',
  'htp.rule.mechanics.1': 'This is a Sui blockchain-based countdown game. Each round has a 24-hour countdown.',
  'htp.rule.mechanics.2': 'When anyone buys tickets, the countdown is extended by 30 seconds (max 24 hours).',
  'htp.rule.mechanics.3': 'When the countdown hits zero, the last ticket buyer wins the jackpot for that round.',
  'htp.rule.mechanics.4': 'A new round starts automatically. 10% of the previous round\'s jackpot carries over as seed funding.',
  'htp.rule.pricing': 'Ticket Pricing',
  'htp.rule.pricing.1': 'Ticket prices follow a linear bonding curve.',
  'htp.rule.pricing.2': 'Ticket price #N = 0.01 + N × 0.0001 SUI.',
  'htp.rule.pricing.3': 'Bulk purchases are calculated using arithmetic series summation.',
  'htp.rule.teams': 'Team Selection',
  'htp.rule.teams.th1': 'Team',
  'htp.rule.teams.th2': 'Player Div',
  'htp.rule.teams.th3': 'Jackpot',
  'htp.rule.teams.th4': 'ZH%',
  'htp.rule.teams.th5': 'Style',
  'htp.rule.teams.row1col4': 'Steady income, high dividends',
  'htp.rule.teams.row2col4': 'Balanced development',
  'htp.rule.teams.row3col4': 'Aggressive jackpot chase',
  'htp.rule.teams.row4col4': 'Laid-back wins',
  'htp.rule.teams.row1col5': 'Max ZH rewards, long-term SUI income',
  'htp.rule.teams.row2col5': 'Solid ZH return, balanced play',
  'htp.rule.teams.row3col5': 'Moderate ZH, highest jackpot chance',
  'htp.rule.teams.row4col5': 'No ZH — pure jackpot/dividend play',
  'htp.rule.zh.title': 'ZH Token — Permanent Dividend Rights',
  'htp.rule.zh.1': 'ZH is the game\'s dividend-bearing token. Hold ZH = earn SUI from every ticket purchase, forever.',
  'htp.rule.zh.2': 'Each ticket purchase allocates part of the payment (team-dependent, 0–10%) to the ZH pool and mints ZH tokens to the buyer.',
  'htp.rule.zh.3': 'ZH holders can claim their share of accumulated SUI dividends at any time. The dividend per ZH token grows with every purchase.',
  'htp.rule.zh.4': 'ZH is a standard Sui Coin — freely transferable and tradeable on DEXs like Cetus or Aftermath. Buy ZH on the secondary market to earn dividends without buying tickets.',
  'htp.rule.zh.5': 'Cat team pays 0% ZH, trading long-term dividend rights for higher jackpot and player dividends. All other teams earn ZH.',
  'htp.rule.funds': 'Fund Allocation (per purchase)',
  'htp.rule.funds.th1': 'Destination',
  'htp.rule.funds.th2': 'Share',
  'htp.rule.funds.th3': 'Description',
  'htp.rule.funds.row1col1': 'Player Dividend Pool',
  'htp.rule.funds.row1col3': 'Distributed to all players based on tickets held',
  'htp.rule.funds.row2col1': 'Jackpot',
  'htp.rule.funds.row2col3': 'Awarded to the last buyer when the round ends',
  'htp.rule.funds.row3col1': 'Referral Reward',
  'htp.rule.funds.row3col3': 'Given to referrer; if none, goes to dividend pool',
  'htp.rule.funds.row4col1': 'Community Fund',
  'htp.rule.funds.row4col3': 'Project maintenance',
  'htp.rule.funds.row5col1': 'Airdrop Pool',
  'htp.rule.funds.row5col3': 'Random airdrops to buyers',
  'htp.rule.funds.row6col1': 'Airdrop Pool',
  'htp.rule.funds.row6col3': 'Random airdrops to buyers',
  'htp.rule.funds.teamDecides': 'Team decides',
  'htp.rule.dividends': 'Dividend System',
  'htp.rule.dividends.1': 'On each purchase, the dividend portion accumulates in the dividend pool.',
  'htp.rule.dividends.2': 'The system tracks a dividend_per_ticket accumulator variable.',
  'htp.rule.dividends.3': 'Your pending dividends = (current dividend_per_ticket - your checkpoint) × your tickets.',
  'htp.rule.dividends.4': 'Dividends can be claimed anytime at no extra cost beyond gas fees.',
  'htp.rule.dividends.5': 'Unclaimed dividends are not lost when a round ends — they carry across rounds.',
  'htp.rule.jackpot': 'Jackpot Distribution (when round ends)',
  'htp.rule.jackpot.th1': 'Destination',
  'htp.rule.jackpot.th2': 'Share',
  'htp.rule.jackpot.th3': 'Description',
  'htp.rule.jackpot.row1col1': 'Last Buyer',
  'htp.rule.jackpot.row1col3': 'Round winner',
  'htp.rule.jackpot.row2col1': 'Player Dividends',
  'htp.rule.jackpot.row2col3': 'Distributed to all players by ticket count',
  'htp.rule.jackpot.row3col1': 'Next Round',
  'htp.rule.jackpot.row3col3': 'Seed funding for the new round',
  'htp.rule.jackpot.row4col1': 'Community + Airdrop',
  'htp.rule.jackpot.row4col3': 'Project maintenance + airdrop pool',
  'htp.rule.airdrop': 'Airdrop System',
  'htp.rule.airdrop.1': 'When a single purchase is ≥ 0.1 SUI, there is a chance of triggering a random airdrop.',
  'htp.rule.airdrop.2': 'Airdrop amounts are paid from the airdrop pool, determined by Sui on-chain randomness.',
  'htp.rule.airdrop.3': 'Larger purchases have a higher chance of triggering an airdrop.',
  'htp.rule.referral': 'Referral System',
  'htp.rule.referral.1': 'Enter a referrer address when buying — the referrer earns 10% of that purchase.',
  'htp.rule.referral.2': 'If left blank, the 10% automatically goes to the dividend pool, benefiting everyone.',
  'htp.rule.referral.3': 'You can share your own referral link with friends.',
  'htp.rule.security': 'Security Notes',
  'htp.rule.security.1': 'The contract is deployed on the Sui blockchain and is immutable.',
  'htp.rule.security.2': 'Randomness is collectively generated by Sui validators and cannot be predicted or manipulated.',
  'htp.rule.security.3': 'Sui\'s parallel execution model naturally resists block-stuffing attacks.',
  'htp.rule.security.4': 'Contract code is open source and verifiable. No backdoors.',
  'htp.rule.flow': 'Fund Allocation Flow',
  'htp.rule.flow.desc': 'Each purchase is split into variable shares (team-dependent) for Dividends, Jackpot, ZH, plus fixed 10% Referral, 2% Community, 1% Airdrop.',
  'htp.rule.flow.divLabel': 'Team%',
  'htp.rule.flow.divDesc': 'Dividends',
  'htp.rule.flow.jpLabel': 'Team%',
  'htp.rule.flow.jpDesc': 'Jackpot',
  'htp.rule.flow.zhLabel': 'Team%',
  'htp.rule.flow.zhDesc': 'ZH Token',
  'htp.rule.flow.refDesc': 'Referral',
  'htp.rule.flow.comDesc': 'Community',
  'htp.rule.flow.adDesc': 'Airdrop',
  'htp.rule.strategy': 'Strategy Guide',
  'htp.rule.strategy.1': 'Doge (56% div, 10% ZH): Best for long-term holders who want steady income + ZH dividends.',
  'htp.rule.strategy.2': 'Monkey (30% div, 51% jackpot, 6% ZH): Best for aggressive players betting on being the last buyer.',
  'htp.rule.strategy.3': 'Cat (43% div, 44% jackpot, 0% ZH): Purely jackpot/dividend focused — no ZH token rewards.',
  'htp.rule.strategy.4': 'ZH holders earn passive SUI from every purchase. Buy ZH on DEX to earn without buying tickets.',
  'htp.rule.faq': 'FAQ',
  'htp.rule.faq.q1': 'Can I switch teams after buying tickets?',
  'htp.rule.faq.a1': 'No — each wallet is locked to a single team for the round. Choose wisely. You keep your tickets when a new round starts.',
  'htp.rule.faq.q2': 'Do unclaimed dividends disappear when a round ends?',
  'htp.rule.faq.a2': 'No. Your dividend checkpoint carries across rounds. Unclaimed dividends are never lost.',
  'htp.rule.faq.q3': 'What happens if no one buys tickets in a round?',
  'htp.rule.faq.a3': 'If the timer expires with zero tickets sold, the jackpot carries over to the next round.',
  'htp.rule.faq.q4': 'Can I buy ZH tokens without buying tickets?',
  'htp.rule.faq.a4': 'Yes! ZH is a standard Sui Coin. Once a DEX liquidity pool is created, you can buy ZH directly on Cetus/Aftermath and start earning dividends immediately.',
  'admin.show': 'Admin',
  'admin.hide': 'Close Admin',
  'admin.title': 'Admin Panel',
  'admin.communityFund': 'Community Fund: {amount} SUI',
  'admin.withdrawLabel': 'Withdraw Community Fund (SUI)',
  'admin.withdraw': 'Withdraw',
  'admin.withdrawSuccess': 'Withdrawn {amount} SUI from community fund!',
  'admin.withdrawFailed': 'Withdraw failed: {msg}',
  'admin.seedLabel': 'Seed Jackpot (SUI) — only when no tickets sold',
  'admin.seed': 'Seed',
  'admin.seedSuccess': 'Seeded {amount} SUI into jackpot!',
  'admin.seedFailed': 'Seed failed: {msg}',
  'admin.pending': 'Processing...',
  'admin.pause': 'Pause Game',
  'admin.unpause': 'Resume Game',
  'admin.paused': 'Game paused. Players cannot buy tickets.',
  'admin.unpaused': 'Game resumed. Normal operations restored.',
  'admin.pausedWarning': 'Game is paused — new purchases are blocked.',
  'admin.actionFailed': 'Action failed: {msg}',
  'app.loading': 'Loading...',
  'app.error': 'Cannot load game data',
  'app.footer': 'On-chain Game · Built on Sui',
  'sound.mute': 'Mute sounds',
  'sound.enable': 'Enable sounds',
  'feed.title': 'Recent Activity',
  'feed.empty': 'No activity yet. Be the first to play!',
  'feed.ticket': '{buyer} bought {tickets} tickets {emoji} {team} — {amount} SUI',
  'feed.airdrop': '{player} won airdrop {amount} SUI',
  'feed.dividend': '{player} claimed {amount} SUI dividends',
  'feed.roundEnd': 'Round #{round} ended — {winner} {emoji} {team} won {amount} SUI',
  'feed.zhClaim': '{player} claimed {amount} SUI in ZH dividends',
};

const zhCN: Translations = {
  'app.title': 'ZeroHour',
  'game.round': '第 {round} 轮',
  'game.jackpot': '当前奖池',
  'game.ticketsSold': '已售门票',
  'game.totalVolume': '累计交易量',
  'game.leader': '领先者',
  'game.none': '暂无',
  'game.tagline': '最后一位购买者赢得奖池 — 每张门票延长 30 秒',
  'game.totalPlayers': '队伍加入',
  'countdown.ended': '本轮已结束',
  'team.divPct': '分红 {pct}%',
  'team.jackpotPct': '奖池 {pct}%',
  'team.tickets': '{n} 门票',
  'team.players': '{n} 人',
  'team.doge.name': 'Doge',
  'team.doge.desc': '狗币精神，忠诚拿分红',
  'team.pepe.name': 'Pepe',
  'team.pepe.desc': '悲伤蛙蛙，均衡发育',
  'team.monkey.name': '猴子',
  'team.monkey.desc': '无脑冲塔，大奖在此',
  'team.cat.name': '猫猫',
  'team.cat.desc': '躺着也赢，佛系玩家',
  'buy.chooseTeam': '选择战队',
  'buy.ticketCount': '门票数量',
  'buy.reset': '重置',
  'buy.estimatedCost': '预估费用',
  'buy.avgPrice': '均价 {price} SUI/张',
  'buy.teamHint': '{emoji} {name}：分红 {div}% · 奖池 {jackpot}% · ZH {zh}% · 每张 +30s',
  'buy.connectWallet': '连接钱包以购买',
  'buy.confirming': '确认中...',
  'buy.button': '购买 {n} 张门票 — {cost} SUI',
  'buy.confirmWallet': '请在钱包中确认交易...',
  'buy.success': '购买成功！{n} 张门票已到账',
  'buy.txFailed': '交易失败：{msg}',
  'buy.error': '错误：{msg}',
  'buy.loadingPlayer': '加载玩家数据...',
  'div.yourDividends': '你的分红',
  'div.connectWallet': '连接钱包以查看分红',
  'div.noTickets': '还没有购买门票，买一张开始吧。',
  'div.holding': '持有 {n} 张门票 · {emoji} {name}',
  'div.address': '地址 {addr}',
  'div.claiming': '领取中...',
  'div.claim': '提取分红',
  'div.claimSuccess': '已领取 {amount} SUI 分红！',
  'div.claimFailed': '领取失败：{msg}',
  'div.zhBalance': 'ZH余额: {amount} ZH',
  'div.zhClaim': '领取ZH分红',
  'div.zhClaiming': 'ZH领取中...',
  'div.zhClaimSuccess': '已从ZH领取 {amount} SUI 分红！',
  'div.zhClaimFailed': 'ZH领取失败：{msg}',
  'div.zhBadge': 'ZH',
  'div.noDividends': '暂无分红',
  'div.alreadyClaimed': '分红已在购票时自动领取',
  'div.zhAlreadyClaimed': 'ZH分红已在购票时自动领取',
  'roundEnded.title': '本轮结束 — 奖池派发！',
  'roundEnded.jackpotLabel': '奖池：{amount} SUI',
  'roundEnded.noTickets': '本轮未售出门票，即将开始新一轮！',
  'roundEnded.claimButton': '结束本轮并派发奖池',
  'roundEnded.pending': '处理中...',
  'roundEnded.hint': '赢家是 {emoji} {team} — 最后购买者赢得一切！',
  'roundEnded.claimSuccess': '轮次结束！奖池 {amount} SUI 已派发。你是赢家！',
  'roundEnded.claimFailed': '结束轮次失败：{msg}',
  'lb.title': '战队排行',
  'lb.empty': '还没有玩家加入，成为第一个！',
  'lb.colRank': '#',
  'lb.colTeam': '战队',
  'lb.colTickets': '门票数',
  'lb.colShare': '占比',
  'lb.colPlayers': '玩家',
  'lb.colVolume': '交易量',
  'airdrop.pool': '空投奖池 {amount} SUI',
  'airdrop.stats': '中奖率 {pct}% · 已派 {paid} SUI · {wins} 次',
  'airdrop.hint': '单笔 ≥ 0.1 SUI 即有机会触发空投',
  'ref.label': '推荐人地址（选填）',
  'ref.yourLink': '你的推荐链接：',
  'ref.copy': '复制',
  'ref.note': '推荐人获得购买金额的 10%。留空则 10% 进入分红池。',
  'htp.step1.title': '选择战队',
  'htp.step1.desc': '从 4 个 Meme 战队中选择一个。不同战队分红 / 奖池比例不同',
  'htp.step1.tag1': 'Doge 高分红',
  'htp.step1.tag2': 'Pepe 均衡',
  'htp.step1.tag3': '猴子 冲奖',
  'htp.step1.tag4': '猫猫 中庸',
  'htp.step2.title': '购买门票',
  'htp.step2.desc': '用 SUI 购买门票，每张门票延长倒计时 30 秒。价格随总门票数递增',
  'htp.step2.note': '起价 0.01 SUI · 每张 +0.0001 SUI',
  'htp.step3.title': '赚取收益',
  'htp.step3.desc': '持有门票持续获得分红。倒计时归零时，最后购买的玩家赢得奖池！',
  'htp.step3.note': '随时提取分红 · 无需等待',
  'htp.showDetails': '查看详细规则',
  'htp.hideDetails': '收起详细规则',
  'htp.rule.mechanics': '核心机制',
  'htp.rule.mechanics.1': '这是一个基于 Sui 区块链的倒计时博弈游戏。每轮 24 小时倒计时。',
  'htp.rule.mechanics.2': '任何人购买门票后，倒计时延长 30 秒（上限 24 小时）。',
  'htp.rule.mechanics.3': '当倒计时归零，最后一位购买门票的玩家赢得本轮奖池。',
  'htp.rule.mechanics.4': '新轮次自动开始，上一轮奖池的 10% 滚入新轮次作为启动资金。',
  'htp.rule.pricing': '门票定价',
  'htp.rule.pricing.1': '门票价格采用线性加价曲线（Bonding Curve）。',
  'htp.rule.pricing.2': '第 N 张门票价格 = 0.01 + N × 0.0001 SUI。',
  'htp.rule.pricing.3': '批量购买按等差数列求和计算总价。',
  'htp.rule.teams': '战队选择',
  'htp.rule.teams.th1': '战队',
  'htp.rule.teams.th2': '玩家分红',
  'htp.rule.teams.th3': '奖池比例',
  'htp.rule.teams.th4': 'ZH%',
  'htp.rule.teams.th5': '风格',
  'htp.rule.teams.row1col4': '稳定收租，高分红',
  'htp.rule.teams.row2col4': '均衡发展',
  'htp.rule.teams.row3col4': '激进冲大奖',
  'htp.rule.teams.row4col4': '佛系躺赢',
  'htp.rule.teams.row1col5': '最高ZH回报，长期SUI收入',
  'htp.rule.teams.row2col5': '稳定ZH回报，均衡玩法',
  'htp.rule.teams.row3col5': '中等ZH，最高奖池概率',
  'htp.rule.teams.row4col5': '无ZH — 纯奖池/分红路线',
  'htp.rule.zh.title': 'ZH代币 — 永久分红权证',
  'htp.rule.zh.1': 'ZH是游戏的分红权证代币。持有ZH = 从每次购票中永久获得SUI分红。',
  'htp.rule.zh.2': '每次购票将部分付款（依战队不同，0-10%）分配给ZH池，并铸造ZH代币给买家。',
  'htp.rule.zh.3': 'ZH持有者可随时领取累积的SUI分红。每个ZH代币的分红量随每次购买而增长。',
  'htp.rule.zh.4': 'ZH是标准Sui Coin — 可自由转账，可在Cetus、Aftermath等DEX上交易。无需购票，在二级市场购买ZH即可获得分红权。',
  'htp.rule.zh.5': '猫队ZH为0%，放弃长期分红权换取最高奖池和玩家分红。其他三队均获得ZH。',
  'htp.rule.funds': '资金分配（每笔购买）',
  'htp.rule.funds.th1': '去向',
  'htp.rule.funds.th2': '比例',
  'htp.rule.funds.th3': '说明',
  'htp.rule.funds.row1col1': '玩家分红池',
  'htp.rule.funds.row1col3': '按持门票量分给所有玩家',
  'htp.rule.funds.row2col1': '奖池',
  'htp.rule.funds.row2col3': '轮次结束时归最后买家',
  'htp.rule.funds.row3col1': 'ZH代币池',
  'htp.rule.funds.row3col3': '铸造ZH给买家，持有者分SUI红利',
  'htp.rule.funds.row4col1': '推荐奖励',
  'htp.rule.funds.row4col3': '给推荐人；无推荐人则进分红池',
  'htp.rule.funds.row5col1': '社区基金',
  'htp.rule.funds.row5col3': '项目维护',
  'htp.rule.funds.row6col1': '空投奖池',
  'htp.rule.funds.row6col3': '随机空投给买家',
  'htp.rule.funds.teamDecides': '战队决定',
  'htp.rule.dividends': '分红系统',
  'htp.rule.dividends.1': '每次购买时，分红部分累积到分红池。',
  'htp.rule.dividends.2': '系统维护一个每门票累计分红（dividend_per_ticket）变量。',
  'htp.rule.dividends.3': '你的待领分红 = (当前 dividend_per_ticket - 你的 checkpoint) × 你的门票数。',
  'htp.rule.dividends.4': '分红可随时提取，不消耗 Gas 之外的额外费用。',
  'htp.rule.dividends.5': '轮次结束时未领分红不丢失，可跨轮次领取。',
  'htp.rule.jackpot': '奖池分配（轮次结束时）',
  'htp.rule.jackpot.th1': '去向',
  'htp.rule.jackpot.th2': '比例',
  'htp.rule.jackpot.th3': '说明',
  'htp.rule.jackpot.row1col1': '最后买家',
  'htp.rule.jackpot.row1col3': '本轮赢家',
  'htp.rule.jackpot.row2col1': '玩家分红',
  'htp.rule.jackpot.row2col3': '按门票数分给所有玩家',
  'htp.rule.jackpot.row3col1': '滚入下一轮',
  'htp.rule.jackpot.row3col3': '新轮次启动资金',
  'htp.rule.jackpot.row4col1': '社区 + 空投',
  'htp.rule.jackpot.row4col3': '项目维护 + 空投池',
  'htp.rule.airdrop': '空投系统',
  'htp.rule.airdrop.1': '单笔购买 ≥ 0.1 SUI 时，有一定概率触发随机空投。',
  'htp.rule.airdrop.2': '空投金额从空投奖池中支出，由 Sui 链上随机数决定。',
  'htp.rule.airdrop.3': '购买金额越大，触发概率越高。',
  'htp.rule.referral': '推荐系统',
  'htp.rule.referral.1': '购买时填写推荐人地址，推荐人获得该笔购买的 10%。',
  'htp.rule.referral.2': '不填推荐人，10% 自动进入分红池，所有人受益。',
  'htp.rule.referral.3': '可分享自己的推荐链接给朋友。',
  'htp.rule.security': '安全说明',
  'htp.rule.security.1': '合约部署在 Sui 区块链上，不可篡改。',
  'htp.rule.security.2': '随机数由 Sui 验证节点集体生成，无法预测或操控。',
  'htp.rule.security.3': 'Sui 并行执行机制天然抵御区块 stuffing 攻击。',
  'htp.rule.security.4': '合约代码开源可查，无后门。',
  'htp.rule.flow': '资金分配流程',
  'htp.rule.flow.desc': '每笔购买按战队比例拆分为：分红、奖池、ZH代币，外加固定 10% 推荐、2% 社区、1% 空投。',
  'htp.rule.flow.divLabel': '战队%',
  'htp.rule.flow.divDesc': '玩家分红',
  'htp.rule.flow.jpLabel': '战队%',
  'htp.rule.flow.jpDesc': '奖池',
  'htp.rule.flow.zhLabel': '战队%',
  'htp.rule.flow.zhDesc': 'ZH代币',
  'htp.rule.flow.refDesc': '推荐',
  'htp.rule.flow.comDesc': '社区',
  'htp.rule.flow.adDesc': '空投',
  'htp.rule.strategy': '策略指南',
  'htp.rule.strategy.1': 'Doge（56% 分红，10% ZH）：长期持有最佳选择，稳定分红 + ZH双重收益。',
  'htp.rule.strategy.2': '猴子（30% 分红，51% 奖池，6% ZH）：激进赌最后买家，奖池最高。',
  'htp.rule.strategy.3': '猫队（43% 分红，44% 奖池，0% ZH）：纯奖池/分红路线，无ZH。',
  'htp.rule.strategy.4': 'ZH持有者从每笔购买中获取被动SUI收入。可在DEX购买ZH，无需买票即可赚分红。',
  'htp.rule.faq': '常见问题',
  'htp.rule.faq.q1': '购票后可以换战队吗？',
  'htp.rule.faq.a1': '不行 — 每个钱包在本轮内锁定一个战队。选好再出手。新一轮开始时保留你的票。',
  'htp.rule.faq.q2': '轮次结束时未领分红会消失吗？',
  'htp.rule.faq.a2': '不会。你的分红 checkpoint 跨轮次继承，未领分红永不丢失。',
  'htp.rule.faq.q3': '如果一轮没人买票会怎样？',
  'htp.rule.faq.a3': '如果倒计时结束且无人购票，奖池将滚入下一轮。',
  'htp.rule.faq.q4': '可以不买票直接购买ZH吗？',
  'htp.rule.faq.a4': '可以！ZH是标准Sui Coin。DEX流动性池创建后，可在Cetus/Aftermath上直接购买ZH，立即开始赚取分红。',
  'admin.show': '管理',
  'admin.hide': '关闭管理',
  'admin.title': '管理员面板',
  'admin.communityFund': '社区基金：{amount} SUI',
  'admin.withdrawLabel': '提取社区基金 (SUI)',
  'admin.withdraw': '提取',
  'admin.withdrawSuccess': '已从社区基金提取 {amount} SUI！',
  'admin.withdrawFailed': '提取失败：{msg}',
  'admin.seedLabel': '注入奖池 (SUI) — 仅在无人购票时可用',
  'admin.seed': '注入',
  'admin.seedSuccess': '已向奖池注入 {amount} SUI！',
  'admin.seedFailed': '注入失败：{msg}',
  'admin.pending': '处理中...',
  'admin.pause': '暂停游戏',
  'admin.unpause': '恢复游戏',
  'admin.paused': '游戏已暂停，玩家无法购票。',
  'admin.unpaused': '游戏已恢复，正常运行。',
  'admin.pausedWarning': '游戏已暂停 — 新购买已被阻止。',
  'admin.actionFailed': '操作失败：{msg}',
  'app.loading': '加载中...',
  'app.error': '无法加载游戏数据',
  'app.footer': '链上博弈游戏 · Built on Sui',
  'sound.mute': '静音',
  'sound.enable': '开启音效',
  'feed.title': '最近动态',
  'feed.empty': '暂无活动，成为第一个玩家！',
  'feed.ticket': '{buyer} 购买了 {tickets} 张门票 {emoji} {team} — {amount} SUI',
  'feed.airdrop': '{player} 获得空投 {amount} SUI',
  'feed.dividend': '{player} 领取了 {amount} SUI 分红',
  'feed.roundEnd': '第 {round} 轮结束 — {winner} {emoji} {team} 赢得 {amount} SUI',
  'feed.zhClaim': '{player} 领取了 {amount} SUI ZH分红',
};

const ja: Translations = {
  'app.title': 'ZeroHour',
  'game.round': '第 {round} ラウンド',
  'game.jackpot': '現在のジャックポット',
  'game.ticketsSold': '販売済みチケット',
  'game.totalVolume': '累計取引量',
  'game.leader': 'リーダー',
  'game.none': 'なし',
  'game.tagline': '最後の購入者がジャックポットを獲得 — 1枚ごとに30秒延長',
  'game.totalPlayers': 'チーム参加',
  'countdown.ended': 'ラウンド終了',
  'team.divPct': '配当 {pct}%',
  'team.jackpotPct': 'JP {pct}%',
  'team.tickets': '{n} チケット',
  'team.players': '{n} 人',
  'team.doge.name': 'Doge',
  'team.doge.desc': 'Doge精神、忠诚な配当',
  'team.pepe.name': 'Pepe',
  'team.pepe.desc': '悲しみのカエル、バランス成長',
  'team.monkey.name': 'モンキー',
  'team.monkey.desc': '無謀な突撃、大賞金',
  'team.cat.name': '猫',
  'team.cat.desc': 'のんびり勝利、禅プレイヤー',
  'buy.chooseTeam': 'チーム選択',
  'buy.ticketCount': 'チケット数',
  'buy.reset': 'リセット',
  'buy.estimatedCost': '推定費用',
  'buy.avgPrice': '平均 {price} SUI/枚',
  'buy.teamHint': '{emoji} {name}：配当 {div}% · JP {jackpot}% · ZH {zh}% · 1枚+30秒',
  'buy.connectWallet': 'ウォレットを接続して購入',
  'buy.confirming': '確認中...',
  'buy.button': '{n} 枚購入 — {cost} SUI',
  'buy.confirmWallet': 'ウォレットで取引を確認してください...',
  'buy.success': '購入成功！{n} 枚のチケットを受け取りました',
  'buy.txFailed': '取引失敗：{msg}',
  'buy.error': 'エラー：{msg}',
  'buy.loadingPlayer': 'プレイヤーデータ読み込み中...',
  'div.yourDividends': 'あなたの配当',
  'div.connectWallet': 'ウォレットを接続して配当を表示',
  'div.noTickets': 'まだチケットがありません。購入して始めましょう！',
  'div.holding': '{n} 枚保有 · {emoji} {name}',
  'div.address': 'アドレス {addr}',
  'div.claiming': '請求中...',
  'div.claim': '配当を請求',
  'div.claimSuccess': '{amount} SUIの配当を請求しました！',
  'div.claimFailed': '請求失敗：{msg}',
  'div.zhBalance': 'ZH残高: {amount} ZH',
  'div.zhClaim': 'ZH配当を請求',
  'div.zhClaiming': 'ZH請求中...',
  'div.zhClaimSuccess': 'ZH配当から {amount} SUIを請求しました！',
  'div.zhClaimFailed': 'ZH請求失敗：{msg}',
  'div.zhBadge': 'ZH',
  'div.noDividends': '配当なし',
  'div.alreadyClaimed': '配当はチケット購入時に自動請求済みです',
  'div.zhAlreadyClaimed': 'ZH配当はチケット購入時に自動請求済みです',
  'roundEnded.title': 'ラウンド終了 — ジャックポット配布！',
  'roundEnded.jackpotLabel': 'ジャックポット：{amount} SUI',
  'roundEnded.noTickets': '今ラウンドはチケットが販売されませんでした。新しくスタート！',
  'roundEnded.claimButton': 'ラウンド終了 & ジャックポット配布',
  'roundEnded.pending': '処理中...',
  'roundEnded.hint': '勝者は {emoji} {team} — 最後の購入者が全てを手に入れる！',
  'roundEnded.claimSuccess': 'ラウンド終了！ジャックポット {amount} SUI が配布されました。あなたの勝ちです！',
  'roundEnded.claimFailed': 'ラウンド終了に失敗：{msg}',
  'lb.title': 'チームランキング',
  'lb.empty': 'まだプレイヤーがいません。最初のプレイヤーになりましょう！',
  'lb.colRank': '#',
  'lb.colTeam': 'チーム',
  'lb.colTickets': 'チケット',
  'lb.colShare': 'シェア',
  'lb.colPlayers': 'プレイヤー',
  'lb.colVolume': '取引量',
  'airdrop.pool': 'エアドロッププール {amount} SUI',
  'airdrop.stats': '当選率 {pct}% · 支払済 {paid} SUI · {wins} 回',
  'airdrop.hint': '0.1 SUI以上の購入でエアドロップの可能性',
  'ref.label': '紹介者アドレス（任意）',
  'ref.yourLink': 'あなたの紹介リンク：',
  'ref.copy': 'コピー',
  'ref.note': '紹介者は購入額の10%を獲得。空白の場合は10%が配当プールに入ります。',
  'htp.step1.title': 'チームを選ぶ',
  'htp.step1.desc': '4つのMemeチームから1つ選択。各チームで配当/JP比率が異なります',
  'htp.step1.tag1': 'Doge 高配当',
  'htp.step1.tag2': 'Pepe バランス',
  'htp.step1.tag3': 'モンキー JP重視',
  'htp.step1.tag4': '猫 のんびり',
  'htp.step2.title': 'チケット購入',
  'htp.step2.desc': 'SUIでチケットを購入。1枚ごとにカウントダウンが30秒延長。総チケット数に応じて価格が上昇',
  'htp.step2.note': '開始価格 0.01 SUI · 1枚ごと +0.0001 SUI',
  'htp.step3.title': '利益を得る',
  'htp.step3.desc': 'チケットを保有して配当を継続的に獲得。タイマーがゼロになると、最後の購入者がJPを獲得！',
  'htp.step3.note': 'いつでも配当を請求可能 · 待つ必要なし',
  'htp.showDetails': '詳細ルールを見る',
  'htp.hideDetails': '詳細ルールを閉じる',
  'htp.rule.mechanics': 'コアメカニクス',
  'htp.rule.mechanics.1': 'これはSuiブロックチェーン上のカウントダウンゲームです。各ラウンドは24時間のカウントダウン。',
  'htp.rule.mechanics.2': '誰かがチケットを購入すると、カウントダウンが30秒延長されます（最大24時間）。',
  'htp.rule.mechanics.3': 'カウントダウンがゼロになると、最後のチケット購入者がそのラウンドのJPを獲得します。',
  'htp.rule.mechanics.4': '新しいラウンドが自動的に開始。前ラウンドのJPの10%がシード資金として繰り越されます。',
  'htp.rule.pricing': 'チケット価格',
  'htp.rule.pricing.1': 'チケット価格は線形ボンディングカーブに従います。',
  'htp.rule.pricing.2': 'N番目のチケット価格 = 0.01 + N × 0.0001 SUI。',
  'htp.rule.pricing.3': 'まとめ買いは等差数列の合計で計算されます。',
  'htp.rule.teams': 'チーム選択',
  'htp.rule.teams.th1': 'チーム',
  'htp.rule.teams.th2': 'プレイヤー配当',
  'htp.rule.teams.th3': 'ジャックポット',
  'htp.rule.teams.th4': 'ZH%',
  'htp.rule.teams.th5': 'スタイル',
  'htp.rule.teams.row1col4': '安定収入、高配当',
  'htp.rule.teams.row2col4': 'バランス型',
  'htp.rule.teams.row3col4': '攻撃的JP狙い',
  'htp.rule.teams.row4col4': 'のんびり勝利',
  'htp.rule.teams.row1col5': '最大ZH、長期SUI収入',
  'htp.rule.teams.row2col5': '安定ZHリターン、バランス型',
  'htp.rule.teams.row3col5': '中程度ZH、最高JP確率',
  'htp.rule.teams.row4col5': 'ZHなし — JP/配当重視',
  'htp.rule.zh.title': 'ZHトークン — 永久配当権',
  'htp.rule.zh.1': 'ZHはゲームの配当権トークン。ZHを保有 = すべてのチケット購入から永久にSUIを獲得。',
  'htp.rule.zh.2': '各チケット購入で支払いの一部（チーム別、0-10%）がZHプールに割り当てられ、購入者にZHがミントされます。',
  'htp.rule.zh.3': 'ZH保有者は累積SUI配当をいつでも請求可能。ZHあたりの配当は購入ごとに増加します。',
  'htp.rule.zh.4': 'ZHは標準Sui Coin — 自由に転送可能で、CetusやAftermathなどのDEXで取引できます。チケットを買わずにDEXでZHを購入して配当を得られます。',
  'htp.rule.zh.5': '猫チームはZH 0%、長期配当権を放棄して最高JPとプレイヤー配当を選択。他の3チームはZHを獲得。',
  'htp.rule.funds': '資金配分（購入ごと）',
  'htp.rule.funds.th1': '分配先',
  'htp.rule.funds.th2': '割合',
  'htp.rule.funds.th3': '説明',
  'htp.rule.funds.row1col1': 'プレイヤー配当プール',
  'htp.rule.funds.row1col3': '保有チケット数に応じて全プレイヤーに分配',
  'htp.rule.funds.row2col1': 'ジャックポット',
  'htp.rule.funds.row2col3': 'ラウンド終了時に最後の購入者に付与',
  'htp.rule.funds.row3col1': 'ZHトークンプール',
  'htp.rule.funds.row3col3': '購入者にZHをミント、保有者はSUI配当を獲得',
  'htp.rule.funds.row4col1': '紹介報酬',
  'htp.rule.funds.row4col3': '紹介者に付与；不在の場合は配当プールへ',
  'htp.rule.funds.row5col1': 'コミュニティ基金',
  'htp.rule.funds.row5col3': 'プロジェクト維持',
  'htp.rule.funds.row6col1': 'エアドロッププール',
  'htp.rule.funds.row6col3': '購入者へのランダムエアドロップ',
  'htp.rule.funds.teamDecides': 'チーム次第',
  'htp.rule.dividends': '配当システム',
  'htp.rule.dividends.1': '購入ごとに、配当分が配当プールに蓄積されます。',
  'htp.rule.dividends.2': 'システムはdividend_per_ticketアキュムレータ変数を管理します。',
  'htp.rule.dividends.3': '保留中の配当 = (現在のdividend_per_ticket - あなたのチェックポイント) × あなたのチケット数。',
  'htp.rule.dividends.4': '配当はいつでも請求可能で、ガス代以外の追加費用はかかりません。',
  'htp.rule.dividends.5': 'ラウンド終了時に未請求の配当は失われず、ラウンドをまたいで引き継がれます。',
  'htp.rule.jackpot': 'JP分配（ラウンド終了時）',
  'htp.rule.jackpot.th1': '分配先',
  'htp.rule.jackpot.th2': '割合',
  'htp.rule.jackpot.th3': '説明',
  'htp.rule.jackpot.row1col1': '最後の購入者',
  'htp.rule.jackpot.row1col3': 'ラウンド勝者',
  'htp.rule.jackpot.row2col1': 'プレイヤー配当',
  'htp.rule.jackpot.row2col3': 'チケット数に応じて全プレイヤーに分配',
  'htp.rule.jackpot.row3col1': '次のラウンドへ',
  'htp.rule.jackpot.row3col3': '新ラウンドのシード資金',
  'htp.rule.jackpot.row4col1': 'コミュニティ + エアドロップ',
  'htp.rule.jackpot.row4col3': 'プロジェクト維持 + エアドロッププール',
  'htp.rule.airdrop': 'エアドロップシステム',
  'htp.rule.airdrop.1': '1回の購入が0.1 SUI以上の場合、ランダムエアドロップの可能性があります。',
  'htp.rule.airdrop.2': 'エアドロップ額はエアドロッププールから支払われ、Suiのオンチェーン乱数で決定されます。',
  'htp.rule.airdrop.3': '購入額が大きいほど、エアドロップの確率が上がります。',
  'htp.rule.referral': '紹介システム',
  'htp.rule.referral.1': '購入時に紹介者アドレスを入力すると、紹介者はその購入の10%を獲得します。',
  'htp.rule.referral.2': '空白の場合、10%は自動的に配当プールに入り、全員が恩恵を受けます。',
  'htp.rule.referral.3': '自分の紹介リンクを友達と共有できます。',
  'htp.rule.security': 'セキュリティについて',
  'htp.rule.security.1': 'コントラクトはSuiブロックチェーンにデプロイされ、改ざん不可能です。',
  'htp.rule.security.2': '乱数はSuiバリデータによって集団生成され、予測や操作は不可能です。',
  'htp.rule.security.3': 'Suiの並列実行モデルはブロックスタッフィング攻撃に自然に耐性があります。',
  'htp.rule.security.4': 'コントラクトコードはオープンソースで検証可能。バックドアなし。',
  'htp.rule.flow': '資金の流れ',
  'htp.rule.flow.desc': '各購入はチーム別の比率で分配、配当、JP、ZHに分割 + 固定10%紹介、2%コミュニティ、1%エアドロップ。',
  'htp.rule.flow.divLabel': 'チーム%',
  'htp.rule.flow.divDesc': '配当',
  'htp.rule.flow.jpLabel': 'チーム%',
  'htp.rule.flow.jpDesc': 'ジャックポット',
  'htp.rule.flow.zhLabel': 'チーム%',
  'htp.rule.flow.zhDesc': 'ZHトークン',
  'htp.rule.flow.refDesc': '紹介',
  'htp.rule.flow.comDesc': 'コミュニティ',
  'htp.rule.flow.adDesc': 'エアドロ',
  'htp.rule.strategy': '戦略ガイド',
  'htp.rule.strategy.1': 'Doge（56% 配当、10% ZH）：安定収入とZH配当の二重収益、長期保有に最適。',
  'htp.rule.strategy.2': 'モンキー（30% 配当、51% JP、6% ZH）：最後の購入者を狙う攻撃型。最高JP確率。',
  'htp.rule.strategy.3': '猫（43% 配当、44% JP、0% ZH）：JP/配当のみの純粋プレイ。ZHなし。',
  'htp.rule.strategy.4': 'ZH保有者は全購入からパッシブSUI収入を得られます。DEXでZHを購入すればチケット不要で配当獲得可能。',
  'htp.rule.faq': 'よくある質問',
  'htp.rule.faq.q1': 'チケット購入後にチームを変更できますか？',
  'htp.rule.faq.a1': 'いいえ — 各ウォレットはラウンド中1つのチームに固定されます。新しいラウンド開始時にチケットは保持されます。',
  'htp.rule.faq.q2': 'ラウンド終了時に未請求の配当は消えますか？',
  'htp.rule.faq.a2': 'いいえ。配当チェックポイントはラウンドをまたいで引き継がれ、未請求の配当が失われることはありません。',
  'htp.rule.faq.q3': 'ラウンドで誰もチケットを購入しなかった場合は？',
  'htp.rule.faq.a3': 'タイマーが切れてチケット販売がゼロの場合、ジャックポットは次のラウンドに繰り越されます。',
  'htp.rule.faq.q4': 'チケットを買わずにZHを購入できますか？',
  'htp.rule.faq.a4': 'はい！ZHは標準Sui Coinです。DEX流動性プールが作成された後、Cetus/AftermathでZHを直接購入し、すぐに配当を得られます。',
  'admin.show': '管理',
  'admin.hide': '管理を閉じる',
  'admin.title': '管理者パネル',
  'admin.communityFund': 'コミュニティ基金：{amount} SUI',
  'admin.withdrawLabel': 'コミュニティ基金を引き出す (SUI)',
  'admin.withdraw': '引き出し',
  'admin.withdrawSuccess': 'コミュニティ基金から {amount} SUIを引き出しました！',
  'admin.withdrawFailed': '引き出し失敗：{msg}',
  'admin.seedLabel': 'ジャックポットにシード (SUI) — チケット未販売時のみ',
  'admin.seed': 'シード',
  'admin.seedSuccess': 'ジャックポットに {amount} SUIをシードしました！',
  'admin.seedFailed': 'シード失敗：{msg}',
  'admin.pending': '処理中...',
  'admin.pause': 'ゲームを停止',
  'admin.unpause': 'ゲームを再開',
  'admin.paused': 'ゲームが停止されました。チケット購入はできません。',
  'admin.unpaused': 'ゲームが再開されました。通常の操作が復元されました。',
  'admin.pausedWarning': 'ゲームは停止中 — 新規購入はブロックされています。',
  'admin.actionFailed': '操作失敗：{msg}',
  'app.loading': '読み込み中...',
  'app.error': 'ゲームデータを読み込めません',
  'app.footer': 'オンチェーンゲーム · Built on Sui',
  'sound.mute': 'ミュート',
  'sound.enable': 'サウンドオン',
  'feed.title': '最近のアクティビティ',
  'feed.empty': 'まだアクティビティがありません。最初のプレイヤーになりましょう！',
  'feed.ticket': '{buyer} が {tickets} 枚購入 {emoji} {team} — {amount} SUI',
  'feed.airdrop': '{player} がエアドロップ {amount} SUI を獲得',
  'feed.dividend': '{player} が {amount} SUI の配当を請求',
  'feed.roundEnd': '第 {round} ラウンド終了 — {winner} {emoji} {team} が {amount} SUI を獲得',
  'feed.zhClaim': '{player} が {amount} SUI のZH配当を請求しました',
};

const ko: Translations = {
  'app.title': 'ZeroHour',
  'game.round': '{round} 라운드',
  'game.jackpot': '현재 잭팟',
  'game.ticketsSold': '판매된 티켓',
  'game.totalVolume': '총 거래량',
  'game.leader': '리더',
  'game.none': '없음',
  'game.tagline': '마지막 구매자가 잭팟 획득 — 티켓당 30초 추가',
  'game.totalPlayers': '팀 참가',
  'countdown.ended': '라운드 종료',
  'team.divPct': '배당 {pct}%',
  'team.jackpotPct': '잭팟 {pct}%',
  'team.tickets': '{n} 티켓',
  'team.players': '{n}명',
  'team.doge.name': 'Doge',
  'team.doge.desc': 'Doge 정신, 충성 배당',
  'team.pepe.name': 'Pepe',
  'team.pepe.desc': '슬픈 개구리, 균형 성장',
  'team.monkey.name': '몽키',
  'team.monkey.desc': '무모한 돌격, 큰 상금',
  'team.cat.name': '고양이',
  'team.cat.desc': '느긋한 승리, 젠 플레이어',
  'buy.chooseTeam': '팀 선택',
  'buy.ticketCount': '티켓 수량',
  'buy.reset': '초기화',
  'buy.estimatedCost': '예상 비용',
  'buy.avgPrice': '평균 {price} SUI/장',
  'buy.teamHint': '{emoji} {name}: 배당 {div}% · 잭팟 {jackpot}% · ZH {zh}% · 티켓당 +30초',
  'buy.connectWallet': '지갑 연결하여 구매',
  'buy.confirming': '확인 중...',
  'buy.button': '{n}장 구매 — {cost} SUI',
  'buy.confirmWallet': '지갑에서 거래를 확인하세요...',
  'buy.success': '구매 성공! {n}장의 티켓을 받았습니다',
  'buy.txFailed': '거래 실패: {msg}',
  'buy.error': '오류: {msg}',
  'buy.loadingPlayer': '플레이어 데이터 로딩 중...',
  'div.yourDividends': '내 배당금',
  'div.connectWallet': '지갑을 연결하여 배당금 확인',
  'div.noTickets': '아직 티켓이 없습니다. 구매하여 시작하세요!',
  'div.holding': '{n}장 보유 · {emoji} {name}',
  'div.address': '주소 {addr}',
  'div.claiming': '수령 중...',
  'div.claim': '배당금 수령',
  'div.claimSuccess': '{amount} SUI 배당금을 수령했습니다!',
  'div.claimFailed': '수령 실패: {msg}',
  'div.zhBalance': 'ZH 잔액: {amount} ZH',
  'div.zhClaim': 'ZH 배당금 수령',
  'div.zhClaiming': 'ZH 수령 중...',
  'div.zhClaimSuccess': 'ZH 배당금에서 {amount} SUI를 수령했습니다!',
  'div.zhClaimFailed': 'ZH 수령 실패: {msg}',
  'div.zhBadge': 'ZH',
  'div.noDividends': '배당금 없음',
  'div.alreadyClaimed': '티켓 구매 시 배당금이 이미 자동 수령되었습니다',
  'div.zhAlreadyClaimed': '티켓 구매 시 ZH 배당금이 이미 자동 수령되었습니다',
  'roundEnded.title': '라운드 종료 — 잭팟 지급 시간!',
  'roundEnded.jackpotLabel': '잭팟: {amount} SUI',
  'roundEnded.noTickets': '이번 라운드는 티켓이 판매되지 않았습니다. 새로 시작합니다!',
  'roundEnded.claimButton': '라운드 종료 & 잭팟 분배',
  'roundEnded.pending': '처리 중...',
  'roundEnded.hint': '승자는 {emoji} {team} — 마지막 구매자가 모든 것을 가져갑니다!',
  'roundEnded.claimSuccess': '라운드 종료! 잭팟 {amount} SUI가 분배되었습니다. 당신이 승자입니다!',
  'roundEnded.claimFailed': '라운드 종료 실패: {msg}',
  'lb.title': '팀 랭킹',
  'lb.empty': '아직 플레이어가 없습니다. 첫 번째가 되세요!',
  'lb.colRank': '#',
  'lb.colTeam': '팀',
  'lb.colTickets': '티켓',
  'lb.colShare': '점유율',
  'lb.colPlayers': '플레이어',
  'lb.colVolume': '거래량',
  'airdrop.pool': '에어드롭 풀 {amount} SUI',
  'airdrop.stats': '당첨률 {pct}% · 지급 {paid} SUI · {wins}회',
  'airdrop.hint': '0.1 SUI 이상 구매 시 에어드롭 기회',
  'ref.label': '추천인 주소 (선택)',
  'ref.yourLink': '내 추천 링크: ',
  'ref.copy': '복사',
  'ref.note': '추천인은 구매 금액의 10%를 받습니다. 비워두면 10%가 배당 풀로 들어갑니다.',
  'htp.step1.title': '팀 선택',
  'htp.step1.desc': '4개의 밈 팀 중 하나를 선택하세요. 팀마다 배당/잭팟 비율이 다릅니다',
  'htp.step1.tag1': 'Doge 높은 배당',
  'htp.step1.tag2': 'Pepe 균형',
  'htp.step1.tag3': '몽키 잭팟',
  'htp.step1.tag4': '고양이 느긋',
  'htp.step2.title': '티켓 구매',
  'htp.step2.desc': 'SUI로 티켓을 구매하세요. 티켓당 카운트다운이 30초 연장됩니다. 총 티켓 수에 따라 가격 상승',
  'htp.step2.note': '시작가 0.01 SUI · 티켓당 +0.0001 SUI',
  'htp.step3.title': '수익 획득',
  'htp.step3.desc': '티켓을 보유하여 지속적으로 배당금을 받으세요. 타이머가 0이 되면 마지막 구매자가 잭팟을 획득합니다!',
  'htp.step3.note': '언제든지 배당금 수령 가능 · 대기 불필요',
  'htp.showDetails': '상세 규칙 보기',
  'htp.hideDetails': '상세 규칙 닫기',
  'htp.rule.mechanics': '핵심 메커니즘',
  'htp.rule.mechanics.1': '이것은 Sui 블록체인 기반 카운트다운 게임입니다. 각 라운드는 24시간 카운트다운.',
  'htp.rule.mechanics.2': '누군가 티켓을 구매하면 카운트다운이 30초 연장됩니다 (최대 24시간).',
  'htp.rule.mechanics.3': '카운트다운이 0이 되면 마지막 티켓 구매자가 해당 라운드의 잭팟을 획득합니다.',
  'htp.rule.mechanics.4': '새 라운드가 자동 시작됩니다. 이전 라운드 잭팟의 10%가 시드 자금으로 이월됩니다.',
  'htp.rule.pricing': '티켓 가격',
  'htp.rule.pricing.1': '티켓 가격은 선형 본딩 커브를 따릅니다.',
  'htp.rule.pricing.2': 'N번째 티켓 가격 = 0.01 + N × 0.0001 SUI.',
  'htp.rule.pricing.3': '대량 구매는 등차수열 합계로 계산됩니다.',
  'htp.rule.teams': '팀 선택',
  'htp.rule.teams.th1': '팀',
  'htp.rule.teams.th2': '플레이어 배당',
  'htp.rule.teams.th3': '잭팟',
  'htp.rule.teams.th4': 'ZH%',
  'htp.rule.teams.th5': '스타일',
  'htp.rule.teams.row1col4': '안정적 수입, 높은 배당',
  'htp.rule.teams.row2col4': '균형 발전',
  'htp.rule.teams.row3col4': '공격적 잭팟 추구',
  'htp.rule.teams.row4col4': '느긋한 승리',
  'htp.rule.teams.row1col5': '최고 ZH 보상, 장기 SUI 수익',
  'htp.rule.teams.row2col5': '안정적 ZH 수익, 균형 플레이',
  'htp.rule.teams.row3col5': '중간 ZH, 최고 잭팟 기회',
  'htp.rule.teams.row4col5': 'ZH 없음 — 잭팟/배당 중심',
  'htp.rule.zh.title': 'ZH 토큰 — 영구 배당 권리',
  'htp.rule.zh.1': 'ZH는 게임의 배당 권리 토큰입니다. ZH 보유 = 모든 티켓 구매에서 영구히 SUI 수익 획득.',
  'htp.rule.zh.2': '각 티켓 구매 시 지불 금액의 일부(팀별 0-10%)가 ZH 풀에 할당되고 구매자에게 ZH가 발행됩니다.',
  'htp.rule.zh.3': 'ZH 보유자는 누적된 SUI 배당금을 언제든지 수령할 수 있습니다. ZH당 배당금은 구매가 있을 때마다 증가합니다.',
  'htp.rule.zh.4': 'ZH는 표준 Sui Coin — 자유롭게 전송 가능하며 Cetus, Aftermath 등 DEX에서 거래할 수 있습니다. 티켓을 구매하지 않고 DEX에서 ZH를 구매하여 배당금을 받을 수 있습니다.',
  'htp.rule.zh.5': '고양이 팀은 ZH 0%, 장기 배당 권리 대신 최고 잭팟과 플레이어 배당을 선택. 다른 3개 팀은 ZH 획득.',
  'htp.rule.funds': '자금 분배 (구매당)',
  'htp.rule.funds.th1': '분배처',
  'htp.rule.funds.th2': '비율',
  'htp.rule.funds.th3': '설명',
  'htp.rule.funds.row1col1': '플레이어 배당 풀',
  'htp.rule.funds.row1col3': '보유 티켓 수에 따라 모든 플레이어에게 분배',
  'htp.rule.funds.row2col1': '잭팟',
  'htp.rule.funds.row2col3': '라운드 종료 시 마지막 구매자에게 지급',
  'htp.rule.funds.row3col1': 'ZH 토큰 풀',
  'htp.rule.funds.row3col3': '구매자에게 ZH 발행, 보유자는 SUI 배당 획득',
  'htp.rule.funds.row4col1': '추천 보상',
  'htp.rule.funds.row4col3': '추천인에게 지급; 없으면 배당 풀로',
  'htp.rule.funds.row5col1': '커뮤니티 펀드',
  'htp.rule.funds.row5col3': '프로젝트 유지보수',
  'htp.rule.funds.row6col1': '에어드롭 풀',
  'htp.rule.funds.row6col3': '구매자에게 랜덤 에어드롭',
  'htp.rule.funds.teamDecides': '팀 결정',
  'htp.rule.dividends': '배당 시스템',
  'htp.rule.dividends.1': '구매 시 배당 부분이 배당 풀에 누적됩니다.',
  'htp.rule.dividends.2': '시스템은 dividend_per_ticket 누적 변수를 관리합니다.',
  'htp.rule.dividends.3': '미수령 배당금 = (현재 dividend_per_ticket - 내 체크포인트) × 내 티켓 수.',
  'htp.rule.dividends.4': '배당금은 언제든지 수령 가능하며 가스 비용 외 추가 비용이 없습니다.',
  'htp.rule.dividends.5': '라운드 종료 시 미수령 배당금은 사라지지 않고 라운드를 넘어 이월됩니다.',
  'htp.rule.jackpot': '잭팟 분배 (라운드 종료 시)',
  'htp.rule.jackpot.th1': '분배처',
  'htp.rule.jackpot.th2': '비율',
  'htp.rule.jackpot.th3': '설명',
  'htp.rule.jackpot.row1col1': '마지막 구매자',
  'htp.rule.jackpot.row1col3': '라운드 승자',
  'htp.rule.jackpot.row2col1': '플레이어 배당',
  'htp.rule.jackpot.row2col3': '티켓 수에 따라 모든 플레이어에게 분배',
  'htp.rule.jackpot.row3col1': '다음 라운드로',
  'htp.rule.jackpot.row3col3': '새 라운드 시드 자금',
  'htp.rule.jackpot.row4col1': '커뮤니티 + 에어드롭',
  'htp.rule.jackpot.row4col3': '프로젝트 유지보수 + 에어드롭 풀',
  'htp.rule.airdrop': '에어드롭 시스템',
  'htp.rule.airdrop.1': '1회 구매가 0.1 SUI 이상이면 랜덤 에어드롭 가능성이 있습니다.',
  'htp.rule.airdrop.2': '에어드롭 금액은 에어드롭 풀에서 지급되며 Sui 온체인 랜덤으로 결정됩니다.',
  'htp.rule.airdrop.3': '구매 금액이 클수록 에어드롭 확률이 높아집니다.',
  'htp.rule.referral': '추천 시스템',
  'htp.rule.referral.1': '구매 시 추천인 주소를 입력하면 추천인이 해당 구매의 10%를 받습니다.',
  'htp.rule.referral.2': '비워두면 10%가 자동으로 배당 풀에 들어가 모두가 혜택을 받습니다.',
  'htp.rule.referral.3': '내 추천 링크를 친구들과 공유할 수 있습니다.',
  'htp.rule.security': '보안 정보',
  'htp.rule.security.1': '컨트랙트는 Sui 블록체인에 배포되어 변경 불가능합니다.',
  'htp.rule.security.2': '랜덤 숫자는 Sui 검증자들이 집단 생성하여 예측이나 조작이 불가능합니다.',
  'htp.rule.security.3': 'Sui의 병렬 실행 모델은 블록 스터핑 공격에 자연적으로 저항합니다.',
  'htp.rule.security.4': '컨트랙트 코드는 오픈소스로 검증 가능합니다. 백도어 없음.',
  'htp.rule.flow': '자금 흐름',
  'htp.rule.flow.desc': '각 구매는 팀별 비율에 따라 배당, 잭팟, ZH로 분할 + 고정 10% 추천, 2% 커뮤니티, 1% 에어드롭.',
  'htp.rule.flow.divLabel': '팀%',
  'htp.rule.flow.divDesc': '배당',
  'htp.rule.flow.jpLabel': '팀%',
  'htp.rule.flow.jpDesc': '잭팟',
  'htp.rule.flow.zhLabel': '팀%',
  'htp.rule.flow.zhDesc': 'ZH 토큰',
  'htp.rule.flow.refDesc': '추천',
  'htp.rule.flow.comDesc': '커뮤니티',
  'htp.rule.flow.adDesc': '에어드롭',
  'htp.rule.strategy': '전략 가이드',
  'htp.rule.strategy.1': 'Doge (56% 배당, 10% ZH): 안정적 배당 + ZH 이중 수익, 장기 보유에 최적.',
  'htp.rule.strategy.2': '몽키 (30% 배당, 51% 잭팟, 6% ZH): 공격적으로 마지막 구매자 노리기. 최고 잭팟 확률.',
  'htp.rule.strategy.3': '고양이 (43% 배당, 44% 잭팟, 0% ZH): 순수 잭팟/배당 플레이. ZH 없음.',
  'htp.rule.strategy.4': 'ZH 보유자는 모든 구매에서 패시브 SUI 수익 획득. DEX에서 ZH 구매 시 티켓 없이도 배당 획득 가능.',
  'htp.rule.faq': '자주 묻는 질문',
  'htp.rule.faq.q1': '티켓 구매 후 팀을 변경할 수 있나요?',
  'htp.rule.faq.a1': '아니요 — 각 지갑은 라운드 동안 하나의 팀에 고정됩니다. 신중히 선택하세요. 새 라운드 시작 시 티켓은 유지됩니다.',
  'htp.rule.faq.q2': '라운드 종료 시 미수령 배당금이 사라지나요?',
  'htp.rule.faq.a2': '아니요. 배당 체크포인트는 라운드를 넘어 이어집니다. 미수령 배당금은 절대 사라지지 않습니다.',
  'htp.rule.faq.q3': '한 라운드 동안 아무도 티켓을 구매하지 않으면 어떻게 되나요?',
  'htp.rule.faq.a3': '타이머가 만료되고 티켓 판매가 0이면 잭팟이 다음 라운드로 이월됩니다.',
  'htp.rule.faq.q4': '티켓을 구매하지 않고 ZH를 살 수 있나요?',
  'htp.rule.faq.a4': '네! ZH는 표준 Sui Coin입니다. DEX 유동성 풀이 생성된 후 Cetus/Aftermath에서 직접 ZH를 구매하여 즉시 배당 수익을 얻을 수 있습니다.',
  'admin.show': '관리',
  'admin.hide': '관리 닫기',
  'admin.title': '관리자 패널',
  'admin.communityFund': '커뮤니티 펀드: {amount} SUI',
  'admin.withdrawLabel': '커뮤니티 펀드 인출 (SUI)',
  'admin.withdraw': '인출',
  'admin.withdrawSuccess': '커뮤니티 펀드에서 {amount} SUI를 인출했습니다!',
  'admin.withdrawFailed': '인출 실패: {msg}',
  'admin.seedLabel': '잭팟 시드 (SUI) — 티켓 미판매 시에만',
  'admin.seed': '시드',
  'admin.seedSuccess': '잭팟에 {amount} SUI를 시드했습니다!',
  'admin.seedFailed': '시드 실패: {msg}',
  'admin.pending': '처리 중...',
  'admin.pause': '게임 일시 정지',
  'admin.unpause': '게임 재개',
  'admin.paused': '게임이 일시 정지되었습니다. 플레이어는 티켓을 구매할 수 없습니다.',
  'admin.unpaused': '게임이 재개되었습니다. 정상 작동이 복원되었습니다.',
  'admin.pausedWarning': '게임이 일시 정지됨 — 새로운 구매가 차단되었습니다.',
  'admin.actionFailed': '작업 실패: {msg}',
  'app.loading': '로딩 중...',
  'app.error': '게임 데이터를 불러올 수 없습니다',
  'app.footer': '온체인 게임 · Built on Sui',
  'sound.mute': '음소거',
  'sound.enable': '소리 켜기',
  'feed.title': '최근 활동',
  'feed.empty': '아직 활동이 없습니다. 첫 번째 플레이어가 되세요!',
  'feed.ticket': '{buyer} 님이 티켓 {tickets}장 구매 {emoji} {team} — {amount} SUI',
  'feed.airdrop': '{player} 님이 에어드롭 {amount} SUI 획득',
  'feed.dividend': '{player} 님이 배당금 {amount} SUI 수령',
  'feed.roundEnd': '{round} 라운드 종료 — {winner} {emoji} {team} 님이 {amount} SUI 획득',
  'feed.zhClaim': '{player} 님이 {amount} SUI ZH 배당금을 수령했습니다',
};

export const translations: Record<Lang, Translations> = { en, 'zh-CN': zhCN, ja, ko };

export const LANG_LABELS: Record<Lang, string> = {
  en: 'English',
  'zh-CN': '简体中文',
  ja: '日本語',
  ko: '한국어',
};
