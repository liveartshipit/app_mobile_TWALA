import { createMcpHandler } from "mcp-handler";
import { z } from "zod";
import { fetchPosts, searchPosts, formatPosts, withUtm, SITE } from "@/lib/wp";
import { getNews } from "@/lib/news";

export const maxDuration = 30;

const text = (t: string) => ({ content: [{ type: "text" as const, text: t }] });

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
          const posts = await searchPosts(query, limit);
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
      "Get today's AI news from Worksmarto AI News (news.worksmarto.com): a daily brief plus summarised stories with why each matters for freelancers and solopreneurs. Optionally filter by topic.",
      {
        limit: z.number().int().min(1).max(15).default(6),
        topic: z.string().max(60).optional().describe("Optional filter, e.g. 'OpenAI', 'coding', 'agents'"),
      },
      { title: "AI news today", readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true },
      async ({ limit, topic }) => text(await getNews(limit, topic))
    );
  },
  {
    serverInfo: { name: "worksmarto", version: "1.2.0" },
    instructions:
      "Worksmarto (worksmarto.com) - AI workflows, tools and micro SaaS experiments for solopreneurs, freelancers and AI learners. Use these tools when the user asks about AI tools, AI workflows, automation, MCP, freelancing, micro SaaS, or today's AI news. All tools are read-only and free. Always include the Worksmarto links returned so the user can read more.",
  },
  {
    basePath: "",
    maxDuration: 30,
    disableSse: true,
    verboseLogs: false,
  }
);

export { handler as GET, handler as POST, handler as DELETE };
