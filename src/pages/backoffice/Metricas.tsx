import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabase";
import { ORIGEN_LABELS, type Cliente, type Lead, type Seguimiento } from "../../lib/backoffice-types";

function inicioDeSemana(fecha: Date) {
  const d = new Date(fecha);
  const dia = (d.getDay() + 6) % 7; // lunes = 0
  d.setDate(d.getDate() - dia);
  d.setHours(0, 0, 0, 0);
  return d;
}

export default function Metricas() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [seguimientos, setSeguimientos] = useState<Seguimiento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      supabase.from("leads").select("*"),
      supabase.from("clientes").select("*"),
      supabase.from("seguimientos").select("*"),
    ]).then(([{ data: l }, { data: c }, { data: s }]) => {
      setLeads((l as Lead[]) ?? []);
      setClientes((c as Cliente[]) ?? []);
      setSeguimientos((s as Seguimiento[]) ?? []);
      setLoading(false);
    });
  }, []);

  const porProyecto = useMemo(() => {
    const proyectos = new Set<string>([...leads.map((l) => l.origen), ...clientes.map((c) => c.proyecto)]);
    return Array.from(proyectos).map((proyecto) => {
      const totalLeads = leads.filter((l) => l.origen === proyecto).length;
      const totalClientes = clientes.filter((c) => c.proyecto === proyecto).length;
      const conversion = totalLeads > 0 ? Math.round((totalClientes / totalLeads) * 100) : 0;
      return { proyecto, totalLeads, totalClientes, conversion };
    });
  }, [leads, clientes]);

  const porSemana = useMemo(() => {
    const semanas = new Map<string, number>();
    for (const lead of leads) {
      const inicio = inicioDeSemana(new Date(lead.created_at));
      const key = inicio.toLocaleDateString("es-AR", { day: "2-digit", month: "short" });
      semanas.set(key, (semanas.get(key) ?? 0) + 1);
    }
    return Array.from(semanas.entries())
      .sort((a, b) => (a[0] < b[0] ? -1 : 1))
      .slice(-8);
  }, [leads]);

  const seguimientosStats = useMemo(() => {
    const hoy = new Date();
    const pendientes = seguimientos.filter((s) => s.estado === "pendiente");
    const vencidos = pendientes.filter((s) => s.fecha_vencimiento && new Date(s.fecha_vencimiento) < hoy).length;
    return { pendientes: pendientes.length, vencidos, alDia: pendientes.length - vencidos };
  }, [seguimientos]);

  if (loading) {
    return (
      <div className="px-8 py-8">
        <p className="text-sm text-ink/50">Cargando...</p>
      </div>
    );
  }

  const maxSemana = Math.max(1, ...porSemana.map(([, n]) => n));

  return (
    <div className="px-8 py-8">
      <h1 className="font-serif text-2xl text-ink">Métricas</h1>

      <h2 className="mt-8 text-xs font-semibold uppercase tracking-wide text-ink/40">
        Conversión lead → cliente por proyecto
      </h2>
      <div className="mt-3 space-y-2">
        {porProyecto.map((p) => (
          <div key={p.proyecto} className="rounded-xl border border-line bg-paper px-5 py-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-ink">{ORIGEN_LABELS[p.proyecto] ?? p.proyecto}</span>
              <span className="text-sm text-ink/60">
                {p.totalClientes} de {p.totalLeads} leads · {p.conversion}%
              </span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-paper-dim">
              <div className="h-full rounded-full bg-gold" style={{ width: `${p.conversion}%` }} />
            </div>
          </div>
        ))}
        {porProyecto.length === 0 && <p className="text-sm text-ink/50">Todavía no hay datos.</p>}
      </div>

      <h2 className="mt-10 text-xs font-semibold uppercase tracking-wide text-ink/40">Leads por semana</h2>
      <div className="mt-3 flex items-end gap-3 rounded-2xl border border-line bg-paper p-5">
        {porSemana.map(([semana, n]) => (
          <div key={semana} className="flex flex-1 flex-col items-center gap-2">
            <div className="flex h-32 w-full items-end">
              <div
                className="w-full rounded-t-md bg-gold/70"
                style={{ height: `${(n / maxSemana) * 100}%` }}
                title={`${n} leads`}
              />
            </div>
            <span className="text-[11px] text-ink/50">{semana}</span>
          </div>
        ))}
        {porSemana.length === 0 && <p className="text-sm text-ink/50">Todavía no hay leads.</p>}
      </div>

      <h2 className="mt-10 text-xs font-semibold uppercase tracking-wide text-ink/40">Seguimientos pendientes</h2>
      <div className="mt-3 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-line bg-paper p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink/40">Al día</p>
          <p className="mt-2 text-3xl font-semibold text-ink">{seguimientosStats.alDia}</p>
        </div>
        <div
          className={`rounded-2xl border p-5 ${
            seguimientosStats.vencidos > 0 ? "border-red-300 bg-red-50/40" : "border-line bg-paper"
          }`}
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-ink/40">Vencidos</p>
          <p className={`mt-2 text-3xl font-semibold ${seguimientosStats.vencidos > 0 ? "text-red-700" : "text-ink"}`}>
            {seguimientosStats.vencidos}
          </p>
        </div>
      </div>
    </div>
  );
}
