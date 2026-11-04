const renderLandingPage = () => {
  const currentYear = new Date().getFullYear();
  const currentTimestamp = new Date().toUTCString();
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>The Saturation Point &bull; API Gateway</title>
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Cdefs%3E%3ClinearGradient id='gold' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%23FDE047'/%3E%3Cstop offset='50%25' stop-color='%23EAB308'/%3E%3Cstop offset='100%25' stop-color='%23CA8A04'/%3E%3C/linearGradient%3E%3ClinearGradient id='darkBg' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%23292524'/%3E%3Cstop offset='100%25' stop-color='%231C1917'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='64' height='64' rx='14' fill='url(%23darkBg)'/%3E%3Cpath d='M32 9 L46 29 C46 36 43 45 40 53 L24 53 C21 45 18 36 18 29 Z' fill='url(%23gold)'/%3E%3Cline x1='32' y1='9' x2='32' y2='30' stroke='%231C1917' stroke-width='2' stroke-linecap='round'/%3E%3Ccircle cx='32' cy='31' r='2.75' fill='%231C1917'/%3E%3Cpath d='M26 40 C28 37 30 36 32 36 C34 36 36 37 38 40' fill='none' stroke='%231C1917' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Lora:ital,wght@0,400;0,500;0,600;1,400&family=Montserrat:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      background-color: #FAF9F6;
      color: #1C1917;
      font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px 20px;
      -webkit-font-smoothing: antialiased;
    }
    .shell {
      width: 100%;
      max-width: 680px;
      background: #FFFFFF;
      border: 1px solid rgba(28, 25, 23, 0.08);
      box-shadow: 0 24px 48px -12px rgba(28, 25, 23, 0.06), 0 4px 16px rgba(28, 25, 23, 0.02);
      padding: 48px 40px;
      text-align: center;
    }
    @media (max-width: 600px) {
      .shell {
        padding: 32px 20px;
      }
    }
    .brand-logo-container {
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 20px;
    }
    .brand-logo-svg {
      width: 60px;
      height: 60px;
      border-radius: 14px;
      box-shadow: 0 8px 24px rgba(28, 25, 23, 0.15);
    }
    .brand-name {
      font-family: 'Cormorant Garamond', 'Lora', serif;
      font-size: 26px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.22em;
      color: #1C1917;
      margin-bottom: 8px;
    }
    .brand-subtitle {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.16em;
      color: #78716C;
      font-weight: 500;
    }
    .gold-divider {
      height: 1px;
      width: 100%;
      background: linear-gradient(90deg, transparent, rgba(202, 138, 4, 0.45), transparent);
      margin: 26px 0;
    }
    .status-pill {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      background-color: rgba(16, 185, 129, 0.08);
      border: 1px solid rgba(16, 185, 129, 0.25);
      padding: 8px 18px;
      border-radius: 9999px;
      margin-bottom: 26px;
    }
    .status-dot {
      width: 8px;
      height: 8px;
      background-color: #10B981;
      border-radius: 50%;
      box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
      animation: pulseDot 2s infinite;
    }
    @keyframes pulseDot {
      0% {
        transform: scale(0.95);
        box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
      }
      70% {
        transform: scale(1);
        box-shadow: 0 0 0 8px rgba(16, 185, 129, 0);
      }
      100% {
        transform: scale(0.95);
        box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
      }
    }
    .status-text {
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      color: #065F46;
    }
    .telemetry-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      margin-bottom: 28px;
      text-align: left;
    }
    @media (max-width: 580px) {
      .telemetry-grid {
        grid-template-columns: 1fr;
      }
    }
    .telemetry-item {
      background: #FAF9F6;
      border: 1px solid rgba(28, 25, 23, 0.06);
      padding: 14px 16px;
    }
    .telemetry-label {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #78716C;
      font-weight: 500;
      margin-bottom: 4px;
    }
    .telemetry-val {
      font-size: 13px;
      font-weight: 600;
      color: #1C1917;
    }
    .section-title {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.18em;
      color: #78716C;
      font-weight: 600;
      text-align: left;
      margin-bottom: 12px;
    }
    .endpoints-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-bottom: 30px;
    }
    .endpoint-card {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 16px;
      background: #FFFFFF;
      border: 1px solid rgba(28, 25, 23, 0.08);
      text-decoration: none;
      transition: all 0.2s ease;
    }
    .endpoint-card:hover {
      border-color: #CA8A04;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(28, 25, 23, 0.04);
    }
    .endpoint-left {
      display: flex;
      align-items: center;
      gap: 12px;
      overflow: hidden;
    }
    .method-badge {
      background: #1C1917;
      color: #FAF9F6;
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
      font-weight: 600;
      padding: 3px 8px;
      letter-spacing: 0.05em;
      flex-shrink: 0;
    }
    .endpoint-path {
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      font-weight: 500;
      color: #1C1917;
    }
    .endpoint-desc {
      font-size: 11px;
      color: #78716C;
      margin-left: 8px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    @media (max-width: 520px) {
      .endpoint-desc {
        display: none;
      }
    }
    .endpoint-arrow {
      color: #CA8A04;
      font-size: 14px;
      font-weight: 600;
      transition: transform 0.2s ease;
    }
    .endpoint-card:hover .endpoint-arrow {
      transform: translateX(3px);
    }
    .action-group {
      display: flex;
      gap: 12px;
      justify-content: center;
      margin-bottom: 26px;
      flex-wrap: wrap;
    }
    .btn {
      display: inline-block;
      padding: 12px 24px;
      text-decoration: none;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      font-weight: 500;
      transition: all 0.2s ease;
      cursor: pointer;
      border: none;
    }
    .btn-primary {
      background: #1C1917;
      color: #FFFFFF;
    }
    .btn-primary:hover {
      background: #CA8A04;
      box-shadow: 0 6px 20px rgba(202, 138, 4, 0.25);
    }
    .btn-outline {
      background: transparent;
      color: #1C1917;
      border: 1px solid rgba(28, 25, 23, 0.2);
    }
    .btn-outline:hover {
      border-color: #1C1917;
      background: rgba(28, 25, 23, 0.03);
    }
    .meta-footer {
      font-size: 10px;
      letter-spacing: 0.08em;
      color: #A8A29E;
      text-transform: uppercase;
      line-height: 1.6;
    }
  </style>
</head>
<body>
  <div class="shell">
    <div class="brand-logo-container">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="60" height="60" class="brand-logo-svg">
        <defs>
          <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#FDE047" />
            <stop offset="50%" stop-color="#EAB308" />
            <stop offset="100%" stop-color="#CA8A04" />
          </linearGradient>
          <linearGradient id="darkBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#292524" />
            <stop offset="100%" stop-color="#1C1917" />
          </linearGradient>
        </defs>
        <rect width="64" height="64" rx="14" fill="url(#darkBg)" />
        <path d="M32 9 L46 29 C46 36 43 45 40 53 L24 53 C21 45 18 36 18 29 Z" fill="url(#gold)" />
        <line x1="32" y1="9" x2="32" y2="30" stroke="#1C1917" stroke-width="2" stroke-linecap="round" />
        <circle cx="32" cy="31" r="2.75" fill="#1C1917" />
        <path d="M26 40 C28 37 30 36 32 36 C34 36 36 37 38 40" fill="none" stroke="#1C1917" stroke-width="1.5" stroke-linecap="round" />
      </svg>
    </div>
    <h1 class="brand-name">The Saturation Point</h1>
    <div class="brand-subtitle">Haute Horlogerie &bull; REST API Gateway</div>
    <div class="gold-divider"></div>
    <div class="status-pill">
      <div class="status-dot"></div>
      <span class="status-text">All Systems Operational</span>
    </div>
    <div class="telemetry-grid">
      <div class="telemetry-item">
        <div class="telemetry-label">Engine</div>
        <div class="telemetry-val">Node.js / Express</div>
      </div>
      <div class="telemetry-item">
        <div class="telemetry-label">Database</div>
        <div class="telemetry-val">MongoDB Atlas</div>
      </div>
      <div class="telemetry-item">
        <div class="telemetry-label">Storage</div>
        <div class="telemetry-val">Cloudinary CDN</div>
      </div>
    </div>
    <div class="section-title">Public Endpoints Directory</div>
    <div class="endpoints-list">
      <a href="/api/products" class="endpoint-card">
        <div class="endpoint-left">
          <span class="method-badge">GET</span>
          <span class="endpoint-path">/api/products</span>
          <span class="endpoint-desc">Catalog &bull; Stock &bull; Reviews</span>
        </div>
        <span class="endpoint-arrow">&rarr;</span>
      </a>
      <a href="/api/categories" class="endpoint-card">
        <div class="endpoint-left">
          <span class="method-badge">GET</span>
          <span class="endpoint-path">/api/categories</span>
          <span class="endpoint-desc">Horological Taxonomies</span>
        </div>
        <span class="endpoint-arrow">&rarr;</span>
      </a>
      <a href="/api/brands" class="endpoint-card">
        <div class="endpoint-left">
          <span class="method-badge">GET</span>
          <span class="endpoint-path">/api/brands</span>
          <span class="endpoint-desc">Partner Ateliers</span>
        </div>
        <span class="endpoint-arrow">&rarr;</span>
      </a>
      <a href="/api/test" class="endpoint-card">
        <div class="endpoint-left">
          <span class="method-badge">GET</span>
          <span class="endpoint-path">/api/test</span>
          <span class="endpoint-desc">Gateway Handshake &bull; Latency Ping</span>
        </div>
        <span class="endpoint-arrow">&rarr;</span>
      </a>
    </div>
    <div class="action-group">
      <a href="${clientUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">Launch Storefront</a>
      <a href="/api/test" class="btn btn-outline">Handshake Ping</a>
    </div>
    <div class="meta-footer">
      <div>&copy; ${currentYear} The Saturation Point &bull; Encrypted &bull; Secured with Helmet &amp; CORS</div>
      <div>Telemetry: ${currentTimestamp}</div>
    </div>
  </div>
</body>
</html>`;
};

module.exports = {
  renderLandingPage,
};
