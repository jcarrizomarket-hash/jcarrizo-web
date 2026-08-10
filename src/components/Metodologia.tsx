const factores = [
  {
    letra: "C",
    palabra: "Conocimiento",
    detalle: "Suma. Cuanto más conocimiento incorporamos, más lejos llegamos.",
  },
  {
    letra: "E",
    palabra: "Experiencia",
    detalle: "Suma. Poner el conocimiento en práctica aumenta la capacidad de resolver.",
  },
  {
    letra: "A",
    palabra: "Actitud",
    detalle: "Multiplica. La actitud frente al conocimiento y la experiencia define qué tan lejos llegan.",
  },
];

export default function Metodologia() {
  return (
    <section id="metodologia" className="border-t border-ink/10 bg-paper-dim/60">
      <div className="mx-auto max-w-5xl px-6 py-20">
        <p className="text-sm font-semibold uppercase tracking-widest text-gold">El método</p>
        <h2 className="mt-2 font-serif text-3xl text-ink sm:text-4xl">C + E × A = Futuro Deseado</h2>
        <p className="mt-4 max-w-2xl text-ink/70">
          Es la fórmula que uso como base para pensar el desarrollo del liderazgo, personal u
          organizacional: el conocimiento y la experiencia se acumulan, pero es la actitud la que
          multiplica —o divide— el resultado.
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {factores.map((f) => (
            <div key={f.letra} className="rounded-2xl border border-ink/10 bg-paper p-6">
              <span className="font-serif text-4xl text-gold">{f.letra}</span>
              <h3 className="mt-3 text-lg font-semibold text-ink">{f.palabra}</h3>
              <p className="mt-2 text-sm text-ink/60">{f.detalle}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
