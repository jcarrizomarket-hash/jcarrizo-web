import { Link, Navigate, useParams } from "react-router-dom";
import { getPostBySlug, posts } from "../data/posts";

export default function BlogPost() {
  const { slug } = useParams();
  const post = slug ? getPostBySlug(slug) : undefined;

  if (!post) return <Navigate to="/blog" replace />;

  const index = posts.findIndex((p) => p.slug === post.slug);
  const siguiente = posts[index + 1];

  return (
    <article className="mx-auto max-w-2xl px-6 py-20">
      <Link to="/blog" className="text-sm font-semibold text-ink/60 hover:text-gold">
        ← Volver al blog
      </Link>

      <span className="mt-6 block text-xs text-ink/40">
        {new Date(post.date).toLocaleDateString("es-ES", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </span>
      <h1 className="mt-2 font-serif text-3xl text-ink sm:text-4xl">{post.title}</h1>

      <div className="prose-post mt-10 text-ink/80">
        {post.body.split("\n\n").map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>

      <div className="mt-16 border-t border-ink/10 pt-8">
        <p className="text-sm text-ink/50">— José Luis Carrizo</p>
        {siguiente && (
          <Link
            to={`/blog/${siguiente.slug}`}
            className="mt-6 block rounded-2xl border border-ink/10 p-6 transition-colors hover:border-gold/50"
          >
            <span className="text-xs font-semibold uppercase tracking-wide text-gold">
              Siguiente
            </span>
            <h2 className="mt-1 font-serif text-xl text-ink">{siguiente.title}</h2>
          </Link>
        )}
      </div>
    </article>
  );
}
