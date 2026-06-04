import { config } from "./config.js";
import { postTweet } from "./twitter.js";

console.log("Testing Twitter login...");
console.log(`Auth: ${config.twitter.authToken ? 'cookie-based' : config.twitter.apiKey ? 'OAuth' : 'none'}`);
console.log(`Dry run: ${config.dryRun}\n`);

const result = await postTweet(
  "🤖 ZeroHour Bot 已上线！\n\n" +
  "实时播报 Sui 链上 FOMO3D 战况：\n" +
  "🎫 买票动态\n🎰 Airdrop 中奖\n🏆 Round 赢家\n\n" +
  "欢迎关注，准备好你的 SUI！\n\n" +
  "#ZeroHour #Sui #FOMO3D"
);

if (result) {
  console.log(`\nSuccess! Tweet ID: ${result}`);
} else {
  console.log("\nFailed to post tweet.");
}
