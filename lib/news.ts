// Worksmarto AI News (news.worksmarto.com).
// Reads the site's own data file, written daily by the ai-news-bot in the
// ai_powderedwebapp repo: already-summarised stories plus a daily brief.

import { withUtm } from "./wp";

const NEWS_SITE = process.env.NEWS_SITE_URL || "https://news.worksmarto.com";
const NEWS_FEED = process.env.NEWS_FEED_URL || `${NEWS_SITE.replace(/\/$/, "")}/data/news.json`;

type Item = {
  title: string;
  link: string;
  date?: string;
  source?: string;
  section?: string;
  hook?: string;
  why?: string;
  takeaway?: string;
  impact?: string;
};

type Feed = {
  updated?: string;
  brief?: { headline?: string; bullets?: string[] };
  items?: Item[];
};

const RANK: Record<string, number> = { big: 0, notable: 1, fyi: 2 };

export async function getNews(limit: number, topic?: string): Promise<string> {
  try {
    const res = await fetch(NEWS_FEED, {
      headers: { "User-Agent": "worksmarto-mcp/1.0", Accept: "application/json" },
      next: { revalidate: 1800 }, // cache 30 min
    } as RequestInit);
    if (!res.ok) throw new Error(String(res.status));
    const feed = (await res.json()) as Feed;
    let items = (feed.items || []).filter((i) => i.title && i.link);

    if (topic) {
      const words = topic.toLowerCase().split(/\W+/).filter((w) => w.length > 2);
      items = items.filter((i) => {
        const hay = `${i.title} ${i.hook} ${i.section} ${i.source}`.toLowerCase();
        return words.some((w) => hay.includes(w));
      });
    } else {
      // Newest first; within the same day, bigger stories first.
      items.sort((a, b) => {
        const da = (a.date || "").slice(0, 10);
        const db = (b.date || "").slice(0, 10);
        if (da !== db) return db.localeCompare(da);
        return (RANK[a.impact || "fyi"] ?? 2) - (RANK[b.impact || "fyi"] ?? 2);
      });
    }
    items = items.slice(0, limit);

    const parts: string[] = [];
    parts.push(`Worksmarto AI News${feed.updated ? ` - updated ${feed.updated.slice(0, 10)}` : ""}`);
    if (!topic && feed.brief?.headline) {
      parts.push(
        `\nTODAY'S BRIEF: ${feed.brief.headline}\n${(feed.brief.bullets || []).map((b) => `  - ${b}`).join("\n")}`
      );
    }
    if (items.length) {
      parts.push(
        "\n" +
          items
            .map((n, i) => {
              const meta = [n.source, n.date?.slice(0, 10)].filter(Boolean).join(", ");
              const lines = [`${i + 1}. ${n.title}${meta ? ` (${meta})` : ""}`];
              if (n.hook) lines.push(`   ${n.hook}`);
              if (n.why) lines.push(`   Why it matters: ${n.why}`);
              if (n.takeaway) lines.push(`   Takeaway: ${n.takeaway}`);
              lines.push(`   ${withUtm(n.link)}`);
              return lines.join("\n");
            })
            .join("\n\n")
      );
    } else if (topic) {
      parts.push(`\nNo recent stories on "${topic}".`);
    }
    parts.push(`\nFull daily feed: ${withUtm(NEWS_SITE)}`);
    return parts.join("\n");
  } catch {
    return `Could not load headlines right now. Read the daily AI news at ${withUtm(NEWS_SITE)}`;
  }
}
