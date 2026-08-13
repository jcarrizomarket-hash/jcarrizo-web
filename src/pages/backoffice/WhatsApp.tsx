import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabase";
import { nombreCompleto, type Cliente, type Lead, type WhatsAppMensaje } from "../../lib/backoffice-types";

type Conversacion = {
  telefono: string;
  nombre: string | null;
  ultimoMensaje: WhatsAppMensaje;
  leadId: string | null;
  clienteId: string | null;
};

export default function WhatsApp() {
  const [mensajes, setMensajes] = useState<WhatsAppMensaje[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [configurado, setConfigurado] = useState<boolean | null>(null);
  const [telefonoActivo, setTelefonoActivo] = useState<string | null>(null);
  const [texto, setTexto] = useState("");
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    cargar();
    supabase.functions
      .invoke("backoffice-config-status")
      .then(({ data }) => setConfigurado(!!data?.whatsapp))
      .catch(() => setConfigurado(false));
  }, []);

  async function cargar() {
    setLoading(true);
    const [{ data: msgs }, { data: ls }, { data: cs }] = await Promise.all([
      supabase.from("whatsapp_mensajes").select("*").order("created_at", { ascending: true }),
      supabase.from("leads").select("*"),
      supabase.from("clientes").select("*"),
    ]);
    setMensajes((msgs as WhatsAppMensaje[]) ?? []);
    setLeads((ls as Lead[]) ?? []);
    setClientes((cs as Cliente[]) ?? []);
    setLoading(false);
  }

  const conversaciones = useMemo(() => {
    const porTelefono = new Map<string, WhatsAppMensaje[]>();
    for (const m of mensajes) {
      const lista = porTelefono.get(m.telefono) ?? [];
      lista.push(m);
      porTelefono.set(m.telefono, lista);
    }

    const lista: Conversacion[] = [];
    for (const [telefono, msgsDelNumero] of porTelefono.entries()) {
      const ultimoMensaje = msgsDelNumero[msgsDelNumero.length - 1];
      const lead = leads.find((l) => l.id === ultimoMensaje.lead_id);
      const cliente = clientes.find((c) => c.id === ultimoMensaje.cliente_id);
      const nombre = cliente
        ? nombreCompleto(cliente.nombre, cliente.apellido)
        : lead
          ? nombreCompleto(lead.nombre, lead.apellido)
          : null;
      lista.push({ telefono, nombre, ultimoMensaje, leadId: lead?.id ?? null, clienteId: cliente?.id ?? null });
    }
    return lista.sort(
      (a, b) => new Date(b.ultimoMensaje.created_at).getTime() - new Date(a.ultimoMensaje.created_at).getTime(),
    );
  }, [mensajes, leads, clientes]);

  const hiloActivo = useMemo(
    () => (telefonoActivo ? mensajes.filter((m) => m.telefono === telefonoActivo) : []),
    [mensajes, telefonoActivo],
  );
  const conversacionActiva = conversaciones.find((c) => c.telefono === telefonoActivo);

  async function enviarMensaje() {
    if (!telefonoActivo || !texto.trim()) return;
    setEnviando(true);
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const { error } = await supabase.functions.invoke("whatsapp-send", {
      body: {
        telefono: telefonoActivo,
        texto,
        leadId: conversacionActiva?.leadId ?? null,
        clienteId: conversacionActiva?.clienteId ?? null,
      },
      headers: { Authorization: `Bearer ${session?.access_token}` },
    });
    if (!error) {
      setTexto("");
      await cargar();
    }
    setEnviando(false);
  }

  return (
    <div className="flex h-full">
      <div className="w-80 shrink-0 border-r border-line overflow-y-auto">
        <div className="px-6 py-6">
          <h1 className="font-serif text-xl text-ink">WhatsApp</h1>
          {configurado === false && (
            <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
              Todavía no está conectado. Configurar en la sección Configuración.
            </p>
          )}
        </div>
        {loading ? (
          <p className="px-6 text-sm text-ink/50">Cargando...</p>
        ) : conversaciones.length === 0 ? (
          <p className="px-6 text-sm text-ink/50">No hay conversaciones todavía.</p>
        ) : (
          conversaciones.map((c) => (
            <button
              key={c.telefono}
              onClick={() => setTelefonoActivo(c.telefono)}
              className={`block w-full border-b border-line px-6 py-4 text-left ${
                telefonoActivo === c.telefono ? "bg-paper-dim" : "hover:bg-paper-dim/60"
              }`}
            >
              <p className="text-sm font-semibold text-ink">{c.nombre ?? `+${c.telefono}`}</p>
              {c.nombre && <p className="text-xs text-ink/40">+{c.telefono}</p>}
              <p className="mt-1 truncate text-xs text-ink/60">
                {c.ultimoMensaje.direccion === "saliente" ? "Vos: " : ""}
                {c.ultimoMensaje.texto}
              </p>
            </button>
          ))
        )}
      </div>

      <div className="flex flex-1 flex-col">
        {!telefonoActivo ? (
          <div className="flex flex-1 items-center justify-center text-sm text-ink/40">
            Elegí una conversación
          </div>
        ) : (
          <>
            <div className="border-b border-line px-6 py-4">
              <p className="font-semibold text-ink">{conversacionActiva?.nombre ?? `+${telefonoActivo}`}</p>
              <p className="text-xs text-ink/40">+{telefonoActivo}</p>
            </div>
            <div className="flex-1 space-y-2 overflow-y-auto px-6 py-4">
              {hiloActivo.map((m) => (
                <div key={m.id} className={`flex ${m.direccion === "saliente" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-md rounded-2xl px-4 py-2 text-sm ${
                      m.direccion === "saliente" ? "bg-ink text-paper" : "bg-paper-dim text-ink"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{m.texto}</p>
                    <p className={`mt-1 text-[10px] ${m.direccion === "saliente" ? "text-paper/50" : "text-ink/40"}`}>
                      {new Date(m.created_at).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2 border-t border-line px-6 py-4">
              <input
                type="text"
                placeholder={configurado ? "Escribí un mensaje..." : "WhatsApp no está conectado todavía"}
                value={texto}
                disabled={!configurado}
                onChange={(e) => setTexto(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && enviarMensaje()}
                className="flex-1 rounded-full border border-ink/15 bg-paper px-4 py-2 text-sm outline-none focus:border-gold disabled:opacity-50"
              />
              <button
                onClick={enviarMensaje}
                disabled={!configurado || enviando || !texto.trim()}
                className="rounded-full bg-ink px-5 py-2 text-sm font-semibold text-paper hover:bg-gold disabled:opacity-50"
              >
                {enviando ? "..." : "Enviar"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
