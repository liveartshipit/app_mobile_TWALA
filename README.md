# Worksmarto MCP

Public [Model Context Protocol](https://modelcontextprotocol.io) server for [worksmarto.com](https://worksmarto.com).
Add one URL to Claude, ChatGPT, Cursor or any MCP-ready app and use Worksmarto's tools right inside the chat.

**Server URL:** `https://mcp.worksmarto.com/mcp`

## Tools

| Tool | What it does | AI cost |
|---|---|---|
| `search_worksmarto` | Search Worksmarto articles (WordPress REST API) | none |
| `latest_worksmarto_posts` | Newest posts | none |
| `ai_news_today` | Headlines from news.worksmarto.com | none |
| `spin_idea_wheel` | One AI freelancing idea + tools + workflow | none (static data) |
| `validate_idea` | AI Idea Validator breakdown | Groq, rate-limited |
| `plan_stack` | Architect: lean stack + build plan | Groq, rate-limited |

Every link carries `utm_source=mcp&utm_medium=ai-assistant`, so MCP traffic shows up separately in analytics.

## Stack

Next.js 15 · `mcp-handler` (Streamable HTTP) · Zod · Groq (`openai/gpt-oss-120b`) with optional OpenRouter fallback · Vercel Hobby.

## Deploy (Vercel)

1. Import this repo in Vercel → Framework: Next.js.
2. Environment variables: `GROQ_API_KEY` (required for AI tools). Optional: see `.env.example`.
3. Deploy. The MCP endpoint is `https://<project>.vercel.app/mcp`.
4. Custom domain: Vercel → Settings → Domains → add `mcp.worksmarto.com`, then in Hostinger DNS add
   `CNAME  mcp  →  cname.vercel-dns.com`.

## Connect

**Claude:** Settings → Connectors → Add custom connector → paste the server URL.

**Cursor / VS Code / Claude Desktop:**

```json
{ "mcpServers": { "worksmarto": { "url": "https://mcp.worksmarto.com/mcp" } } }
```

## Local dev

```bash
npm install
cp .env.example .env.local   # add GROQ_API_KEY
npm run dev
npm run test:tools           # calls every tool on http://localhost:3000/mcp
```

## Safety

- Read-only: only public, published posts are read. No WordPress credentials on this server.
- AI keys live in env vars only. AI tools are capped per IP per hour and globally per day (in-memory, best-effort).
- No user input is stored.
- Answers focus on productivity; no income promises, no health, legal or financial advice.

Built by Worksmarto · Software Innovation Labs.
