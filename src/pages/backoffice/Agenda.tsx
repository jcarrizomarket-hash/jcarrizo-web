import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabase";
import {
  ORIGEN_LABELS,
  nombreCompleto,
  type Cliente,
  type Lead,
  type Seguimiento,
} from "../../lib/backoffice-types";

const TIPO_LABELS: Record<Seguimiento["tipo"], string> = {
  llamada: "Llamada",
  whatsapp: "WhatsApp",
  mail: "Mail",
  reunion: "Reunión",
  tarea: "Tarea",
};

type Entidad = { tipo: "lead" | "cliente"; id: string; proyecto: string; nombre: string };

export default function Agenda() {
  const [seguimientos, setSeguimientos] = useState<Seguimiento[]>([]);
  const [entidades, setEntidades] = useState<Entidad[]>([]);
  const [loading, setLoading] = useState(true);
  const [proyecto, setProyecto] = useState("todos");
  const [estado, setEstado] = useState<"todos" | "pendiente" | "hecho">("pendiente");
  const [mostrarForm, setMostrarForm] = useState(false);

  useEffect(() => {
    cargar();
  }, []);

  async function cargar() {
    setLoading(true);
    const [{ data: segs }, { data: leads }, { data: clientes }] = await Promise.all([
      supabase.from("seguimientos").select("*").order("fecha_vencimiento", { ascending: true }),
      supabase.from("leads").select("id, origen, nombre, apellido"),
      supabase.from("clientes").select("id, proyecto, nombre, apellido"),
    ]);
    setSeguimientos((segs as Seguimiento[]) ?? []);
    const leadEntidades: Entidad[] = ((leads as Pick<Lead, "id" | "origen" | "nombre" | "apellido">[]) ?? []).map(
      (l) => ({ tipo: "lead", id: l.id, proyecto: l.origen, nombre: nombreCompleto(l.nombre, l.apellido) }),
    );
    const clienteEntidades: Entidad[] = (
      (clientes as Pick<Cliente, "id" | "proyecto" | "nombre" | "apellido">[]) ?? []
    ).map((c) => ({ tipo: "cliente", id: c.id, proyecto: c.proyecto, nombre: nombreCompleto(c.nombre, c.apellido) }));
    setEntidades([...leadEntidades, ...clienteEntidades]);
    setLoading(false);
  }

  async function marcarHecho(id: string, estadoNuevo: "pendiente" | "hecho") {
    setSeguimientos((prev) => prev.map((s) => (s.id === id ? { ...s, estado: estadoNuevo } : s)));
    await supabase.from("seguimientos").update({ estado: estadoNuevo }).eq("id", id);
  }

  const proyectos = useMemo(() => Array.from(new Set(seguimientos.map((s) => s.proyecto))), [seguimientos]);
  const visibles = useMemo(() => {
    return seguimientos.filter((s) => {
      if (proyecto !== "todos" && s.proyecto !== proyecto) return false;
      if (estado !== "todos" && s.estado !== estado) return false;
      return true;
    });
  }, [seguimientos, proyecto, estado]);

  const hoy = new Date();

  return (
    <div className="px-8 py-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl text-ink">Agenda de seguimiento</h1>
          <p className="mt-1 text-sm text-ink/60">Vista 360° de leads y clientes de todos los proyectos</p>
        </div>
        <button
          onClick={() => setMostrarForm((v) => !v)}
          className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-paper hover:bg-gold"
        >
          {mostrarForm ? "Cancelar" : "+ Nuevo seguimiento"}
        </button>
      </div>

      {mostrarForm && (
        <NuevoSeguimientoForm
          entidades={entidades}
          onCreated={() => {
            setMostrarForm(false);
            cargar();
          }}
        />
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        <select
          value={proyecto}
          onChange={(e) => setProyecto(e.target.value)}
          className="rounded-lg border border-ink/15 bg-paper px-3 py-2 text-sm text-ink/80 outline-none focus:border-gold"
        >
          <option value="todos">Todos los proyectos</option>
          {proyectos.map((p) => (
            <option key={p} value={p}>
              {ORIGEN_LABELS[p] ?? p}
            </option>
          ))}
        </select>
        <select
          value={estado}
          onChange={(e) => setEstado(e.target.value as typeof estado)}
          className="rounded-lg border border-ink/15 bg-paper px-3 py-2 text-sm text-ink/80 outline-none focus:border-gold"
        >
          <option value="pendiente">Pendientes</option>
          <option value="hecho">Hechos</option>
          <option value="todos">Todos</option>
        </select>
      </div>

      {loading ? (
        <p className="mt-10 text-sm text-ink/50">Cargando...</p>
      ) : visibles.length === 0 ? (
        <p className="mt-10 text-sm text-ink/50">No hay seguimientos con estos filtros.</p>
      ) : (
        <div className="mt-6 space-y-3">
          {visibles.map((s) => {
            const vencido =
              s.estado === "pendiente" && s.fecha_vencimiento && new Date(s.fecha_vencimiento) < hoy;
            return (
              <div
                key={s.id}
                className={`rounded-2xl border p-5 ${vencido ? "border-red-300 bg-red-50/40" : "border-line bg-paper"}`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-ink">{s.titulo}</span>
                      <span className="rounded-full bg-paper-dim px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-ink/50">
                        {TIPO_LABELS[s.tipo]}
                      </span>
                      <span className="rounded-full bg-paper-dim px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-ink/50">
                        {ORIGEN_LABELS[s.proyecto] ?? s.proyecto}
                      </span>
                      {vencido && (
                        <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-red-700">
                          Vencido
                        </span>
                      )}
                    </div>
                    {s.descripcion && <p className="mt-2 text-sm text-ink/70">{s.descripcion}</p>}
                    {s.fecha_vencimiento && (
                      <p className="mt-2 text-xs text-ink/40">
                        Vence{" "}
                        {new Date(s.fecha_vencimiento).toLocaleString("es-AR", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => marcarHecho(s.id, s.estado === "hecho" ? "pendiente" : "hecho")}
                    className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                      s.estado === "hecho"
                        ? "border-ink/15 text-ink/50 hover:bg-ink/5"
                        : "border-gold/40 text-gold hover:bg-gold/10"
                    }`}
                  >
                    {s.estado === "hecho" ? "Reabrir" : "Marcar hecho"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function NuevoSeguimientoForm({
  entidades,
  onCreated,
}: {
  entidades: Entidad[];
  onCreated: () => void;
}) {
  const [entidadKey, setEntidadKey] = useState("");
  const [tipo, setTipo] = useState<Seguimiento["tipo"]>("tarea");
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fechaVencimiento, setFechaVencimiento] = useState("");
  const [guardando, setGuardando] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const entidad = entidades.find((en) => `${en.tipo}:${en.id}` === entidadKey);
    if (!entidad || !titulo.trim()) return;
    setGuardando(true);
    await supabase.from("seguimientos").insert({
      proyecto: entidad.proyecto,
      lead_id: entidad.tipo === "lead" ? entidad.id : null,
      cliente_id: entidad.tipo === "cliente" ? entidad.id : null,
      tipo,
      titulo,
      descripcion: descripcion || null,
      fecha_vencimiento: fechaVencimiento || null,
    });
    setGuardando(false);
    onCreated();
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-3 rounded-2xl border border-line bg-paper-dim p-5">
      <div className="grid gap-3 sm:grid-cols-2">
        <select
          required
          value={entidadKey}
          onChange={(e) => setEntidadKey(e.target.value)}
          className="rounded-lg border border-ink/15 bg-paper px-3 py-2 text-sm outline-none focus:border-gold"
        >
          <option value="">Lead o cliente...</option>
          {entidades.map((en) => (
            <option key={`${en.tipo}:${en.id}`} value={`${en.tipo}:${en.id}`}>
              {en.nombre} ({ORIGEN_LABELS[en.proyecto] ?? en.proyecto}
              {en.tipo === "cliente" ? " · cliente" : ""})
            </option>
          ))}
        </select>
        <select
          value={tipo}
          onChange={(e) => setTipo(e.target.value as Seguimiento["tipo"])}
          className="rounded-lg border border-ink/15 bg-paper px-3 py-2 text-sm outline-none focus:border-gold"
        >
          {Object.entries(TIPO_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
      <input
        type="text"
        required
        placeholder="Título"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        className="w-full rounded-lg border border-ink/15 bg-paper px-3 py-2 text-sm outline-none focus:border-gold"
      />
      <textarea
        placeholder="Descripción (opcional)"
        rows={2}
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        className="w-full rounded-lg border border-ink/15 bg-paper px-3 py-2 text-sm outline-none focus:border-gold"
      />
      <input
        type="datetime-local"
        value={fechaVencimiento}
        onChange={(e) => setFechaVencimiento(e.target.value)}
        className="rounded-lg border border-ink/15 bg-paper px-3 py-2 text-sm outline-none focus:border-gold"
      />
      <button
        type="submit"
        disabled={guardando}
        className="rounded-full bg-ink px-5 py-2 text-sm font-semibold text-paper hover:bg-gold disabled:opacity-60"
      >
        {guardando ? "Guardando..." : "Crear seguimiento"}
      </button>
    </form>
  );
}
