import "dotenv/config";

function required(key: string): string {
  const val = process.env[key];
  if (!val) throw new Error(`Missing required env var: ${key}`);
  return val;
}

export const config = {
  network: process.env.SUI_NETWORK || "testnet",
  packageId: required("PACKAGE_ID"),
  gameObjectId: required("GAME_OBJECT_ID"),

  twitter: {
    // Cookie-based (free) — refreshed via refresh-cookie.cjs
    authToken: process.env.TWITTER_AUTH_TOKEN || "",
    ct0: process.env.TWITTER_CT0 || "",
    // OAuth (needs paid credits for v2)
    apiKey: process.env.TWITTER_API_KEY || "",
    apiKeySecret: process.env.TWITTER_API_KEY_SECRET || "",
    accessToken: process.env.TWITTER_ACCESS_TOKEN || "",
    accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET || "",
  },

  proxyUrl: process.env.PROXY_URL || "",

  pollIntervalMs: Number(process.env.POLL_INTERVAL_MS) || 10_000,
  dryRun: process.env.DRY_RUN !== "false",

  // State files
  cursorFile: ".bot-cursor.json",
  cookieFile: ".bot-cookies.json",
} as const;

export type Config = typeof config;
