import { Link } from "react-router-dom";
import { posts } from "../data/posts";

export default function BlogPreview() {
  const ultimos = posts.slice(0, 3);

  return (
    <section className="border-t border-ink/10 bg-paper-dim/60">
      <div className="mx-auto max-w-5xl px-6 py-20">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-gold">
              El líder y el liderazgo
            </p>
            <h2 className="mt-2 font-serif text-3xl text-ink sm:text-4xl">Del blog</h2>
          </div>
          <Link to="/blog" className="hidden text-sm font-semibold text-ink hover:text-gold sm:block">
            Ver todo →
          </Link>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {ultimos.map((p) => (
            <Link
              key={p.slug}
              to={`/blog/${p.slug}`}
              className="flex flex-col rounded-2xl border border-ink/10 bg-paper p-6 transition-colors hover:border-gold/50"
            >
              <span className="text-xs text-ink/40">
                {new Date(p.date).toLocaleDateString("es-ES", { year: "numeric", month: "long" })}
              </span>
              <h3 className="mt-2 font-serif text-lg text-ink">{p.title}</h3>
              <p className="mt-2 flex-1 text-sm text-ink/60">{p.excerpt}</p>
              <span className="mt-4 text-sm font-semibold text-gold">Leer →</span>
            </Link>
          ))}
        </div>

        <Link to="/blog" className="mt-8 block text-sm font-semibold text-ink hover:text-gold sm:hidden">
          Ver todo el blog →
        </Link>
      </div>
    </section>
  );
}
