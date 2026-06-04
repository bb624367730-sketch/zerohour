import crypto from "node:crypto";
import https from "node:https";
import { HttpsProxyAgent } from "https-proxy-agent";
import { config } from "./config.js";

const CREATE_TWEET_URL =
  "https://x.com/i/api/graphql/IID9x6WsdMnTlXnzXGq8ng/CreateTweet";

const BEARER =
  "AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA";

function randomUuid(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

interface HttpRes {
  status: number;
  headers: Record<string, string>;
  json(): Promise<any>;
}

function httpReq(
  url: string,
  method: string,
  headers: Record<string, string>,
  body?: string,
): Promise<HttpRes> {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const agent = config.proxyUrl
      ? new HttpsProxyAgent(config.proxyUrl)
      : undefined;

    const req = https.request(
      {
        hostname: u.hostname,
        port: 443,
        path: u.pathname + u.search,
        method,
        headers: {
          ...headers,
          "Accept-Encoding": "identity",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
          "Accept-Language": "en-US,en;q=0.9",
          Accept: "*/*",
          "sec-ch-ua":
            '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Windows"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "x-client-uuid": randomUuid(),
          "x-twitter-active-user": "yes",
          "x-twitter-client-language": "en",
          "x-twitter-auth-type": "OAuth2Session",
        },
        agent,
      },
      (res) => {
        const resHeaders: Record<string, string> = {};
        for (const [k, v] of Object.entries(res.headers)) {
          if (v) resHeaders[k] = typeof v === "string" ? v : v[0];
        }
        let data = "";
        res.on("data", (chunk: string) => (data += chunk));
        res.on("end", () =>
          resolve({
            status: res.statusCode ?? 500,
            headers: resHeaders,
            json: async () => {
              if (!data) return {};
              try { return JSON.parse(data); }
              catch { return {}; }
            },
          }),
        );
      },
    );

    req.on("error", reject);
    req.setTimeout(30000, () => {
      req.destroy();
      reject(new Error("Request timeout"));
    });

    if (body) req.write(body);
    req.end();
  });
}

// ─── OAuth 1.0a (official API v2) ───────────────────────────

const TWITTER_API_V2 = "https://api.twitter.com/2/tweets";

