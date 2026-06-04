import { postTweet } from "./twitter.js";

const tweets = [
  // Team rivalry (simplified emojis)
  `⚔️ Four teams. One countdown.

Doge: "To the moon!"
Pepe: "Rare."
Monkey: "Ape together strong."
Cat: "...we're just here for the vibes."

Pick your tribe. Your volume IS your dividend.

#ZeroHour #Sui`,

  // DeFi skill tree (cleaned up)
  `🎮 The real DeFi skill tree:

Level 1: "I HODL"
Level 10: "I provide liquidity"
Level 50: "I farm airdrops"
Level 99: "I stare at a countdown for hours and time my last ticket perfectly"

We don't make the rules.

#ZeroHour #Sui`,
];

async function main() {
  console.log(`Retrying 2 failed tweets...\n`);

  for (let i = 0; i < tweets.length; i++) {
    const waitSec = 3000 + Math.floor(Math.random() * 1200);
    console.log(`[${i + 1}/2] Next in ~${Math.round(waitSec / 60)} min...`);

    if (i > 0) {
      await new Promise((r) => setTimeout(r, waitSec * 1000));
    }

    const result = await postTweet(tweets[i]);
    if (result) {
      console.log(`   ✅ https://x.com/i/status/${result}`);
    } else {
      console.log(`   ❌ Failed`);
    }
  }

  console.log("\nDone!");
}

main().catch(console.error);
