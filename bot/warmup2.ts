import { postTweet } from "./twitter.js";

const tweets = [
  // ── 1. Game theory ──
  `🎯 The beauty of ZeroHour is the strategy.

When do you buy? Early — cheaper tickets, less risk. Late — bigger jackpot, higher stakes.

The optimal move doesn't exist. That's the point.

Every round is a live experiment in game theory.

#ZeroHour #Sui`,

  // ── 2. On-chain fairness ──
  `🔗 Why build a FOMO game on-chain?

Because trust is expensive and transparency is free.

Every ticket. Every payout. Every winner.
All verifiable. All immutable. All on @SuiNetwork.

No house edge you can't see. No black box. Just code.

#ZeroHour #Sui`,

  // ── 3. Bonding curve math ──
  `📈 The linear bonding curve is elegant in its simplicity:

P = P₀ + k × n

Each ticket pushes the price up. Each purchase raises the stakes.

Early buyers get cheaper entry. Late buyers chase a bigger pot.

Math that creates drama.

#ZeroHour #Sui`,

  // ── 4. Community & teams ──
  `⚔️ Four teams. One clock. Zero mercy.

Doge, Pepe, Monkey, Cat — your choice defines your tribe.

Your team's volume IS your dividend share. Every purchase you make lifts your whole squad.

Loyalty pays. Literally.

#ZeroHour #Sui`,

  // ── 5. Countdown psychology ──
  `⏳ There's something primal about a countdown.

Every tick is a decision: buy now, or wait one more second?

Someone will be the last buyer. Someone will take it all.

The clock doesn't negotiate.

#ZeroHour #Sui`,

  // ── 6. Luck meets timing ──
  `🎰 Two ways to win in ZeroHour:

1. Be the last one standing — timing is everything
2. Trigger an airdrop — pure luck, zero extra cost

Skill? Luck? Strategy?

All of the above. That's what makes it fun.

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
    // Wait 90 seconds between tweets
    if (i < tweets.length - 1) {
      console.log("   Waiting 90s...\n");
      await new Promise((r) => setTimeout(r, 90_000));
    }
  }

  console.log("\nDone! All warm-up tweets posted.");
}

main().catch(console.error);
