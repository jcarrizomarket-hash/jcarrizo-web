import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { ORIGEN_LABELS } from "../../lib/backoffice-types";

type Conteo = { proyecto: string; leads: number; clientes: number };

export default function Dashboard() {
  const [conteos, setConteos] = useState<Conteo[]>([]);
  const [seguimientosVencidos, setSeguimientosVencidos] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function cargar() {
      const [{ data: leads }, { data: clientes }, { data: seguimientos }] = await Promise.all([
        supabase.from("leads").select("origen"),
        supabase.from("clientes").select("proyecto"),
        supabase.from("seguimientos").select("proyecto, estado, fecha_vencimiento").eq("estado", "pendiente"),
      ]);

      const proyectos = new Set<string>();
      (leads ?? []).forEach((l) => proyectos.add(l.origen));
      (clientes ?? []).forEach((c) => proyectos.add(c.proyecto));

      const filas: Conteo[] = Array.from(proyectos).map((proyecto) => ({
        proyecto,
        leads: (leads ?? []).filter((l) => l.origen === proyecto).length,
        clientes: (clientes ?? []).filter((c) => c.proyecto === proyecto).length,
      }));
      setConteos(filas);

      const hoy = new Date();
      const vencidos = (seguimientos ?? []).filter(
        (s) => s.fecha_vencimiento && new Date(s.fecha_vencimiento) < hoy,
      ).length;
      setSeguimientosVencidos(vencidos);

      setLoading(false);
    }
    cargar();
  }, []);

  if (loading) {
    return (
      <div className="px-8 py-8">
        <p className="text-sm text-ink/50">Cargando...</p>
      </div>
    );
  }

  const totalLeads = conteos.reduce((acc, c) => acc + c.leads, 0);
  const totalClientes = conteos.reduce((acc, c) => acc + c.clientes, 0);

  return (
    <div className="px-8 py-8">
      <h1 className="font-serif text-2xl text-ink">Dashboard</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Stat label="Leads totales" value={totalLeads} />
        <Stat label="Clientes totales" value={totalClientes} />
        <Stat
          label="Seguimientos vencidos"
          value={seguimientosVencidos}
          highlight={seguimientosVencidos > 0}
          to="/backoffice/agenda"
        />
      </div>

      <h2 className="mt-10 text-xs font-semibold uppercase tracking-wide text-ink/40">Por proyecto</h2>
      <div className="mt-3 space-y-2">
        {conteos.map((c) => (
          <div
            key={c.proyecto}
            className="flex items-center justify-between rounded-xl border border-line bg-paper px-5 py-3"
          >
            <span className="text-sm font-medium text-ink">{ORIGEN_LABELS[c.proyecto] ?? c.proyecto}</span>
            <span className="text-sm text-ink/60">
              {c.leads} leads · {c.clientes} clientes
            </span>
          </div>
        ))}
        {conteos.length === 0 && <p className="text-sm text-ink/50">Todavía no hay datos.</p>}
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  highlight,
  to,
}: {
  label: string;
  value: number;
  highlight?: boolean;
  to?: string;
}) {
  const content = (
    <div
      className={`rounded-2xl border p-5 ${highlight ? "border-red-300 bg-red-50/40" : "border-line bg-paper"}`}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-ink/40">{label}</p>
      <p className={`mt-2 text-3xl font-semibold ${highlight ? "text-red-700" : "text-ink"}`}>{value}</p>
    </div>
  );
  return to ? <Link to={to}>{content}</Link> : content;
}
