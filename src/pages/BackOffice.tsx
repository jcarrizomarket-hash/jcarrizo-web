import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

type Lead = {
  id: string;
  created_at: string;
  nombre: string;
  email: string;
  telefono: string | null;
  mensaje: string;
  origen: string;
  status: string;
};

const ORIGEN_LABELS: Record<string, string> = {
  "jcarrizo.com": "jcarrizo.com",
  "crm.valeriatravels.com": "Valeria Travels CRM",
};

function LoginForm() {
  const [email, setEmail] = useState("");
  const [estado, setEstado] = useState<"idle" | "enviando" | "enviado" | "error">("idle");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEstado("enviando");
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/backoffice` },
    });
    setEstado(error ? "error" : "enviado");
  }

  if (estado === "enviado") {
    return (
      <div className="mx-auto max-w-sm px-6 py-32 text-center">
        <h1 className="font-serif text-2xl text-ink">Revisá tu email</h1>
        <p className="mt-3 text-sm text-ink/60">
          Te mandamos un link de acceso a {email}. Abrilo desde este mismo dispositivo.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-sm px-6 py-32">
      <h1 className="font-serif text-2xl text-ink">Back office</h1>
      <p className="mt-2 text-sm text-ink/60">Acceso solo para administración.</p>
      <form onSubmit={onSubmit} className="mt-8 space-y-3">
        <input
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border border-ink/15 bg-paper px-4 py-3 text-sm outline-none transition-colors focus:border-gold"
        />
        {estado === "error" && (
          <p className="text-sm text-red-600">No se pudo enviar el link. Probá de nuevo.</p>
        )}
        <button
          type="submit"
          disabled={estado === "enviando"}
          className="w-full rounded-full bg-ink px-6 py-3 text-sm font-semibold text-paper transition-colors hover:bg-gold disabled:opacity-60"
        >
          {estado === "enviando" ? "Enviando..." : "Enviarme el link de acceso"}
        </button>
      </form>
    </div>
  );
}

function LeadsTable() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState<string>("todos");

  useEffect(() => {
    supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setLeads((data as Lead[]) ?? []);
        setLoading(false);
      });
  }, []);

  async function marcarStatus(id: string, status: string) {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    await supabase.from("leads").update({ status }).eq("id", id);
  }

  const origenes = Array.from(new Set(leads.map((l) => l.origen)));
  const visibles = filtro === "todos" ? leads : leads.filter((l) => l.origen === filtro);

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl text-ink">Leads de todos los proyectos</h1>
          <p className="mt-1 text-sm text-ink/60">{visibles.length} de {leads.length} leads</p>
        </div>
        <button
          onClick={() => supabase.auth.signOut().then(() => window.location.reload())}
          className="rounded-full border border-ink/15 px-4 py-2 text-sm text-ink/70 hover:border-ink/30"
        >
          Cerrar sesión
        </button>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <button
          onClick={() => setFiltro("todos")}
          className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wide ${
            filtro === "todos" ? "bg-ink text-paper" : "bg-paper-dim text-ink/60"
          }`}
        >
          Todos
        </button>
        {origenes.map((o) => (
          <button
            key={o}
            onClick={() => setFiltro(o)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wide ${
              filtro === o ? "bg-ink text-paper" : "bg-paper-dim text-ink/60"
            }`}
          >
            {ORIGEN_LABELS[o] ?? o}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="mt-10 text-sm text-ink/50">Cargando...</p>
      ) : visibles.length === 0 ? (
        <p className="mt-10 text-sm text-ink/50">No hay leads todavía.</p>
      ) : (
        <div className="mt-8 space-y-3">
          {visibles.map((lead) => (
            <div key={lead.id} className="rounded-2xl border border-line bg-paper p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-ink">{lead.nombre}</span>
                    <span className="rounded-full bg-paper-dim px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-ink/50">
                      {ORIGEN_LABELS[lead.origen] ?? lead.origen}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-ink/60">
                    {lead.email}
                    {lead.telefono ? ` · ${lead.telefono}` : ""}
                  </p>
                </div>
                <select
                  value={lead.status}
                  onChange={(e) => marcarStatus(lead.id, e.target.value)}
                  className="rounded-full border border-ink/15 bg-paper px-3 py-1 text-xs font-medium text-ink/70 outline-none"
                >
                  <option value="nuevo">Nuevo</option>
                  <option value="contactado">Contactado</option>
                  <option value="cerrado">Cerrado</option>
                </select>
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

export default function BackOffice() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  if (session === undefined) return null;
  return session ? <LeadsTable /> : <LoginForm />;
}
