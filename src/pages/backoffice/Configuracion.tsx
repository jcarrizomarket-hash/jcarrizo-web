import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type Status = { mail: boolean; whatsapp: boolean };

function EstadoBanner({ ok, label, detalle }: { ok: boolean; label: string; detalle: string }) {
  return (
    <div className={`rounded-2xl border p-5 ${ok ? "border-green-200 bg-green-50" : "border-amber-300 bg-amber-50"}`}>
      <div className="flex items-center gap-2">
        <span className={`h-2.5 w-2.5 rounded-full ${ok ? "bg-green-500" : "bg-amber-500"}`} />
        <p className="font-semibold text-ink">{label}</p>
      </div>
      <p className={`mt-2 text-sm ${ok ? "text-green-800" : "text-amber-800"}`}>{detalle}</p>
    </div>
  );
}

export default function Configuracion() {
  const [status, setStatus] = useState<Status | null>(null);

  useEffect(() => {
    supabase.functions
      .invoke("backoffice-config-status")
      .then(({ data }) => setStatus(data as Status))
      .catch(() => setStatus({ mail: false, whatsapp: false }));
  }, []);

  return (
    <div className="px-8 py-8">
      <h1 className="font-serif text-2xl text-ink">Configuración</h1>
      <p className="mt-1 text-sm text-ink/60">
        Los usuarios del back office son de administración de José Luis únicamente. Las credenciales de
        mail y WhatsApp se cargan directo en Supabase, nunca desde acá.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {status === null ? (
          <p className="text-sm text-ink/50">Cargando estado...</p>
        ) : (
          <>
            <EstadoBanner
              ok={status.mail}
              label="Mail (Resend)"
              detalle={
                status.mail
                  ? "Conectado — el mail de la demo y otros avisos salen automáticamente."
                  : "No conectado. Cargar RESEND_API_KEY en Supabase → jcarrizo-leads → Edge Functions → Secrets."
              }
            />
            <EstadoBanner
              ok={status.whatsapp}
              label="WhatsApp"
              detalle={
                status.whatsapp
                  ? "Conectado."
                  : "Todavía no está armada la bandeja de WhatsApp del back office (próxima etapa)."
              }
            />
          </>
        )}
      </div>

      <div className="mt-10 rounded-2xl border border-line bg-paper-dim p-5">
        <p className="text-sm font-semibold text-ink">Usuarios</p>
        <p className="mt-2 text-sm text-ink/60">
          Acceso único, sin contraseña (magic link a jcarrizo.market@gmail.com). Si más adelante se suma
          gente al equipo, acá se arma la gestión de usuarios y roles.
        </p>
      </div>
    </div>
  );
}
