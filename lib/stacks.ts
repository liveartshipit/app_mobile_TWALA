// Worksmarto stack catalog: curated, mostly free options per layer.
// Static data, no API key. The user's own AI turns these options into a plan.
// Keep notes qualitative: free-tier limits change, so we point to the tool's pricing page.

export type Level = "beginner" | "intermediate" | "advanced";

type Option = {
  name: string;
  note: string;
  free: boolean;
  levels: Level[];
  url: string;
  worksmarto?: string; // where Worksmarto uses it
  tags?: string[]; // fits these product kinds
};

const LAYERS: Record<string, Option[]> = {
  Frontend: [
    { name: "React (Vite)", note: "Fast single-page apps; huge ecosystem.", free: true, levels: ["intermediate", "advanced"], url: "https://react.dev", worksmarto: "Architect", tags: ["saas", "ai", "dashboard"] },
    { name: "Next.js", note: "React with server routes built in; ideal on Vercel; hides API keys server-side.", free: true, levels: ["intermediate", "advanced"], url: "https://nextjs.org", worksmarto: "Worksmarto MCP", tags: ["saas", "ai", "mcp", "api"] },
    { name: "Plain HTML + Alpine.js + Tailwind CDN", note: "No build step; drop into any page or WordPress shortcode.", free: true, levels: ["beginner", "intermediate"], url: "https://alpinejs.dev", worksmarto: "Comply", tags: ["tool", "widget", "wordpress"] },
    { name: "WordPress + shortcode", note: "Content site and tool in one place; easy SEO.", free: true, levels: ["beginner"], url: "https://wordpress.org", worksmarto: "Idea Validator", tags: ["blog", "content", "wordpress", "tool"] },
  ],
  "Backend / API": [
    { name: "Next.js route handlers on Vercel", note: "Serverless functions next to the frontend; keys stay in env vars.", free: true, levels: ["intermediate", "advanced"], url: "https://vercel.com/docs/functions", worksmarto: "Worksmarto MCP", tags: ["saas", "ai", "mcp", "api"] },
    { name: "Supabase Edge Functions", note: "Serverless functions beside your database and auth.", free: true, levels: ["intermediate", "advanced"], url: "https://supabase.com/docs/guides/functions", tags: ["saas", "ai"] },
    { name: "WordPress custom plugin (PHP REST route)", note: "REST endpoint inside WordPress; proxies AI calls so keys stay hidden.", free: true, levels: ["beginner", "intermediate"], url: "https://developer.wordpress.org/rest-api/", worksmarto: "Idea Validator, Comply", tags: ["wordpress", "tool"] },
    { name: "Cloudflare Workers", note: "Edge functions with a generous free plan; great for small APIs.", free: true, levels: ["intermediate", "advanced"], url: "https://workers.cloudflare.com", tags: ["api", "tool"] },
  ],
  "Database & auth": [
    { name: "Supabase", note: "Postgres + auth + storage in one; free tier for MVPs.", free: true, levels: ["beginner", "intermediate", "advanced"], url: "https://supabase.com/pricing", worksmarto: "Architect", tags: ["saas", "ai", "dashboard"] },
    { name: "Firebase", note: "Auth + realtime DB; strong for mobile apps.", free: true, levels: ["beginner", "intermediate"], url: "https://firebase.google.com/pricing", tags: ["mobile", "app"] },
    { name: "WordPress users + WooCommerce", note: "Accounts and paid plans without building auth yourself.", free: true, levels: ["beginner"], url: "https://woocommerce.com", tags: ["wordpress", "subscription"] },
    { name: "No database (stateless)", note: "Skip the DB in v1 if nothing needs saving.", free: true, levels: ["beginner", "intermediate", "advanced"], url: "https://worksmarto.com", tags: ["tool", "mcp", "widget"] },
  ],
  "AI model API": [
    { name: "Groq", note: "Very fast open models via an OpenAI-compatible API; free tier.", free: true, levels: ["beginner", "intermediate", "advanced"], url: "https://console.groq.com", worksmarto: "Architect, Idea Validator", tags: ["ai"] },
    { name: "Google AI Studio (Gemini)", note: "Free tier; multimodal (images, PDFs).", free: true, levels: ["beginner", "intermediate", "advanced"], url: "https://aistudio.google.com", tags: ["ai", "vision"] },
    { name: "OpenRouter", note: "One key for many models, including free ones; good as a fallback.", free: true, levels: ["intermediate", "advanced"], url: "https://openrouter.ai", worksmarto: "AI News", tags: ["ai"] },
    { name: "No AI call (let the user's AI do it)", note: "Serve data via MCP and let Claude/ChatGPT write the answer: zero cost.", free: true, levels: ["intermediate", "advanced"], url: "https://modelcontextprotocol.io", worksmarto: "Worksmarto MCP", tags: ["mcp"] },
  ],
  Hosting: [
    { name: "Vercel", note: "Push to GitHub, auto-deploy; Hobby plan is free.", free: true, levels: ["beginner", "intermediate", "advanced"], url: "https://vercel.com/pricing", worksmarto: "Architect, Worksmarto MCP", tags: ["saas", "ai", "mcp", "api"] },
    { name: "Hostinger (WordPress)", note: "Cheap shared hosting with one-click WordPress and subdomains.", free: false, levels: ["beginner"], url: "https://www.hostinger.com", worksmarto: "worksmarto.com, Idea Validator, Comply", tags: ["wordpress", "blog", "content"] },
    { name: "GitHub Pages", note: "Free static hosting; pair with a scheduled GitHub Action for daily updates.", free: true, levels: ["beginner", "intermediate"], url: "https://pages.github.com", worksmarto: "AI News", tags: ["static", "content", "news"] },
    { name: "Netlify", note: "Static sites + functions; free starter plan.", free: true, levels: ["beginner", "intermediate"], url: "https://www.netlify.com/pricing", tags: ["static", "tool"] },
  ],
};

