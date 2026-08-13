import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabase";
import {
  ORIGEN_LABELS,
  TIPO_ENTIDAD_LABELS,
  nombreCompleto,
  type Lead,
} from "../../lib/backoffice-types";

export default function Leads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [proyecto, setProyecto] = useState("todos");
  const [tipoEntidad, setTipoEntidad] = useState("todos");
  const [busqueda, setBusqueda] = useState("");
  const [convirtiendo, setConvirtiendo] = useState<string | null>(null);

  useEffect(() => {
    cargar();
  }, []);

  async function cargar() {
    setLoading(true);
    const { data } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });
    setLeads((data as Lead[]) ?? []);
    setLoading(false);
  }

  async function marcarStatus(id: string, status: string) {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    await supabase.from("leads").update({ status }).eq("id", id);
  }

  async function convertirEnCliente(lead: Lead) {
    setConvirtiendo(lead.id);
    const { error } = await supabase.from("clientes").insert({
      lead_id: lead.id,
      proyecto: lead.origen,
      nombre: lead.nombre,
      apellido: lead.apellido,
      email: lead.email,
      telefono: lead.telefono,
      tipo_entidad: lead.tipo_entidad,
      cantidad_empleados: lead.cantidad_empleados,
    });
    if (!error) {
      await marcarStatus(lead.id, "cliente");
    }
    setConvirtiendo(null);
  }

  const proyectos = useMemo(() => Array.from(new Set(leads.map((l) => l.origen))), [leads]);

  const visibles = useMemo(() => {
    return leads.filter((l) => {
      if (proyecto !== "todos" && l.origen !== proyecto) return false;
      if (tipoEntidad !== "todos" && l.tipo_entidad !== tipoEntidad) return false;
      if (busqueda.trim()) {
        const q = busqueda.trim().toLowerCase();
        const texto = `${nombreCompleto(l.nombre, l.apellido)} ${l.email}`.toLowerCase();
        if (!texto.includes(q)) return false;
      }
      return true;
    });
  }, [leads, proyecto, tipoEntidad, busqueda]);

  return (
    <div className="px-8 py-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl text-ink">Leads</h1>
          <p className="mt-1 text-sm text-ink/60">
            {visibles.length} de {leads.length} leads
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Buscar por nombre o email..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-64 rounded-lg border border-ink/15 bg-paper px-3 py-2 text-sm outline-none focus:border-gold"
        />
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
          value={tipoEntidad}
          onChange={(e) => setTipoEntidad(e.target.value)}
          className="rounded-lg border border-ink/15 bg-paper px-3 py-2 text-sm text-ink/80 outline-none focus:border-gold"
        >
          <option value="todos">Empresa / autónomo / emprendedor</option>
          {Object.entries(TIPO_ENTIDAD_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="mt-10 text-sm text-ink/50">Cargando...</p>
      ) : visibles.length === 0 ? (
        <p className="mt-10 text-sm text-ink/50">No hay leads con estos filtros.</p>
      ) : (
        <div className="mt-6 space-y-3">
          {visibles.map((lead) => (
            <div key={lead.id} className="rounded-2xl border border-line bg-paper p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-ink">
                      {nombreCompleto(lead.nombre, lead.apellido)}
                    </span>
                    <span className="rounded-full bg-paper-dim px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-ink/50">
                      {ORIGEN_LABELS[lead.origen] ?? lead.origen}
                    </span>
                    {lead.tipo_entidad && (
                      <span className="rounded-full bg-gold/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-gold">
                        {TIPO_ENTIDAD_LABELS[lead.tipo_entidad]}
                        {lead.tipo_entidad === "empresa" && lead.cantidad_empleados
                          ? ` · ${lead.cantidad_empleados} empleados`
                          : ""}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-ink/60">
                    {lead.email}
                    {lead.telefono ? ` · ${lead.telefono}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={lead.status}
                    onChange={(e) => marcarStatus(lead.id, e.target.value)}
                    className="rounded-full border border-ink/15 bg-paper px-3 py-1 text-xs font-medium text-ink/70 outline-none"
                  >
                    <option value="nuevo">Nuevo</option>
                    <option value="contactado">Contactado</option>
                    <option value="cerrado">Cerrado</option>
                    <option value="cliente">Cliente</option>
                  </select>
                  {lead.status !== "cliente" && (
                    <button
                      onClick={() => convertirEnCliente(lead)}
                      disabled={convirtiendo === lead.id}
                      className="rounded-full border border-gold/40 px-3 py-1 text-xs font-semibold text-gold hover:bg-gold/10 disabled:opacity-50"
                    >
                      {convirtiendo === lead.id ? "Convirtiendo..." : "Convertir en cliente"}
                    </button>
                  )}
                </div>
              </div>
              <p className="mt-3 text-sm text-ink/80">{lead.mensaje}</p>
              <p className="mt-3 text-xs text-ink/40">
                {new Date(lead.created_at).toLocaleString("es-AR", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
