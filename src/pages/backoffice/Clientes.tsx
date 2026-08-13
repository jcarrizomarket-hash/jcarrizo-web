import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabase";
import { ORIGEN_LABELS, nombreCompleto, type Cliente } from "../../lib/backoffice-types";

export default function Clientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [proyecto, setProyecto] = useState("todos");

  useEffect(() => {
    supabase
      .from("clientes")
      .select("*")
      .order("fecha_conversion", { ascending: false })
      .then(({ data }) => {
        setClientes((data as Cliente[]) ?? []);
        setLoading(false);
      });
  }, []);

  const proyectos = useMemo(() => Array.from(new Set(clientes.map((c) => c.proyecto))), [clientes]);
  const visibles = useMemo(
    () => (proyecto === "todos" ? clientes : clientes.filter((c) => c.proyecto === proyecto)),
    [clientes, proyecto],
  );

  const porProyecto = useMemo(() => {
    const grupos = new Map<string, Cliente[]>();
    for (const c of visibles) {
      const lista = grupos.get(c.proyecto) ?? [];
      lista.push(c);
      grupos.set(c.proyecto, lista);
    }
    return grupos;
  }, [visibles]);

  return (
    <div className="px-8 py-8">
      <div>
        <h1 className="font-serif text-2xl text-ink">Clientes</h1>
        <p className="mt-1 text-sm text-ink/60">
          {visibles.length} de {clientes.length} clientes, agrupados por proyecto
        </p>
      </div>

      <div className="mt-6">
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
      </div>

      {loading ? (
        <p className="mt-10 text-sm text-ink/50">Cargando...</p>
      ) : visibles.length === 0 ? (
        <p className="mt-10 text-sm text-ink/50">
          Todavía no hay clientes. Se cargan convirtiendo un lead desde la sección Leads.
        </p>
      ) : (
        <div className="mt-6 space-y-10">
          {Array.from(porProyecto.entries()).map(([proy, lista]) => (
            <div key={proy}>
              <h2 className="text-xs font-semibold uppercase tracking-wide text-ink/40">
                {ORIGEN_LABELS[proy] ?? proy}
              </h2>
              <div className="mt-3 space-y-3">
                {lista.map((c) => (
                  <div key={c.id} className="rounded-2xl border border-line bg-paper p-5">
                    <span className="font-semibold text-ink">{nombreCompleto(c.nombre, c.apellido)}</span>
                    <p className="mt-1 text-sm text-ink/60">
                      {c.email}
                      {c.telefono ? ` · ${c.telefono}` : ""}
                    </p>
                    <p className="mt-3 text-xs text-ink/40">
                      Cliente desde{" "}
                      {new Date(c.fecha_conversion).toLocaleDateString("es-AR", { dateStyle: "medium" })}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
