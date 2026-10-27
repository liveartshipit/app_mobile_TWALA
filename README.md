# Worksmarto MCP

Public [Model Context Protocol](https://modelcontextprotocol.io) server for [worksmarto.com](https://worksmarto.com).
Add one URL to Claude, ChatGPT, Cursor or any MCP-ready app and use Worksmarto's tools right inside the chat.

**Server URL:** `https://mcp.worksmarto.com/mcp`

## Tools

| Tool | What it does | Data |
|---|---|---|
| `search_worksmarto` | Search Worksmarto articles (best match first) | WordPress REST API |
| `latest_worksmarto_posts` | Newest posts | WordPress REST API |
| `ai_news_today` | Headlines from news.worksmarto.com | news site |

**No API keys, no AI calls.** The server returns curated data; the user's own assistant (Claude, ChatGPT, Gemini) writes the final answer. Cost: ₹0.

Every link carries `utm_source=mcp&utm_medium=ai-assistant`, so MCP traffic shows up separately in analytics.

## Stack

Next.js 15 · `mcp-handler` (Streamable HTTP) · Zod · Vercel Hobby.

## Deploy (Vercel)

1. Import this repo in Vercel → Framework: Next.js.
2. No environment variables needed. Optional: `WP_SITE_URL`, `NEWS_SITE_URL`, `NEWS_FEED_URL`.
3. Deploy. The MCP endpoint is `https://<project>.vercel.app/mcp`.
4. Custom domain: Vercel → Settings → Domains → add `mcp.worksmarto.com`, then in Hostinger DNS add
   `CNAME  mcp  →  cname.vercel-dns.com`.

## Connect

**Claude:** claude.ai/customize/connectors → + Add → Add custom connector → paste the server URL → Authentication: No sign in.

**ChatGPT (paid plans):** Settings → Apps → enable Developer mode → Create → paste the server URL.

**Cursor / VS Code / Claude Desktop:**

```json
{ "mcpServers": { "worksmarto": { "url": "https://mcp.worksmarto.com/mcp" } } }
```

## Local dev

```bash
npm install
npm run dev
npm run test:tools           # calls every tool on http://localhost:3000/mcp
```

## Safety

- Read-only: only public, published posts are read. No WordPress credentials on this server.
- No secrets on the server at all, so nothing to leak and no quota to drain.
- No user input is stored.
- Content focuses on productivity; no income promises, no health, legal or financial advice.

Built by Worksmarto · Software Innovation Labs.
