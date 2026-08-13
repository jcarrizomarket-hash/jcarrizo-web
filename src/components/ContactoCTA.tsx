import { useState, type FormEvent } from "react";
import { supabase } from "../lib/supabase";

type Estado = "idle" | "enviando" | "ok" | "error";

type TipoEntidad = "" | "empresa" | "autonomo" | "emprendedor";

export default function ContactoCTA() {
  const [estado, setEstado] = useState<Estado>("idle");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [tipoEntidad, setTipoEntidad] = useState<TipoEntidad>("");
  const [cantidadEmpleados, setCantidadEmpleados] = useState("");
  const [mensaje, setMensaje] = useState("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (estado === "enviando") return;
    setEstado("enviando");

    const { error } = await supabase.from("leads").insert({
      nombre,
      apellido: apellido || null,
      email,
      telefono: telefono || null,
      tipo_entidad: tipoEntidad || null,
      cantidad_empleados: tipoEntidad === "empresa" && cantidadEmpleados ? Number(cantidadEmpleados) : null,
      mensaje,
      origen: "jcarrizo.com",
    });

    if (error) {
      console.error("Error al guardar el lead:", error);
      setEstado("error");
      return;
    }

    setEstado("ok");
    setNombre("");
    setApellido("");
    setEmail("");
    setTelefono("");
    setTipoEntidad("");
    setCantidadEmpleados("");
    setMensaje("");
  }

  if (estado === "ok") {
    return (
      <section id="contacto" className="border-t border-ink/10">
        <div className="mx-auto max-w-3xl px-6 py-24 text-center">
          <h2 className="font-serif text-3xl text-ink sm:text-4xl">¡Gracias por escribir!</h2>
          <p className="mx-auto mt-4 max-w-xl text-ink/70">
            Recibí tu mensaje. Te voy a responder personalmente a la brevedad.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="contacto" className="border-t border-ink/10">
      <div className="mx-auto max-w-xl px-6 py-24">
        <div className="text-center">
          <h2 className="font-serif text-3xl text-ink sm:text-4xl">Hablemos de tu futuro deseado</h2>
          <p className="mx-auto mt-4 max-w-xl text-ink/70">
            Si querés charlar sobre un proceso de coaching o una consultoría de liderazgo para tu
            equipo, contame un poco y te respondo personalmente.
          </p>
        </div>

        <form onSubmit={onSubmit} className="mt-10 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              type="text"
              required
              placeholder="Nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="rounded-xl border border-ink/15 bg-paper px-4 py-3 text-sm outline-none transition-colors focus:border-gold"
            />
            <input
              type="text"
              placeholder="Apellido"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
              className="rounded-xl border border-ink/15 bg-paper px-4 py-3 text-sm outline-none transition-colors focus:border-gold"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-xl border border-ink/15 bg-paper px-4 py-3 text-sm outline-none transition-colors focus:border-gold"
            />
            <input
              type="tel"
              placeholder="Teléfono (opcional)"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              className="rounded-xl border border-ink/15 bg-paper px-4 py-3 text-sm outline-none transition-colors focus:border-gold"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <select
              value={tipoEntidad}
              onChange={(e) => setTipoEntidad(e.target.value as TipoEntidad)}
              className="rounded-xl border border-ink/15 bg-paper px-4 py-3 text-sm text-ink/80 outline-none transition-colors focus:border-gold"
            >
              <option value="">Empresa, autónomo o emprendedor (opcional)</option>
              <option value="empresa">Empresa</option>
              <option value="autonomo">Autónomo</option>
              <option value="emprendedor">Emprendedor</option>
            </select>
            {tipoEntidad === "empresa" && (
              <input
                type="number"
                min={1}
                placeholder="Cantidad de empleados"
                value={cantidadEmpleados}
                onChange={(e) => setCantidadEmpleados(e.target.value)}
                className="rounded-xl border border-ink/15 bg-paper px-4 py-3 text-sm outline-none transition-colors focus:border-gold"
              />
            )}
          </div>
          <textarea
            required
            placeholder="Contame en qué puedo ayudarte"
            rows={4}
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            className="w-full rounded-xl border border-ink/15 bg-paper px-4 py-3 text-sm outline-none transition-colors focus:border-gold"
          />

          {estado === "error" && (
            <p className="text-sm text-red-600">
              No se pudo enviar. Probá de nuevo, o escribime directo a{" "}
              <a href="mailto:info@jcarrizo.com" className="underline">
                info@jcarrizo.com
              </a>
              .
            </p>
          )}

          <button
            type="submit"
            disabled={estado === "enviando"}
            className="w-full rounded-full bg-ink px-8 py-4 text-sm font-semibold text-paper transition-colors hover:bg-gold disabled:opacity-60"
          >
            {estado === "enviando" ? "Enviando..." : "Enviar mensaje"}
          </button>
        </form>
      </div>
    </section>
  );
}
