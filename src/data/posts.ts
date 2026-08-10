import raw from "./blog-posts-raw.json";

export type Post = {
  title: string;
  date: string;
  originalUrl: string;
  body: string;
  slug: string;
  excerpt: string;
};

function makeExcerpt(body: string): string {
  const firstPara = body.split("\n\n")[0] ?? body;
  const clean = firstPara.replace(/\s+/g, " ").trim();
  return clean.length > 180 ? clean.slice(0, 177).trimEnd() + "…" : clean;
}

export const posts: Post[] = (raw as Omit<Post, "excerpt">[])
  .map((p) => ({ ...p, excerpt: makeExcerpt(p.body) }))
  .sort((a, b) => (a.date < b.date ? 1 : -1));

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}
