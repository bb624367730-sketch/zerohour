import { postTweet } from "./twitter.js";

// Tweet pool — randomly picks from these each day
const TWEET_POOL = [
  // ── Strategy / Game theory ──
  `🎯 The optimal ZeroHour strategy doesn't exist. That's the beauty.

Buy early: cheaper tickets, less risk.
Buy late: bigger jackpot, higher stakes.
Never buy: you can't win.

Pick your poison.

#ZeroHour #Sui`,

  `🧠 Game theory 101:

ZeroHour is a multiplayer timing game where the Nash equilibrium is... complicated.

The only dominant strategy is: someone else will blink first.

Will it be you?

#ZeroHour #Sui`,

  // ── Sui tech ──
  `⚡ @SuiNetwork's parallel transaction execution is a game changer.

Traditional chains: transactions queue up.
Sui: transactions run in parallel.

When seconds matter, this matters.

#ZeroHour #Sui`,

  `🔗 Why on-chain matters:

Every ticket purchase. Every airdrop. Every winner.
All verifiable. All immutable.

Trust code, not promises.

#ZeroHour #Sui #Web3`,

  // ── Funny / Culture ──
  `😮‍💨 My portfolio is down, but at least I can stare at a countdown and pretend I have control over something.

ZeroHour: cheaper than therapy.

#ZeroHour #Sui`,

  `📉 When the market is red but the countdown is green.

At least ONE number is going up today.

#ZeroHour #Sui`,

  `💭 "Just one more ticket" — famous last words before the countdown hits zero.

#ZeroHour #Sui`,

  `⏰ The difference between "I won the jackpot" and "I was 1 second late" is the same as the difference between genius and madness.

#ZeroHour #Sui`,

  // ── Team talk ──
  `🤝 Your team is your tribe.

Doge. Pepe. Monkey. Cat.

Pick one. Ride together. Earn together.

Or just pick the one with the best emoji. We don't judge.

#ZeroHour #Sui`,

  // ── Countdown drama ──
  `⏳ The countdown doesn't care about your feelings.

It ticks. It tocks.
Someone buys. It resets.
Someone doesn't. It ends.

Cold. Efficient. Beautiful.

#ZeroHour #Sui`,

  `🕐 60 seconds on the clock.

Do you:
A) Buy now, reset it, play it safe
B) Wait 30 more seconds, risk it all
C) Panic

There is no C. (There is always C.)

#ZeroHour #Sui`,

  // ── Community / Vibes ──
  `🌙 Late night countdown watching hits different.

The world is asleep. The clock is ticking.
One buyer. One jackpot.
Everything changes in a second.

#ZeroHour #Sui`,

  // ── Airdrop hype ──
  `🎰 Every ticket purchase = free airdrop lottery ticket.

You're already playing for the jackpot.
You're already earning dividends.
Airdrop is just the cherry on top.

Zero cost. Pure upside.

#ZeroHour #Sui`,

  // ── Short & punchy ──
  `Tick. Tock. Buy. Repeat.

#ZeroHour #Sui`,

  `🏆 Someone wins today. Might as well be you.

#ZeroHour #Sui`,

  `The clock is always ticking. Even now.

#ZeroHour #Sui`,
];

function pick(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

async function main() {
  console.log("🤖 ZeroHour Daily Scheduler started");
  console.log(`   Tweet pool: ${TWEET_POOL.length} tweets`);
  console.log("   Schedule: 3-5 tweets/day, random intervals\n");

  // Track which tweets we've used recently to avoid repeats
  const recent = new Set<string>();
  const RECENT_MAX = 8;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    // Pick 3-5 tweets for today
    const count = 3 + Math.floor(Math.random() * 3);
    const available = TWEET_POOL.filter((t) => !recent.has(t));
    const pool = available.length >= count ? available : TWEET_POOL;
    const today = shuffle(pool).slice(0, count);

    // Update recent set
    today.forEach((t) => {
      recent.add(t);
      if (recent.size > RECENT_MAX) {
        const first = recent.values().next().value;
        if (first) recent.delete(first);
      }
    });

    console.log(`\n📅 Today: ${count} tweets`);
    const now = new Date();
    console.log(`   ${now.toLocaleString()}\n`);

    // Post with random intervals (2-5 hours between tweets)
    for (let i = 0; i < today.length; i++) {
      // First tweet: wait 0-60 min, subsequent: 2-5 hours
      const delayMin = i === 0
        ? Math.floor(Math.random() * 60)
        : 120 + Math.floor(Math.random() * 180);
      const delayMs = delayMin * 60 * 1000;

      console.log(`   [${i + 1}/${today.length}] Next in ~${delayMin} min`);
      await new Promise((r) => setTimeout(r, delayMs));

      const tweet = today[i];
      const trimmed = tweet.length > 60 ? tweet.slice(0, 60) + "..." : tweet;
      console.log(`   Posting: ${trimmed}`);
      const result = await postTweet(tweet);
      if (result) {
        console.log(`   ✅ ${result}`);
      } else {
        console.log(`   ❌ Failed, will retry later`);
        // Put it back in rotation
        recent.delete(tweet);
      }
    }

    // Wait until next day (~24h from first tweet, with jitter)
    const dayMs = 20 * 60 * 60 * 1000 + Math.floor(Math.random() * 4 * 60 * 60 * 1000);
    const hours = Math.round(dayMs / 3600000);
    console.log(`\n💤 Sleeping ~${hours}h until next batch...`);
    await new Promise((r) => setTimeout(r, dayMs));
  }
}

main().catch(console.error);
