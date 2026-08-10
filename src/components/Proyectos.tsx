const proyectos = [
  {
    nombre: "Eukos Gestión",
    categoria: "Gestión de servicios",
    detalle:
      "Plataforma de gestión operativa para personal que trabaja en la calle: turnos, confirmación por WhatsApp y control de asistencia por QR. Arrancó coordinando camareros para catering y eventos.",
    href: "https://gestion.eukosgestion.com",
    dominio: "eukosgestion.com",
  },
  {
    nombre: "Valeria Travels",
    categoria: "Agencia de viajes",
    detalle:
      "Agencia de viajes con CRM propio: presupuestos, reservas y seguimiento de clientes de punta a punta.",
    href: "https://valeriatravels.vercel.app",
    dominio: "valeriatravels.com",
  },
  {
    nombre: "Burger Le Monde",
    categoria: "Restauración",
    detalle:
      "Hamburguesería gourmet en Castelldefels — sabores del mundo en cada hamburguesa.",
    href: "https://burgerlemonde.com",
    dominio: "burgerlemonde.com",
  },
];

export default function Proyectos() {
  return (
    <section id="proyectos" className="border-t border-ink/10 bg-paper-dim">
      <div className="mx-auto max-w-5xl px-6 py-20">
        <p className="text-sm font-semibold uppercase tracking-widest text-gold">Otros negocios</p>
        <h2 className="mt-2 font-serif text-3xl text-ink sm:text-4xl">Proyectos</h2>
        <p className="mt-3 max-w-xl text-ink/70">
          Además de la consultoría y el coaching, esto es lo que estoy construyendo.
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {proyectos.map((p) => (
            <a
              key={p.nombre}
              href={p.href}
              target="_blank"
              rel="noreferrer"
              className="group flex flex-col rounded-2xl border border-ink/10 bg-paper p-8 transition-colors hover:border-gold"
            >
              <span className="text-xs font-semibold uppercase tracking-wide text-gold-light">
                {p.categoria}
              </span>
              <h3 className="mt-2 font-serif text-2xl text-ink">{p.nombre}</h3>
              <p className="mt-3 flex-1 text-sm text-ink/70">{p.detalle}</p>
              <span className="mt-6 text-sm font-semibold text-ink underline decoration-gold decoration-2 underline-offset-4 group-hover:text-gold">
                {p.dominio} →
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
