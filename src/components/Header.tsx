import { Link } from "react-router-dom";

const links = [
  { to: "/#metodologia", label: "Método" },
  { to: "/#servicios", label: "Servicios" },
  { to: "/blog", label: "Blog" },
  { to: "/#contacto", label: "Contacto" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link to="/" className="font-serif text-lg tracking-tight text-ink">
          José Luis Carrizo
        </Link>
        <nav className="hidden gap-8 text-sm font-medium text-ink/70 sm:flex">
          {links.map((l) => (
            <a key={l.to} href={l.to} className="transition-colors hover:text-gold">
              {l.label}
            </a>
          ))}
        </nav>
        <a
          href="/#contacto"
          className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper transition-colors hover:bg-gold"
        >
          Escribime
        </a>
      </div>
    </header>
  );
}
