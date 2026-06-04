// Extracts Twitter auth_token + ct0 from Chrome via CDP
// Usage: node get-cookie.cjs
// Keep Chrome open, log into x.com manually, script auto-captures cookies

var spawn = require("child_process").spawn;
var fs = require("fs");
var path = require("path");
var http = require("http");

var PORT = 9225;
var PROXY = process.env.PROXY_URL || "http://127.0.0.1:10809";

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

  var userDataDir = path.join(process.env.TEMP || "/tmp", "chrome-twitter-extract-" + Date.now());

  var args = [
    "--remote-debugging-port=" + PORT,
    "--user-data-dir=" + userDataDir,
    "about:blank",
  ];
  if (PROXY) {
    args.push("--proxy-server=" + PROXY);
  }

  console.log("Starting Chrome...");
  var proc = spawn(chrome, args, { stdio: "ignore", detached: true });
  proc.unref();

  // Wait for Chrome to start
  await new Promise(function(r) { setTimeout(r, 3000); });

  // Get CDP WebSocket URL
  var wsUrl = await new Promise(function(resolve, reject) {
    var req = http.get("http://127.0.0.1:" + PORT + "/json/version", function(res) {
      var data = "";
      res.on("data", function(chunk) { data += chunk; });
      res.on("end", function() {
        try {
          var json = JSON.parse(data);
          resolve(json.webSocketDebuggerUrl);
        } catch (e) {
          reject(e);
        }
      });
    });
    req.on("error", reject);
    req.setTimeout(5000, function() { reject(new Error("timeout")); });
  });

  console.log("Connected. Navigate to https://x.com and log in manually.");
  console.log("Waiting for auth_token cookie...\n");

  var ws = new WebSocket(wsUrl);

  ws.onopen = function() {
    // Navigate to x.com
    ws.send(JSON.stringify({
      id: 1,
      method: "Page.navigate",
      params: { url: "https://x.com" },
    }));

    // Poll for cookies every 3 seconds
    var poll = setInterval(function() {
      ws.send(JSON.stringify({
        id: 2,
        method: "Network.getCookies",
        params: { urls: ["https://x.com"] },
      }));
    }, 3000);

    ws.onmessage = function(event) {
      var msg = JSON.parse(event.data);
      if (msg.method === "Network.getCookies" || msg.id === 2) {
        var cookies = ((msg.result || {}).cookies) || ((msg.params || {}).cookies) || [];
        var authToken = null;
        var ct0 = null;
        for (var i = 0; i < cookies.length; i++) {
          if (cookies[i].name === "auth_token") authToken = cookies[i];
          if (cookies[i].name === "ct0") ct0 = cookies[i];
        }

        if (authToken) {
          clearInterval(poll);

          var envPath = path.join(__dirname, ".env");
          var envContent = fs.readFileSync(envPath, "utf-8");

          envContent = envContent.replace(
            /TWITTER_AUTH_TOKEN=.*/,
            "TWITTER_AUTH_TOKEN=" + authToken.value
          );
          envContent = envContent.replace(
            /TWITTER_CT0=.*/,
            "TWITTER_CT0=" + (ct0 ? ct0.value : "")
          );

          fs.writeFileSync(envPath, envContent, "utf-8");
          console.log("auth_token: " + authToken.value);
          console.log("ct0: " + (ct0 ? ct0.value : "N/A"));
          console.log("Written to .env");
          console.log("\nYou can close Chrome now.");

          ws.close();
          process.exit(0);
        }
      }
    };
  };

  ws.onerror = function(err) {
    console.error("WebSocket error:", err.message || err);
    process.exit(1);
  };

  // Timeout after 5 minutes
  setTimeout(function() {
    console.log("\nTimeout - didn't find auth_token. Did you log in?");
    process.exit(1);
  }, 300000);
}

main().catch(function(err) {
  console.error(err);
  process.exit(1);
});
