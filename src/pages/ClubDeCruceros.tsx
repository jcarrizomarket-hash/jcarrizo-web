const SIGNUP_URL = "https://jcarrizo_es.incruises.com/signup";

const beneficios = [
  {
    titulo: "Ahorros inmediatos y constantes",
    detalle: "No vuelvas a pagar precio completo por cruceros, hoteles y resorts.",
  },
  {
    titulo: "Precios transparentes",
    detalle: "Impuestos, cargos y propinas incluidos — sin costos ocultos.",
  },
  {
    titulo: "Las mejores excursiones",
    detalle: "Acceso a una variedad de excursiones (inTours) en destinos de todo el mundo.",
  },
  {
    titulo: "Pagos protegidos",
    detalle: "Todos los pagos de membresía están protegidos por Repayd.",
  },
];

export default function ClubDeCruceros() {
  return (
    <div className="bg-paper text-ink">
      {/* Hero */}
      <section className="border-b border-ink/10 bg-paper-dim">
        <div className="mx-auto max-w-3xl px-6 py-24 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-gold-light">
            Club de Cruceros · inCruises
          </span>
          <h1 className="mt-6 font-serif text-4xl leading-[1.1] text-ink sm:text-5xl">
            Explorá, descubrí y disfrutá más por menos.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-ink/70">
            Soy Socio de inCruises, el club de recompensas de viajes que te da acceso a
            cruceros, hoteles y resorts a precios que no vas a encontrar reservando por tu
            cuenta. Te invito a sumarte con mi enlace.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href={SIGNUP_URL}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-ink px-7 py-3.5 text-sm font-semibold text-paper transition-colors hover:bg-gold"
            >
              Unirme al club
            </a>
            <a
              href="https://incruises.com"
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-ink/20 px-7 py-3.5 text-sm font-semibold text-ink transition-colors hover:border-gold hover:text-gold"
            >
              Ver sitio oficial de inCruises
            </a>
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <p className="text-sm font-semibold uppercase tracking-widest text-gold">
          Por qué unirte
        </p>
        <h2 className="mt-2 font-serif text-3xl text-ink sm:text-4xl">
          Cuando estás IN, recibís más
        </h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {beneficios.map((b) => (
            <div key={b.titulo} className="rounded-2xl border border-ink/10 p-8">
              <h3 className="font-serif text-xl text-ink">{b.titulo}</h3>
              <p className="mt-3 text-ink/70">{b.detalle}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Membresía */}
      <section className="border-t border-ink/10 bg-paper-dim">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-gold">
            La membresía
          </p>
          <h2 className="mt-2 font-serif text-3xl text-ink sm:text-4xl">
            Planes flexibles desde $50 USD al mes
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-ink/70">
            inCruises opera desde 2016, con socios y miembros reservando viajes en todo el
            mundo. Las reseñas verificadas de miembros reales califican al club con{" "}
            <strong>4.8 estrellas</strong> ("Excelente").
          </p>
        </div>
      </section>

      {/* Video oficial */}
      <section className="mx-auto max-w-3xl px-6 py-20 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-gold">
          Conocé más
        </p>
        <h2 className="mt-2 font-serif text-3xl text-ink sm:text-4xl">Video oficial</h2>
        <div className="mt-8 aspect-video overflow-hidden rounded-2xl border border-ink/10 shadow-xl">
          <iframe
            src="https://www.youtube.com/embed/voTOMAJTnW0"
            title="Introducing the inCruises Membership"
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <p className="mt-4 text-sm text-ink/60">
          Video oficial de inCruises. Más contenido en su{" "}
          <a
            href="https://www.youtube.com/@IncruisesOfficial"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-gold decoration-2 underline-offset-4 hover:text-gold"
          >
            canal de YouTube
          </a>
          .
        </p>
      </section>

      {/* CTA final */}
      <section className="border-t border-ink/10">
        <div className="mx-auto max-w-3xl px-6 py-24 text-center">
          <h2 className="font-serif text-3xl text-ink sm:text-4xl">
            ¿Querés empezar a viajar por menos?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-ink/70">
            Sumate al club con mi invitación — el registro es directo en el sitio de
            inCruises.
          </p>
          <a
            href={SIGNUP_URL}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-block rounded-full bg-ink px-8 py-4 text-sm font-semibold text-paper transition-colors hover:bg-gold"
          >
            Unirme al club →
          </a>
        </div>
      </section>
    </div>
  );
}
