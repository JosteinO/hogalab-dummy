const http = require("http");
http.createServer((req, res) => {
  if (req.url.startsWith("/sse")) {
    res.writeHead(200, { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", "X-Accel-Buffering": "no" });
    res.write(":ok\n\n");
    let n = 0;
    const t = setInterval(() => { res.write(`data: tick ${++n} ${new Date().toISOString()}\n\n`); if (n >= 60) { clearInterval(t); res.end(); } }, 1000);
    req.on("close", () => clearInterval(t));
    return;
  }
  if (req.url.startsWith("/slow")) {
    // Simulates slow work (e.g. LLM prompt ingest). ?hb=1 sends an SSE comment every 20s while waiting.
    const hb = req.url.includes("hb=1"), wait = 150000;
    res.writeHead(200, { "Content-Type": "text/event-stream", "Cache-Control": "no-cache" });
    if (hb) res.write(":connected\n\n");
    const t = hb ? setInterval(() => res.write(":heartbeat\n\n"), 20000) : null;
    setTimeout(() => { if (t) clearInterval(t); res.write("data: result after 150s\n\n"); res.end(); }, wait);
    return;
  }
  res.end(`hello from hogalab-dummy env=${process.env.APP_ENV || "unknown"} host=${req.headers.host}\n`);
}).listen(3000);
