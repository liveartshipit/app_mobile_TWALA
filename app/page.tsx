const tools = [
  ["search_worksmarto", "Search Worksmarto articles on AI tools, workflows and MCP"],
  ["latest_worksmarto_posts", "Newest posts from the blog"],
  ["ai_news_today", "Today's AI headlines from Worksmarto AI News"],
  ["spin_idea_wheel", "One AI freelancing idea with tools + workflow"],
  ["validate_idea", "AI Idea Validator - honest breakdown of your idea"],
  ["plan_stack", "Architect - lean, mostly free stack + build plan"],
];

const box: React.CSSProperties = { background: "#fff", border: "2px solid #f5b301", borderRadius: 14, padding: "18px 20px", margin: "18px 0" };
const code: React.CSSProperties = { display: "block", background: "#1f1a10", color: "#ffd75e", padding: "12px 14px", borderRadius: 10, overflowX: "auto", fontSize: 14 };

export default function Home() {
  return (
    <main style={{ maxWidth: 760, margin: "0 auto", padding: "40px 16px 60px" }}>
      <p style={{ color: "#e8590c", fontWeight: 700, letterSpacing: 1, margin: 0 }}>WORKSMARTO MCP</p>
      <h1 style={{ fontSize: 36, margin: "8px 0 12px" }}>Worksmarto inside your AI assistant</h1>
      <p style={{ fontSize: 18, lineHeight: 1.5 }}>
        Add one URL to Claude, ChatGPT, Cursor or any MCP-ready app and use Worksmarto&apos;s free AI tools right in your chat.
      </p>

      <div style={box}>
        <strong>Server URL</strong>
        <code style={{ ...code, marginTop: 8 }}>https://mcp.worksmarto.com/mcp</code>
      </div>

      <div style={box}>
        <strong>Claude</strong>
        <p>Settings → Connectors → Add custom connector → paste the URL above.</p>
        <strong>Cursor / VS Code / Claude Desktop (JSON)</strong>
        <code style={{ ...code, marginTop: 8, whiteSpace: "pre" }}>{`{
  "mcpServers": {
    "worksmarto": { "url": "https://mcp.worksmarto.com/mcp" }
  }
}`}</code>
      </div>

      <h2>Tools</h2>
      {tools.map(([n, d]) => (
        <div key={n} style={{ borderLeft: "4px solid #e8590c", padding: "6px 12px", margin: "10px 0", background: "#fff" }}>
          <strong>{n}</strong>
          <div>{d}</div>
        </div>
      ))}

      <p style={{ marginTop: 30, fontSize: 14, color: "#6b5d3a" }}>
        Free to use. AI tools are rate-limited. Nothing you send is stored. Built by{" "}
        <a href="https://worksmarto.com/?utm_source=mcp-site" style={{ color: "#e8590c" }}>Worksmarto</a> · Software Innovation Labs.
      </p>
    </main>
  );
}
