import { postTweet } from "./twitter.js";

const tweets = [
  // 1. Funny - FOMO therapy
  `🧘 FOMO therapy session #1:

Therapist: "What brings you here?"
Me: "I keep refreshing a countdown."
Therapist: "And how does that make you feel?"
Me: "Someone else is going to buy before it hits zero."

That'll be 0.5 SUI please.

#ZeroHour #Sui`,

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

  // 4. Countdown anxiety
  `⏱️ The 5 stages of ZeroHour:

1. Denial — "I'll buy later"
2. Anger — "Who keeps resetting the clock??"
3. Bargaining — "Just one more ticket"
4. Depression — "I should have bought earlier"
5. Acceptance — "New round, new me"

#ZeroHour #Sui`,

  // 5. Sui ecosystem
  `🌊 Sui is having a moment.

Sub-second finality. Predictable fees. Move's safety.

We chose Sui because when real money is on the line, you don't compromise on infra.

Fast chain. Fair game.

#ZeroHour #Sui #MoveLang`,

  // 6. DeFi culture
  `💀 DeFi skill tree:

Level 1: "I HODL"
Level 10: "I provide liquidity"
Level 50: "I farm airdrops"
Level 99: "I stare at a countdown for 3 hours and spend my rent money on the last ticket"

We're not financial advisors.

#ZeroHour #Sui`,

  // 7. Short & punchy
  `⏳ tick.

tock.

tick.

tock.

...someone just bought. Clock reset.

#ZeroHour #Sui`,

  // 8. Wisdom
  `🤔 Ancient proverb:

"The best time to buy was 10 minutes ago. The second best time is now. The worst time is 3 seconds after someone else becomes the last buyer."

— Sun Tzu, probably

#ZeroHour #Sui`,
];

async function main() {
  console.log(`Posting ${tweets.length} tweets (~1h apart)...\n`);

  for (let i = 0; i < tweets.length; i++) {
    // ~1 hour between tweets with jitter (50-70 min)
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
