const servicios = [
  {
    nombre: "Consultoría de liderazgo",
    para: "Equipos y organizaciones",
    detalle:
      "Trabajo con equipos y organizaciones que necesitan desarrollar liderazgo real, no solo roles de administración: gente que sepa guiar, no solo gestionar tareas.",
  },
  {
    nombre: "Coaching",
    para: "Personas",
    detalle:
      "Acompaño procesos individuales de liderazgo personal: mentalidad, lenguaje y actitud como palancas concretas para acercarte a tu futuro deseado.",
  },
];

export default function Servicios() {
  return (
    <section id="servicios" className="border-t border-ink/10">
      <div className="mx-auto max-w-5xl px-6 py-20">
        <p className="text-sm font-semibold uppercase tracking-widest text-gold">Cómo trabajo</p>
        <h2 className="mt-2 font-serif text-3xl text-ink sm:text-4xl">Servicios</h2>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {servicios.map((s) => (
            <div key={s.nombre} className="flex flex-col rounded-2xl border border-ink/10 p-8">
              <span className="text-xs font-semibold uppercase tracking-wide text-gold-light">
                {s.para}
              </span>
              <h3 className="mt-2 font-serif text-2xl text-ink">{s.nombre}</h3>
              <p className="mt-3 flex-1 text-ink/70">{s.detalle}</p>
              <a
                href="#contacto"
                className="mt-6 text-sm font-semibold text-ink underline decoration-gold decoration-2 underline-offset-4 hover:text-gold"
              >
                Contame tu caso →
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
