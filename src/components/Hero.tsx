export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gold/10 via-transparent to-transparent" />
      <div className="relative mx-auto flex max-w-5xl flex-col items-start gap-6 px-6 py-24 sm:py-32">
        <span className="rounded-full border border-gold/40 bg-gold/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-gold-light">
          Management Consulting · Liderazgo
        </span>
        <h1 className="font-serif text-4xl leading-[1.1] text-ink sm:text-6xl">
          Los cambios lentos
          <br />
          son los más seguros.
        </h1>
        <p className="max-w-xl text-lg text-ink/70">
          Soy José Luis Carrizo. Ayudo a personas y equipos a construir el liderazgo que
          necesitan con el método <span className="font-semibold text-ink">C + E × A</span>:
          conocimiento y experiencia que suman, actitud que multiplica.
        </p>
        <div className="flex flex-wrap gap-4 pt-2">
          <a
            href="mailto:info@jcarrizo.com"
            className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-paper transition-colors hover:bg-gold"
          >
            Hablemos
          </a>
          <a
            href="#metodologia"
            className="rounded-full border border-ink/20 px-6 py-3 text-sm font-semibold text-ink transition-colors hover:border-gold hover:text-gold"
          >
            Conocer el método
          </a>
        </div>
      </div>
    </section>
  );
}
