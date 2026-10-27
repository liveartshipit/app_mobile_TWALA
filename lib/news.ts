// Pulls headlines from Worksmarto AI News (news.worksmarto.com).
// Set NEWS_FEED_URL to a JSON feed ([{title,url,summary,date}]) if the site
// publishes one; otherwise headlines are read from the page's HTML.

import { clean, withUtm } from "./wp";

const NEWS_SITE = process.env.NEWS_SITE_URL || "https://news.worksmarto.com";
const NEWS_FEED = process.env.NEWS_FEED_URL || "";

type Item = { title: string; url: string; summary?: string; date?: string };

function fromHtml(html: string, base: string): Item[] {
  const items: Item[] = [];
  const seen = new Set<string>();
  // Headline links: <h1-4>...<a href="...">Title</a>...</h> or <a href><h3>Title</h3></a>
  const re = /<a[^>]+href=["']([^"'#]+)["'][^>]*>([\s\S]{0,400}?)<\/a>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) && items.length < 15) {
    const title = clean(m[2]);
    if (title.length < 25 || title.length > 200) continue; // skip nav links
    let url: string;
    try {
      url = new URL(m[1], base).toString();
    } catch {
      continue;
    }
    if (seen.has(title)) continue;
    seen.add(title);
    items.push({ title, url });
  }
  return items;
}

export async function getNews(limit: number): Promise<string> {
  try {
    const target = NEWS_FEED || NEWS_SITE;
    const res = await fetch(target, {
      headers: { "User-Agent": "worksmarto-mcp/1.0" },
      next: { revalidate: 1800 },
    } as RequestInit);
    if (!res.ok) throw new Error(String(res.status));
    const type = res.headers.get("content-type") || "";
    let items: Item[];
    if (type.includes("json")) {
      const data = await res.json();
      items = (Array.isArray(data) ? data : data.items || []) as Item[];
    } else {
      items = fromHtml(await res.text(), NEWS_SITE);
    }
    items = items.slice(0, limit);
    if (!items.length) throw new Error("no items");
    const lines = items.map(
      (n, i) =>
        `${i + 1}. ${n.title}${n.date ? ` (${n.date})` : ""}${n.summary ? `\n   ${n.summary}` : ""}\n   ${withUtm(n.url)}`
    );
    return `Worksmarto AI News - latest\n\n${lines.join("\n\n")}\n\nFull feed: ${withUtm(NEWS_SITE)}`;
  } catch {
    return `Could not load headlines right now. Read the daily AI news at ${withUtm(NEWS_SITE)}`;
  }
}
