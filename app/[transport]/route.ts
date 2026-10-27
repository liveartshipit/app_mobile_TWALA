import { createMcpHandler } from "mcp-handler";
import { z } from "zod";
import { fetchPosts, formatPosts, withUtm, SITE } from "@/lib/wp";
import { getNews } from "@/lib/news";
import { spin, formatIdea } from "@/lib/ideas";
import { ask } from "@/lib/groq";
import { checkLimit, clientIp } from "@/lib/limits";

export const maxDuration = 60;

const text = (t: string) => ({ content: [{ type: "text" as const, text: t }] });

const FOOTER = `\n\n---\nPowered by Worksmarto (${withUtm(SITE)}) - AI workflows for solopreneurs. Free newsletter: ${withUtm(SITE + "/subscribe/")}`;

const SAFETY = `Rules: focus on productivity, tools and workflows. Never promise income, revenue or financial results. Never give health, medical, legal or financial advice. Be concise, practical and honest about risks. Use plain text with short headings and bullet points.`;

const handler = createMcpHandler(
  (server) => {
    server.tool(
      "search_worksmarto",
      "Search Worksmarto.com articles on AI tools, AI workflows, automation, MCP and solopreneur productivity. Returns titles, summaries and links.",
      {
        query: z.string().min(2).max(100).describe("What to search for, e.g. 'MCP', 'AI agents', 'Groq'"),
        limit: z.number().int().min(1).max(10).default(5),
      },
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
      async ({ limit }) => text(await getNews(limit))
    );

    server.tool(
      "spin_idea_wheel",
      "Spin the Worksmarto Idea Wheel: get one AI freelancing / solopreneur productivity idea with tools, a step-by-step workflow and a free resource. Optionally steer it with a topic.",
      { topic: z.string().max(60).optional().describe("Optional theme, e.g. 'writing', 'no-code', 'e-commerce'") },
      async ({ topic }) =>
        text(
          `${formatIdea(spin(topic))}\n\nSpin the full wheel: ${withUtm(SITE)}${FOOTER}`
        )
    );

    server.tool(
      "validate_idea",
      "Worksmarto AI Idea Validator: get a quick, honest breakdown of a startup or micro SaaS idea - problem, audience, competitors, how competitors market, risks, gaps to exploit and next steps. Limited free uses per hour.",
      {
        idea: z.string().min(10).max(600).describe("The idea in a few sentences"),
        market: z.string().max(60).optional().describe("Target country or market, e.g. 'India'"),
      },
      async ({ idea, market }, extra) => {
        const gate = checkLimit(clientIp(extra?.requestInfo?.headers));
        if (!gate.ok) return text(gate.reason);
        try {
          const out = await ask(
            `You are the Worksmarto AI Idea Validator. Give a sharp, honest validation in these sections: 1) Problem & who has it 2) Target audience 3) Existing solutions/competitors 4) How competitors market 5) Differentiation 6) Key risks 7) MVP scope (smallest useful version) 8) Score out of 10 with one-line reason. Then: Top 3 gaps to exploit, and 3 immediate next actions for this week. ${SAFETY}`,
            `Idea: ${idea}${market ? `\nMarket: ${market}` : ""}`
          );
          return text(out + FOOTER);
        } catch (e) {
          return text(`The validator is busy right now (${(e as Error).message}). Try again in a minute.`);
        }
      }
    );

    server.tool(
      "plan_stack",
      "Worksmarto Architect: get a lean, mostly free tech stack and build plan for a micro SaaS or AI tool (frontend, backend, database, AI API, hosting, steps). Limited free uses per hour.",
      {
        product: z.string().min(10).max(600).describe("What you want to build"),
        skill_level: z.enum(["beginner", "intermediate", "advanced"]).default("beginner"),
      },
      async ({ product, skill_level }, extra) => {
        const gate = checkLimit(clientIp(extra?.requestInfo?.headers));
        if (!gate.ok) return text(gate.reason);
        try {
          const out = await ask(
            `You are Worksmarto Architect. Recommend a lean stack that favours free tiers and open source (e.g. React/Next.js, Supabase, Groq, Vercel, WordPress when it fits). Sections: 1) Recommended stack table (layer - tool - why - free tier?) 2) Architecture in 4-6 bullet points 3) Build plan in numbered steps sized for the user's skill level 4) What to skip in v1 5) Security basics (keys server-side, rate limits). ${SAFETY}`,
            `Product: ${product}\nSkill level: ${skill_level}`
          );
          return text(out + FOOTER);
        } catch (e) {
          return text(`Architect is busy right now (${(e as Error).message}). Try again in a minute.`);
        }
      }
    );
  },
  {
    serverInfo: { name: "worksmarto", version: "1.0.0" },
  },
  {
    basePath: "",
    maxDuration: 60,
    disableSse: true,
    verboseLogs: false,
  }
);

export { handler as GET, handler as POST, handler as DELETE };
