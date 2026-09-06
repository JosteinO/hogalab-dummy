const http = require("http");
http.createServer((req, res) => {
  res.end(`hello from hogalab-dummy env=${process.env.APP_ENV || "unknown"} host=${req.headers.host}\n`);
}).listen(3000);
