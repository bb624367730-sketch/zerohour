import { config } from "./config.js";
import {
  createSuiClient,
  subscribeToGameEvents,
  type GameEvent,
} from "./sui-client.js";
import { formatTweet } from "./formatter.js";
import { postTweet } from "./twitter.js";

async function handleEvent(event: GameEvent) {
  const tweet = formatTweet(event);
  if (tweet) {
    await postTweet(tweet);
    console.log(`  → ${event.type}`);
  }
}

async function main() {
  console.log("🤖 ZeroHour Bot starting (WebSocket mode)...");
  console.log(`   Network: ${config.network}`);
  console.log(`   Package: ${config.packageId}`);
  console.log(`   Game:    ${config.gameObjectId}`);
  console.log(`   Dry run: ${config.dryRun}\n`);

  const client = createSuiClient();

  console.log("📡 Connecting to Sui WebSocket...\n");

  const unsubscribe = await subscribeToGameEvents(client, handleEvent);

  console.log("✅ Listening for on-chain events. Ctrl+C to stop.\n");

  // Keep process alive
  process.on("SIGINT", async () => {
    console.log("\n🛑 Shutting down...");
    await unsubscribe();
    process.exit(0);
  });

  process.on("SIGTERM", async () => {
    console.log("\n🛑 Shutting down...");
    await unsubscribe();
    process.exit(0);
  });
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
