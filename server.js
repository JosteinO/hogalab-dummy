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
  res.end(`hello from hogalab-dummy env=${process.env.APP_ENV || "unknown"} host=${req.headers.host}\n`);
}).listen(3000);
