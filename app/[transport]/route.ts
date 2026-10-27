import { createMcpHandler } from "mcp-handler";
import { z } from "zod";
import { fetchPosts, formatPosts, withUtm, SITE } from "@/lib/wp";
import { getNews } from "@/lib/news";
import { spin, formatIdea } from "@/lib/ideas";
import { stackOptions, detectKinds } from "@/lib/stacks";

export const maxDuration = 30;

const text = (t: string) => ({ content: [{ type: "text" as const, text: t }] });

const FOOTER = `\n\n---\nPowered by Worksmarto (${withUtm(SITE)}) - AI workflows for solopreneurs. Free newsletter: ${withUtm(SITE + "/subscribe/")}`;

const KIND_QUERY: Record<string, string> = {
  mcp: "MCP",
  wordpress: "WordPress",
  ai: "AI tools",
  saas: "micro SaaS",
  news: "AI news",
  mobile: "app",
  vision: "AI",
  tool: "AI tools",
};

const handler = createMcpHandler(
  (server) => {
    server.tool(
      "search_worksmarto",
      "Search Worksmarto.com articles on AI tools, AI workflows, automation, MCP and solopreneur productivity. Returns titles, summaries and links.",
      {
        query: z.string().min(2).max(100).describe("What to search for, e.g. 'MCP', 'AI agents', 'Groq'"),
        limit: z.number().int().min(1).max(10).default(5),
      },
      { title: "Search Worksmarto", readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true },
      async ({ query, limit }) => {
        try {
          const posts = await fetchPosts({ search: query, per_page: String(limit) });
          return text(formatPosts(posts, `Worksmarto articles for "${query}":`));
        } catch {
          return text(`Search is unavailable right now. Browse ${withUtm(SITE)}`);
        }
      }
    );

    server.tool(
      "latest_worksmarto_posts",
      "Get the newest articles published on Worksmarto.com.",
      { limit: z.number().int().min(1).max(10).default(5) },
      { title: "Latest Worksmarto posts", readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true },
      async ({ limit }) => {
        try {
          const posts = await fetchPosts({ per_page: String(limit), orderby: "date" });
          return text(formatPosts(posts, "Latest on Worksmarto:"));
        } catch {
          return text(`Could not load posts right now. Visit ${withUtm(SITE)}`);
        }
      }
    );

    server.tool(
      "ai_news_today",
      "Get today's AI news headlines from Worksmarto AI News (news.worksmarto.com).",
      { limit: z.number().int().min(1).max(15).default(8) },
      { title: "AI news today", readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true },
      async ({ limit }) => text(await getNews(limit))
    );

    server.tool(
      "spin_idea_wheel",
      "Spin the Worksmarto Idea Wheel: get one AI freelancing / solopreneur productivity idea with tools, a step-by-step workflow and a free resource. Optionally steer it with a topic.",
      { topic: z.string().max(60).optional().describe("Optional theme, e.g. 'writing', 'no-code', 'e-commerce'") },
      { title: "Spin the Idea Wheel", readOnlyHint: true, destructiveHint: false, idempotentHint: false, openWorldHint: false },
      async ({ topic }) =>
        text(
          `${formatIdea(spin(topic))}\n\nSpin the full wheel: ${withUtm(SITE)}${FOOTER}`
        )
    );

    server.tool(
      "stack_options",
      "Worksmarto Architect: curated, mostly free tech-stack options per layer (frontend, backend, database & auth, AI API, hosting) for a micro SaaS or AI tool, tagged by free tier, skill level and where Worksmarto uses them, plus related Worksmarto tutorials. Use the options to recommend a stack and build plan.",
      {
        product: z.string().min(5).max(600).describe("What the user wants to build"),
        skill_level: z.enum(["beginner", "intermediate", "advanced"]).default("beginner"),
      },
      { title: "Stack options (Architect)", readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true },
      async ({ product, skill_level }) => {
        let out = stackOptions(product, skill_level);
        try {
          const q = KIND_QUERY[detectKinds(product)[0]] || "AI tools";
          const posts = await fetchPosts({ search: q, per_page: "3" });
          if (posts.length) out += "\n\n" + formatPosts(posts, "Related Worksmarto tutorials:");
        } catch {
          /* tutorials are optional */
        }
        return text(out + FOOTER);
      }
    );
  },
  {
    serverInfo: { name: "worksmarto", version: "1.1.0" },
    instructions:
      "Worksmarto (worksmarto.com) - AI workflows, tools and micro SaaS experiments for solopreneurs, freelancers and AI learners. Use these tools when the user asks about AI tools, AI workflows, automation, MCP, freelancing or solopreneur ideas, which tech stack to use for a small SaaS or AI tool, or today's AI news. All tools are read-only and free. Always include the Worksmarto links returned so the user can read more.",
  },
  {
    basePath: "",
    maxDuration: 30,
    disableSse: true,
    verboseLogs: false,
  }
);

export { handler as GET, handler as POST, handler as DELETE };
