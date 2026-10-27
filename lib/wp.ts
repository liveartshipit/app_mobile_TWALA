// Read-only helpers for the public WordPress REST API of worksmarto.com.
// Nothing here needs credentials: only published posts are ever returned.

const SITE = process.env.WP_SITE_URL || "https://worksmarto.com";

export type Post = {
  title: string;
  url: string;
  date: string;
  summary: string;
};

const entities: Record<string, string> = {
  "&amp;": "&",
  "&#8217;": "'",
  "&#8216;": "'",
  "&#8220;": '"',
  "&#8221;": '"',
  "&#8211;": "-",
  "&#8212;": "-",
  "&#038;": "&",
  "&hellip;": "...",
  "&#8230;": "...",
  "&nbsp;": " ",
  "&quot;": '"',
  "&#039;": "'",
};

export function clean(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&[#a-z0-9]+;/gi, (m) => entities[m] ?? " ")
    .replace(/\s+/g, " ")
    .trim();
}

type WpPost = {
  title: { rendered: string };
  link: string;
  date: string;
  excerpt: { rendered: string };
};

export async function fetchPosts(params: Record<string, string>): Promise<Post[]> {
  const qs = new URLSearchParams({
    _fields: "title,link,date,excerpt",
    status: "publish",
    ...params,
  });
  const res = await fetch(`${SITE}/wp-json/wp/v2/posts?${qs}`, {
    headers: { "User-Agent": "worksmarto-mcp/1.0" },
    next: { revalidate: 600 }, // cache 10 min on Vercel
  } as RequestInit);
  if (!res.ok) throw new Error(`Worksmarto API returned ${res.status}`);
  const data = (await res.json()) as WpPost[];
  return data.map((p) => ({
    title: clean(p.title.rendered),
    url: withUtm(p.link),
    date: p.date.slice(0, 10),
    summary: clean(p.excerpt.rendered).slice(0, 280),
  }));
}

// Tag every link so MCP traffic shows up separately in analytics.
export function withUtm(url: string): string {
  try {
    const u = new URL(url);
    u.searchParams.set("utm_source", "mcp");
    u.searchParams.set("utm_medium", "ai-assistant");
    return u.toString();
  } catch {
    return url;
  }
}

export function formatPosts(posts: Post[], heading: string): string {
  if (!posts.length) return `${heading}\n\nNo matching posts found. Browse everything at ${withUtm(SITE)}`;
  const lines = posts.map(
    (p, i) => `${i + 1}. ${p.title} (${p.date})\n   ${p.summary}\n   ${p.url}`
  );
  return `${heading}\n\n${lines.join("\n\n")}\n\nMore at ${withUtm(SITE)}`;
}

export { SITE };
