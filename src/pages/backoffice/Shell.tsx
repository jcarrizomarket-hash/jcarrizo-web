import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { NavLink, Outlet } from "react-router-dom";
import { supabase } from "../../lib/supabase";

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

const NAV_ITEMS = [
  { to: "/backoffice", label: "Dashboard", end: true },
  { to: "/backoffice/leads", label: "Leads" },
  { to: "/backoffice/clientes", label: "Clientes" },
  { to: "/backoffice/agenda", label: "Agenda" },
  { to: "/backoffice/metricas", label: "Métricas" },
  { to: "/backoffice/configuracion", label: "Configuración" },
];

function BackOfficeLayout() {
  return (
    <div className="flex min-h-screen">
      <aside className="w-56 shrink-0 border-r border-line bg-paper-dim px-4 py-6">
        <p className="px-2 font-serif text-lg text-ink">jcarrizo.com</p>
        <p className="px-2 text-xs uppercase tracking-wide text-ink/40">Back office</p>
        <nav className="mt-8 space-y-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive ? "bg-ink text-paper" : "text-ink/70 hover:bg-ink/5"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <button
          onClick={() => supabase.auth.signOut().then(() => window.location.reload())}
          className="mt-8 px-3 text-sm text-ink/50 hover:text-ink/80"
        >
          Cerrar sesión
        </button>
      </aside>
      <main className="min-w-0 flex-1 bg-paper">
        <Outlet />
      </main>
    </div>
  );
}

export default function Shell() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  if (session === undefined) return null;
  return session ? <BackOfficeLayout /> : <LoginForm />;
}
