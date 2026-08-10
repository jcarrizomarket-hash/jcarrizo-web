const redes = [
  { label: "Instagram", href: "https://www.instagram.com/jl_carrizo/" },
  { label: "TikTok", href: "https://www.tiktok.com/@joseluiscarrizo75" },
  { label: "Facebook", href: "https://www.facebook.com/jluiscarrizo" },
];

export default function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-paper-dim">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-10 text-sm text-ink/60 sm:flex-row sm:items-center sm:justify-between">
        <p>&copy; {new Date().getFullYear()} José Luis Carrizo — Management Consulting.</p>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          {redes.map((r) => (
            <a
              key={r.label}
              href={r.href}
              target="_blank"
              rel="noreferrer"
              className="hover:text-gold"
            >
              {r.label}
            </a>
          ))}
          <a href="mailto:info@jcarrizo.com" className="hover:text-gold">
            info@jcarrizo.com
          </a>
        </div>
      </div>
    </footer>
  );
}
