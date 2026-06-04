import { postTweet } from "./twitter.js";

const tweets = [
  // 2. Sui tech
  `⚡ Real talk: @SuiNetwork's parallel execution means your buy transaction doesn't wait in line behind 10,000 NFT mints.

When the countdown hits 30 seconds, that matters.

Fast chain. Faster decisions.

#ZeroHour #Sui`,

  // 3. Team rivalry humor
  `🐕 Doge holders: "To the moon!"
🐸 Pepe holders: "Rare."
🐒 Monkey holders: "Ape together strong."
🐱 Cat holders: "...we're just here to watch."

All four fighting over the same countdown. Beautiful.

#ZeroHour #Sui`,

  // 6. DeFi culture
  `💀 DeFi skill tree:

Level 1: "I HODL"
Level 10: "I provide liquidity"
Level 50: "I farm airdrops"
Level 99: "I stare at a countdown for 3 hours and spend my rent money on the last ticket"

We're not financial advisors.

#ZeroHour #Sui`,
];

async function main() {
  console.log(`Retrying ${tweets.length} failed tweets (~1h apart)...\n`);

  for (let i = 0; i < tweets.length; i++) {
    const waitSec = 3000 + Math.floor(Math.random() * 1200);
    const waitMin = Math.round(waitSec / 60);
    console.log(`[${i + 1}/${tweets.length}] Next in ~${waitMin} min...`);

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

  console.log("Done!");
}

main().catch(console.error);
