export default function ContactoCTA() {
  return (
    <section id="contacto" className="border-t border-ink/10">
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h2 className="font-serif text-3xl text-ink sm:text-4xl">Hablemos de tu futuro deseado</h2>
        <p className="mx-auto mt-4 max-w-xl text-ink/70">
          Si querés charlar sobre un proceso de coaching o una consultoría de liderazgo para tu
          equipo, escribime y lo vemos.
        </p>
        <a
          href="mailto:info@jcarrizo.com"
          className="mt-8 inline-block rounded-full bg-ink px-8 py-4 text-sm font-semibold text-paper transition-colors hover:bg-gold"
        >
          info@jcarrizo.com
        </a>
      </div>
    </section>
  );
}
