import { Link } from "react-router-dom";
import { posts } from "../data/posts";

export default function Blog() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <p className="text-sm font-semibold uppercase tracking-widest text-gold">
        El líder y el liderazgo
      </p>
      <h1 className="mt-2 font-serif text-4xl text-ink">Blog</h1>
      <p className="mt-4 text-ink/70">
        Ideas sobre liderazgo, conocimiento, experiencia y actitud.
      </p>

      <div className="mt-12 flex flex-col divide-y divide-ink/10">
        {posts.map((p) => (
          <Link key={p.slug} to={`/blog/${p.slug}`} className="group py-8 first:pt-0">
            <span className="text-xs text-ink/40">
              {new Date(p.date).toLocaleDateString("es-ES", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <h2 className="mt-1 font-serif text-2xl text-ink group-hover:text-gold">
              {p.title}
            </h2>
            <p className="mt-2 text-ink/60">{p.excerpt}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
