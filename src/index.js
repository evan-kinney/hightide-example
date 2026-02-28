const express = require('express');

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const APP_VERSION = process.env.APP_VERSION || '1.0.0';

app.use(express.json());

// ---------------------------------------------------------------------------
// Health / liveness probe
// ---------------------------------------------------------------------------
app.get('/health', (req, res) => {
  res.json({ status: 'ok', version: APP_VERSION, uptime: process.uptime() });
});

// ---------------------------------------------------------------------------
// Main page — confirms the environment is running
// ---------------------------------------------------------------------------
app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>hightide example app</title>
  <style>
    body {
      font-family: system-ui, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      background: #0d1117;
      color: #c9d1d9;
    }
    h1 { color: #58a6ff; margin-bottom: 0.25rem; }
    p  { color: #8b949e; }
    code {
      background: #161b22;
      border: 1px solid #30363d;
      border-radius: 6px;
      padding: 0.15rem 0.4rem;
      font-size: 0.9rem;
    }
    .badge {
      margin-top: 1.5rem;
      background: #1f6feb33;
      border: 1px solid #1f6feb;
      border-radius: 999px;
      padding: 0.4rem 1rem;
      font-size: 0.8rem;
      color: #58a6ff;
    }
  </style>
</head>
<body>
  <h1>🌊 hightide example app</h1>
  <p>This preview environment is running correctly.</p>
  <p>Version: <code>${APP_VERSION}</code> &nbsp;|&nbsp; Port: <code>${PORT}</code></p>
  <div class="badge">✅ hightide preview environment active</div>
</body>
</html>
  `.trim());
});

// ---------------------------------------------------------------------------
// Echo endpoint — useful for verifying POST requests reach the container
// ---------------------------------------------------------------------------
app.post('/echo', (req, res) => {
  res.json({
    method: req.method,
    headers: req.headers,
    body: req.body,
    receivedAt: new Date().toISOString(),
  });
});

// ---------------------------------------------------------------------------
// Env-vars endpoint — lists non-secret environment variables
// ---------------------------------------------------------------------------
app.get('/env', (req, res) => {
  const safe = Object.fromEntries(
    Object.entries(process.env).filter(([k]) => !k.toLowerCase().includes('secret') && !k.toLowerCase().includes('password') && !k.toLowerCase().includes('token'))
  );
  res.json(safe);
});

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------
app.listen(PORT, () => {
  console.log(`hightide example app listening on http://0.0.0.0:${PORT}`);
});
