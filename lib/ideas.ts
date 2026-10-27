// Idea Wheel data: AI freelancing / solopreneur productivity ideas.
// Static on purpose: no API cost and instant answers. Productivity only,
// no income promises, no health or wellness topics.

export type Idea = {
  title: string;
  who: string;
  what: string;
  tools: string[];
  workflow: string[];
  freeResource: string;
};

export const IDEAS: Idea[] = [
  {
    title: "AI meeting-notes service for small teams",
    who: "Freelancers who support agencies and startups",
    what: "Turn recorded calls into clean summaries, decisions and action items the same day.",
    tools: ["Otter.ai or Fireflies (free tier)", "ChatGPT / Claude", "Notion"],
    workflow: ["Collect the recording link", "Transcribe with the free tier", "Summarise with a fixed prompt template", "Publish to a shared Notion page"],
    freeResource: "Notion's free meeting-notes templates",
  },
  {
    title: "Blog-to-social repurposing desk",
    who: "Writers and content freelancers",
    what: "Turn one blog post into a LinkedIn post, an X thread and a short newsletter blurb.",
    tools: ["Claude", "Canva (free)", "Buffer or Metricool (free plan)"],
    workflow: ["Pick the post", "Extract 5 key points with AI", "Write 3 platform versions", "Design one card in Canva", "Schedule"],
    freeResource: "Canva's free social templates",
  },
  {
    title: "No-code client onboarding kit",
    who: "Solopreneurs selling any service",
    what: "One form that collects client details, creates a folder and sends a welcome email automatically.",
    tools: ["Tally (free)", "Make.com or Zapier (free tier)", "Google Drive", "Gmail"],
    workflow: ["Build the Tally intake form", "Trigger a Make scenario on submit", "Create a Drive folder", "Send the welcome email template"],
    freeResource: "Make.com free plan (1,000 ops/month)",
  },
  {
    title: "AI FAQ chatbot setup for local businesses",
    who: "Tech-savvy freelancers",
    what: "Build a website chatbot trained only on the business's own pages and FAQs.",
    tools: ["Groq API (free tier)", "WordPress + WPCode", "Google Docs for the FAQ source"],
    workflow: ["Collect FAQs into one doc", "Write the system prompt", "Connect the chat widget", "Test 20 real questions"],
    freeResource: "Groq free API tier",
  },
  {
    title: "Research brief builder",
    who: "Students, analysts and consultants",
    what: "Produce a two-page cited brief on any topic in under an hour.",
    tools: ["Perplexity", "Claude", "Google Docs"],
    workflow: ["Define 5 questions", "Collect sources with citations", "Draft the brief with AI", "Fact-check every number against its source"],
    freeResource: "Google Scholar",
  },
  {
    title: "Product description refresher for online stores",
    who: "E-commerce freelancers",
    what: "Rewrite thin product pages into clear, SEO-friendly descriptions in a consistent brand voice.",
    tools: ["ChatGPT / Claude", "Google Sheets", "WooCommerce or Shopify bulk import"],
    workflow: ["Export products to a sheet", "Write a brand-voice prompt", "Generate in batches", "Human review", "Bulk re-import"],
    freeResource: "Google Sheets + free AI tiers",
  },
  {
    title: "Personal AI inbox triage system",
    who: "Any busy solopreneur",
    what: "Auto-label, summarise and draft replies for routine email so only real decisions reach you.",
    tools: ["Gmail filters", "Make.com", "Claude or Gemini"],
    workflow: ["Define 5 email categories", "Create labels and filters", "Add an AI summary step", "Review drafts once a day"],
    freeResource: "Gmail's built-in filters",
  },
  {
    title: "Slide-deck makeover service",
    who: "Designers and presentation freelancers",
    what: "Turn messy text-heavy decks into clean, visual slides fast.",
    tools: ["Gamma or Claude Slides", "Canva", "Unsplash"],
    workflow: ["Get the original deck", "Extract the storyline with AI", "Rebuild in Gamma or Slides", "Polish visuals"],
    freeResource: "Unsplash free images",
  },
  {
    title: "AI-assisted job description writer for small companies",
    who: "HR and recruitment freelancers",
    what: "Write clear, inclusive job posts and screening questions from a short brief.",
    tools: ["Claude", "Google Forms", "LinkedIn Jobs"],
    workflow: ["Collect role brief", "Draft JD with AI", "Create screening form", "Client review"],
    freeResource: "Google Forms",
  },
  {
    title: "Weekly AI news digest for a niche",
    who: "Newsletter writers",
    what: "Curate the 5 most useful AI updates for one niche every week.",
    tools: ["RSS reader (Feedly free)", "Claude", "Beehiiv or Substack (free)"],
    workflow: ["Pick a niche", "Follow 15 sources", "Shortlist weekly", "Summarise with AI", "Send"],
    freeResource: "Feedly free plan",
  },
  {
    title: "SOP documentation service",
    who: "Operations freelancers and virtual assistants",
    what: "Turn screen recordings of a process into step-by-step SOP documents.",
    tools: ["Loom (free)", "Scribe", "Claude", "Notion"],
    workflow: ["Record the process", "Auto-capture steps", "Clean up wording with AI", "Publish to the team wiki"],
    freeResource: "Scribe free plan",
  },
  {
    title: "Micro SaaS MVP in a weekend",
    who: "Indie hackers and AI full-stack learners",
    what: "Ship a single-feature web tool using free hosting and a free AI API.",
    tools: ["React or plain HTML", "Supabase (free)", "Groq API", "Vercel"],
    workflow: ["Pick one painful task", "Design one screen", "Wire the AI call server-side", "Deploy", "Share with 10 people"],
    freeResource: "Vercel Hobby plan",
  },
  {
    title: "Podcast show-notes & clips desk",
    who: "Audio and video editors",
    what: "Create show notes, timestamps and short clip ideas from each episode.",
    tools: ["Descript", "Claude", "CapCut"],
    workflow: ["Transcribe the episode", "Generate notes and chapters", "Pick 3 clip moments", "Edit short clips"],
    freeResource: "CapCut free editor",
  },
  {
    title: "Spreadsheet automation helper",
    who: "Data-savvy freelancers",
    what: "Replace manual copy-paste reports with formulas, Apps Script and AI-written macros.",
    tools: ["Google Sheets", "Apps Script", "Claude for code"],
    workflow: ["Map the manual steps", "Write formulas or a script with AI", "Test on a copy", "Hand over with a 1-page guide"],
    freeResource: "Google Apps Script",
  },
  {
    title: "Website accessibility & SEO quick audit",
    who: "Web freelancers",
    what: "Deliver a clear fix list for speed, accessibility and on-page SEO issues.",
    tools: ["PageSpeed Insights", "WAVE", "Google Search Console", "Claude for the report"],
    workflow: ["Run the 3 audits", "Group issues by priority", "Write the plain-English report", "Offer fixes as a follow-up"],
    freeResource: "PageSpeed Insights",
  },
  {
    title: "AI learning-path curator",
    who: "Teachers, trainers and community builders",
    what: "Build a 30-day learning path on one skill from free resources.",
    tools: ["YouTube", "Claude", "Notion or Google Sites"],
    workflow: ["Define the end skill", "Collect free resources", "Order them by difficulty", "Add a small task per day", "Publish"],
    freeResource: "Google Sites",
  },
];

export function spin(topic?: string): Idea {
  let pool = IDEAS;
  if (topic) {
    const t = topic.toLowerCase();
    const words = t.split(/\W+/).filter((w) => w.length > 2);
    const matched = IDEAS.filter((i) => {
      const hay = `${i.title} ${i.who} ${i.what} ${i.tools.join(" ")}`.toLowerCase();
      return words.some((w) => hay.includes(w));
    });
    if (matched.length) pool = matched;
  }
  return pool[Math.floor(Math.random() * pool.length)];
}

export function formatIdea(i: Idea): string {
  return [
    `IDEA: ${i.title}`,
    `For: ${i.who}`,
    `What: ${i.what}`,
    `Tools: ${i.tools.join(", ")}`,
    `Workflow:\n${i.workflow.map((s, n) => `  ${n + 1}. ${s}`).join("\n")}`,
    `Free resource: ${i.freeResource}`,
  ].join("\n");
}
