// Calls every tool on a running server: node scripts/test-client.mjs [url]
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

const url = new URL(process.argv[2] || "http://localhost:3000/mcp");
const client = new Client({ name: "test", version: "1.0.0" });
await client.connect(new StreamableHTTPClientTransport(url));
const { tools } = await client.listTools();
console.log("TOOLS:", tools.map((t) => t.name).join(", "));

const calls = [
  ["search_worksmarto", { query: "MCP" }],
  ["latest_worksmarto_posts", { limit: 2 }],
  ["ai_news_today", { limit: 3 }],
  ["spin_idea_wheel", { topic: "writing" }],
  ["plan_stack", { product: "A rephrase tool for English learners" }],
];
for (const [name, args] of calls) {
  const r = await client.callTool({ name, arguments: args });
  console.log(`\n=== ${name} ===\n${r.content[0].text.slice(0, 600)}`);
}
await client.close();