function percentEncode(s: string): string {
  return encodeURIComponent(s)
    .replace(/!/g, "%21")
    .replace(/'/g, "%27")
    .replace(/\(/g, "%28")
    .replace(/\)/g, "%29")
    .replace(/\*/g, "%2A");
}

function oauthNonce(): string {
  return crypto.randomBytes(16).toString("base64url");
}

function buildOAuthHeader(
  method: string,
  url: string,
  params: Record<string, string>,
  consumerKey: string,
  consumerSecret: string,
  accessToken: string,
  accessTokenSecret: string,
): string {
  const oauthParams: Record<string, string> = {
    oauth_consumer_key: consumerKey,
    oauth_nonce: oauthNonce(),
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: String(Math.floor(Date.now() / 1000)),
    oauth_token: accessToken,
    oauth_version: "1.0",
  };

  const allParams = { ...params, ...oauthParams };
  const paramStr = Object.keys(allParams)
    .sort()
    .map((k) => `${percentEncode(k)}=${percentEncode(allParams[k])}`)
    .join("&");

  const baseStr = [
    method.toUpperCase(),
    percentEncode(url),
    percentEncode(paramStr),
  ].join("&");

  const signingKey = `${percentEncode(consumerSecret)}&${percentEncode(accessTokenSecret)}`;
  const signature = crypto
    .createHmac("sha1", signingKey)
    .update(baseStr)
    .digest("base64");

  oauthParams.oauth_signature = signature;

  return (
    "OAuth " +
    Object.entries(oauthParams)
      .map(([k, v]) => `${percentEncode(k)}="${percentEncode(v)}"`)
      .join(", ")
  );
}

async function postTweetOAuth(text: string): Promise<string | null> {
  const { apiKey, apiKeySecret, accessToken, accessTokenSecret } =
    config.twitter;

  if (!apiKey || !apiKeySecret || !accessToken || !accessTokenSecret) {
    return null; // Caller falls back to cookie
  }

  const body = JSON.stringify({ text });
  const authHeader = buildOAuthHeader(
    "POST",
    TWITTER_API_V2,
    {},
    apiKey,
    apiKeySecret,
    accessToken,
    accessTokenSecret,
  );

  const res = await httpReq(TWITTER_API_V2, "POST", {
    "Content-Type": "application/json",
    Authorization: authHeader,
  }, body);

  const result = await res.json();

  if (result.errors) {
    console.error("OAuth API error:", JSON.stringify(result.errors));
    return null;
  }

  const tweetId = result.data?.id;
  if (tweetId) {
    console.log(`Tweet posted (OAuth): https://x.com/i/status/${tweetId}`);
    return tweetId;
  }

  console.error("Unexpected OAuth response:", JSON.stringify(result).slice(0, 300));
  return null;
}

// ─── post tweet (cookie-based) ──────────────────────────────
export async function postTweet(text: string): Promise<string | null> {
  if (config.dryRun) {
    console.log(
      `\n🐦 [DRY RUN] Would tweet:\n${"-".repeat(40)}\n${text}\n${"-".repeat(40)}\n`,
    );
    return "dry-run";
  }

  // Random delay to avoid automation detection (2-6s)
  const jitter = 2000 + Math.random() * 4000;
  await new Promise((r) => setTimeout(r, jitter));

  // Try OAuth first (official API v2) if keys are configured
  if (config.twitter.apiKey && config.twitter.accessToken) {
    const oauthResult = await postTweetOAuth(text);
    if (oauthResult) return oauthResult;
    console.warn("OAuth failed, falling back to cookie-based auth...");
  }

  const authToken = config.twitter.authToken;
  const ct0 = config.twitter.ct0;

  if (!authToken || !ct0) {
    console.error("No auth configured. Set OAuth keys or auth_token/ct0.");
    return null;
  }

  const cookieStr = `auth_token=${authToken}; ct0=${ct0}`;

  const payload = {
    variables: {
      tweet_text: text,
      dark_request: false,
      media: { media_entities: [], possibly_sensitive: false },
      semantic_annotation_ids: [],
      reply: { in_reply_to_tweet_id: "0", exclude_reply_user_ids: [] },
    },
    features: {
      responsive_web_graphql_timeline_navigation_enabled: true,
      longform_notetweets_consumption_enabled: true,
      tweetypie_unmention_optimization_enabled: true,
      responsive_web_edit_tweet_api_enabled: true,
      graphql_note_tweet_edit_mode_enabled: true,
    },
    queryId: "IID9x6WsdMnTlXnzXGq8ng",
  };

  const res = await httpReq(CREATE_TWEET_URL, "POST", {
    "Content-Type": "application/json",
    Authorization: `Bearer ${BEARER}`,
    "x-csrf-token": ct0,
    Cookie: cookieStr,
    Origin: "https://x.com",
    Referer: "https://x.com/home",
  }, JSON.stringify(payload));

  const result = await res.json();

  if (result.errors) {
    const code = result.errors[0]?.code;
    const msg = result.errors[0]?.message || "";
    if (code === 32 || code === 135) {
      console.error("Auth expired. Run: node refresh-cookie.cjs");
    } else if (code === 226) {
      console.error("Automation detected (226). Will retry later.");
    } else if (code === 344) {
      console.error("Daily limit reached (344).");
    } else {
      console.error(`Tweet API error (${code}):`, msg);
    }
    return null;
  }

  const tweetId =
    result.data?.create_tweet?.tweet_results?.result?.rest_id;
  if (tweetId) {
    console.log(`Tweet posted: https://x.com/i/status/${tweetId}`);
    return tweetId;
  }

  console.error("Unexpected response:", JSON.stringify(result).slice(0, 300));
  return null;
}
