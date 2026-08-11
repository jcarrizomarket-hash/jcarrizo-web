import { Link } from "react-router-dom";

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
    categoria: "CRM para agencias de viajes",
    detalle:
      "El CRM que ya usa una agencia real — leads, clientes, expedientes, cotizaciones, reservas y facturación, ahora también como producto para otras agencias.",
    href: "https://crm.valeriatravels.com",
    dominio: "crm.valeriatravels.com",
  },
  {
    nombre: "Burger Le Monde",
    categoria: "Restauración",
    detalle:
      "Hamburguesería gourmet en Castelldefels — sabores del mundo en cada hamburguesa.",
    href: "https://burgerlemonde.com",
    dominio: "burgerlemonde.com",
  },
  {
    nombre: "Club de Cruceros",
    categoria: "inCruises",
    detalle:
      "Socio de inCruises, el club de recompensas de viajes: ahorros en cruceros, hoteles y resorts, con precios transparentes y sin costos ocultos.",
    href: "/club-de-cruceros",
    dominio: "Ver más",
    externo: false,
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

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {proyectos.map((p) => {
            const cardClass =
              "group flex flex-col rounded-2xl border border-ink/10 bg-paper p-8 transition-colors hover:border-gold";
            const inner = (
              <>
                <span className="text-xs font-semibold uppercase tracking-wide text-gold-light">
                  {p.categoria}
                </span>
                <h3 className="mt-2 font-serif text-2xl text-ink">{p.nombre}</h3>
                <p className="mt-3 flex-1 text-sm text-ink/70">{p.detalle}</p>
                <span className="mt-6 text-sm font-semibold text-ink underline decoration-gold decoration-2 underline-offset-4 group-hover:text-gold">
                  {p.dominio} →
                </span>
              </>
            );
            return p.externo === false ? (
              <Link key={p.nombre} to={p.href} className={cardClass}>
                {inner}
              </Link>
            ) : (
              <a key={p.nombre} href={p.href} target="_blank" rel="noreferrer" className={cardClass}>
                {inner}
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
