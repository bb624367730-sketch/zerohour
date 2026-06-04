import { postTweet } from "./twitter.js";

const tweets = [
  // 1. Game theory
  `🎯 The beauty of ZeroHour is the strategy.

When do you buy? Early — cheaper tickets, less risk. Late — bigger jackpot, higher stakes.

The optimal move doesn't exist. That's the point.

Every round is a live experiment in game theory.

#ZeroHour #Sui`,

  // 2. Bonding curve math
  `📈 The linear bonding curve is elegant in its simplicity:

P = P₀ + k × n

Each ticket pushes the price up. Each purchase raises the stakes.

Early buyers get cheaper entry. Late buyers chase a bigger pot.

Math that creates drama.

#ZeroHour #Sui`,

  // 3. Community & teams
  `⚔️ Four teams. One clock. Zero mercy.

Doge, Pepe, Monkey, Cat — your choice defines your tribe.

Your team's volume IS your dividend share. Every purchase you make lifts your whole squad.

Loyalty pays. Literally.

#ZeroHour #Sui`,

  // 4. Luck meets timing
  `🎰 Two ways to win in ZeroHour:

1. Be the last one standing — timing is everything
2. Trigger an airdrop — pure luck, zero extra cost

Skill? Luck? Strategy?

All of the above. That's what makes it fun.

#ZeroHour #Sui`,

  // 5. Why Sui
  `⚡ Why build on @SuiNetwork?

Sub-second finality. Predictable gas fees. Move's safety guarantees.

When real money is on the line, you want the chain to be fast, cheap, and secure.

ZeroHour demands nothing less.

#ZeroHour #Sui`,

  // 6. The social experiment
  `🧪 ZeroHour isn't just a game — it's a social experiment.

Watching strangers fight over a countdown reveals something raw about human nature.

Greed, timing, loyalty, luck. All on-chain. All transparent.

The data doesn't lie.

#ZeroHour #Sui`,
];

async function main() {
  console.log(`Posting ${tweets.length} tweets (~1h apart)...\n`);

  for (let i = 0; i < tweets.length; i++) {
    // ~1 hour between tweets with jitter (50-70 min)
    const waitSec = 3000 + Math.floor(Math.random() * 1200);
    const waitMin = Math.round(waitSec / 60);
    console.log(`[${i + 1}/${tweets.length}] Next post in ~${waitMin} min...`);

    if (i > 0) {
      await new Promise((r) => setTimeout(r, waitSec * 1000));
    }

    const result = await postTweet(tweets[i]);
    if (result) {
      console.log(`   ✅ https://x.com/i/status/${result}`);
    } else {
      console.log(`   ❌ Failed`);
    }
    console.log();
  }

  console.log("Done! All tweets posted.");
}

main().catch(console.error);