const KIND_WORDS: Record<string, string[]> = {
  ai: ["ai", "gpt", "chatbot", "llm", "generate", "summar", "rephrase", "write", "assistant", "agent"],
  saas: ["saas", "subscription", "users", "login", "dashboard", "app"],
  wordpress: ["wordpress", "blog", "wp", "woocommerce", "plugin"],
  mobile: ["android", "ios", "mobile", "phone"],
  mcp: ["mcp", "connector", "claude", "chatgpt"],
  news: ["news", "daily", "digest", "feed"],
  tool: ["tool", "calculator", "checker", "widget", "generator", "converter"],
  vision: ["image", "photo", "pdf", "vision", "ocr"],
};

export function detectKinds(product: string): string[] {
  const p = product.toLowerCase();
  const kinds = Object.entries(KIND_WORDS)
    .filter(([, words]) => words.some((w) => p.includes(w)))
    .map(([k]) => k);
  return kinds.length ? kinds : ["tool"];
}

export function stackOptions(product: string, level: Level): string {
  const kinds = detectKinds(product);
  const blocks = Object.entries(LAYERS).map(([layer, opts]) => {
    const ranked = opts
      .filter((o) => o.levels.includes(level))
      .map((o) => ({ o, score: (o.tags || []).filter((t) => kinds.includes(t)).length + (o.worksmarto ? 0.5 : 0) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(({ o }) => {
        const tags = [o.free ? "free" : "paid (low cost)", o.worksmarto ? `used in Worksmarto ${o.worksmarto}` : ""]
          .filter(Boolean)
          .join(" · ");
        return `  - ${o.name}: ${o.note} [${tags}] ${o.url}`;
      });
    return `${layer}:\n${ranked.join("\n")}`;
  });
  return [
    `Worksmarto stack options for: "${product}" (level: ${level}; detected: ${kinds.join(", ")})`,
    "",
    ...blocks,
    "",
    "Worksmarto rules of thumb: keep API keys server-side; rate-limit any public AI endpoint; ship one feature first; prefer free tiers until real users arrive.",
    "Free-tier limits change often - confirm on each tool's pricing page.",
    "",
    "Assistant: pick one option per layer for the user, explain why in a line each, then give a short numbered build plan.",
  ].join("\n");
}
