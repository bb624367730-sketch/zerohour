import { postTweet } from "./twitter.js";

const tweets = [
  // ── 1. Announcement ──
  `⏳ ZeroHour is coming to Sui

A game where time is money. The last buyer takes it all.

Built on @SuiNetwork
Powered by the clock. Driven by greed.

Something new is about to begin...`,

  // ── 2. How it works ──
  `🎮 How ZeroHour works:

• Buy tickets to join the round
• Each purchase resets the countdown timer
• When the timer hits zero, the last buyer wins the jackpot

Simple. Brutal. Addictive.

The clock is ticking.`,

  // ── 3. Teams ──
  `🐕🐸🐒🐱 Choose your side.

4 teams. 4 communities. 1 jackpot.

Doge, Pepe, Monkey, Cat — your team's volume fuels your share of dividends.

Pick wisely. Or don't. The clock doesn't care.`,

  // ── 4. Airdrops ──
  `🎰 Luck meets timing.

Every ticket purchase has a chance to trigger an airdrop. No extra cost — just pure upside for playing.

Some will get lucky. Only one will win it all.`,

  // ── 5. Dividends ──
  `💰 Earn while the clock ticks.

A portion of every ticket purchase flows back to players as dividends. The more your team plays, the more you earn.

Passive income. Active chaos.`,

  // ── 6. Launch tease ──
  `🔜 The countdown hasnʼt started yet — but it will soon.

ZeroHour is deploying on Sui testnet first. Early players get the glory.

Follow and turn on notifications. You donʼt want to be late.

#ZeroHour #Sui`,
];

async function main() {
  console.log(`Posting ${tweets.length} warm-up tweets...\n`);

  for (let i = 0; i < tweets.length; i++) {
    console.log(`[${i + 1}/${tweets.length}]`);
    const result = await postTweet(tweets[i]);
    if (result) {
      console.log(`   ✅ https://x.com/i/status/${result}`);
    } else {
      console.log(`   ❌ Failed`);
    }
    // Wait 90 seconds between tweets to avoid rate limiting
    if (i < tweets.length - 1) {
      console.log("   Waiting 90s...\n");
      await new Promise((r) => setTimeout(r, 90_000));
    }
  }

  console.log("\nDone! All warm-up tweets posted.");
}

main().catch(console.error);
