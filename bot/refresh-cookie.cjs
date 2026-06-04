// Refreshes Twitter auth_token + ct0 via Chrome CDP
// Uses a PERSISTENT Chrome profile — login once, refresh forever
// Usage: node refresh-cookie.cjs
// If Chrome profile doesn't exist, opens browser for manual login
// If profile exists, just extracts current cookies (no login needed)

var spawn = require("child_process").spawn;
var fs = require("fs");
var path = require("path");
var http = require("http");

var PORT = 9225;
var PROXY = process.env.PROXY_URL || "http://127.0.0.1:10809";
var PROFILE_DIR = path.join(__dirname, "chrome-profile");

function findChrome() {
  var candidates = [
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    (process.env.LOCALAPPDATA || "") + "\\Google\\Chrome\\Application\\chrome.exe",
  ];
  for (var i = 0; i < candidates.length; i++) {
    if (fs.existsSync(candidates[i])) return candidates[i];
  }
  return null;
}

async function main() {
  var chrome = findChrome();
  if (!chrome) {
    console.error("Chrome not found");
    process.exit(1);
  }

  var isFirstTime = !fs.existsSync(PROFILE_DIR);
  if (isFirstTime) {
    fs.mkdirSync(PROFILE_DIR, { recursive: true });
    console.log("First run — you'll need to log into x.com manually.");
    console.log("");
  } else {
    console.log("Using existing Chrome profile. No login needed if session is still valid.");
    console.log("");
  }

  var args = [
    "--remote-debugging-port=" + PORT,
    "--user-data-dir=" + PROFILE_DIR,
    "--disable-extensions",
    isFirstTime ? "https://x.com" : "https://x.com/home",
  ];
  if (PROXY) {
    args.push("--proxy-server=" + PROXY);
  }

  console.log("Starting Chrome...");
  var proc = spawn(chrome, args, { stdio: "ignore", detached: true });
  proc.unref();

  // Wait for Chrome to start
  await new Promise(function(r) { setTimeout(r, 4000); });

  // Get CDP WebSocket URL
  var cdpUrl;
  try {
    cdpUrl = await new Promise(function(resolve, reject) {
      var req = http.get("http://127.0.0.1:" + PORT + "/json/version", function(res) {
        var data = "";
        res.on("data", function(chunk) { data += chunk; });
        res.on("end", function() {
          try {
            var json = JSON.parse(data);
            resolve(json.webSocketDebuggerUrl);
          } catch (e) { reject(e); }
        });
      });
      req.on("error", reject);
      req.setTimeout(8000, function() { reject(new Error("timeout")); });
    });
  } catch (e) {
    console.error("Failed to connect to Chrome CDP. Is Chrome running?");
    process.exit(1);
  }

  if (isFirstTime) {
    console.log("Login to x.com in the Chrome window, then press Enter here...");
    await new Promise(function(r) {
      process.stdin.once("data", r);
    });
  }

  console.log("Extracting cookies...");

  var ws = new WebSocket(cdpUrl);
  var found = false;

  ws.onopen = function() {
    // Poll for cookies
    ws.send(JSON.stringify({
      id: 1,
      method: "Network.getCookies",
      params: { urls: ["https://x.com"] },
    }));

    var attempts = 0;
    var poll = setInterval(function() {
      attempts++;
      ws.send(JSON.stringify({
        id: 2,
        method: "Network.getCookies",
        params: { urls: ["https://x.com"] },
      }));
      if (attempts > 10) {
        clearInterval(poll);
        if (!found) {
          console.log("\nCould not find auth_token cookie.");
          console.log("Are you logged into x.com? Close Chrome and try again.");
        }
        ws.close();
        process.exit(found ? 0 : 1);
      }
    }, 3000);

    ws.onmessage = function(event) {
      var msg = JSON.parse(event.data);
      var cookies = ((msg.result || {}).cookies) || ((msg.params || {}).cookies) || [];
      var authToken = null;
      var ct0Val = null;
      for (var i = 0; i < cookies.length; i++) {
        if (cookies[i].name === "auth_token") authToken = cookies[i];
        if (cookies[i].name === "ct0") ct0Val = cookies[i];
      }

      if (authToken) {
        found = true;
        clearInterval(poll);

        var envPath = path.join(__dirname, ".env");
        var envContent = fs.readFileSync(envPath, "utf-8");

        envContent = envContent.replace(
          /TWITTER_AUTH_TOKEN=.*/,
          "TWITTER_AUTH_TOKEN=" + authToken.value
        );
        envContent = envContent.replace(
          /TWITTER_CT0=.*/,
          "TWITTER_CT0=" + (ct0Val ? ct0Val.value : "")
        );

        fs.writeFileSync(envPath, envContent, "utf-8");
        console.log("auth_token: " + authToken.value.slice(0, 20) + "...");
        console.log("ct0: " + (ct0Val ? ct0Val.value.slice(0, 10) + "..." : "N/A"));
        console.log("Written to .env");
        console.log("Chrome window was left open — keep it in background or close it.");

        ws.close();
        process.exit(0);
      }
    };
  };

  ws.onerror = function(err) {
    console.error("WebSocket error:", err.message || err);
    process.exit(1);
  };

  setTimeout(function() {
    if (!found) {
      console.log("\nTimeout (60s) — didn't find auth_token.");
      process.exit(1);
    }
  }, 60000);
}

main().catch(function(err) {
  console.error(err);
  process.exit(1);
});
