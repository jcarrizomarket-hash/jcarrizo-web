export type TipoEntidad = "empresa" | "autonomo" | "emprendedor";

export const ORIGEN_LABELS: Record<string, string> = {
  "jcarrizo.com": "jcarrizo.com",
  "crm.valeriatravels.com": "Valeria Travels CRM",
};

export const TIPO_ENTIDAD_LABELS: Record<TipoEntidad, string> = {
  empresa: "Empresa",
  autonomo: "Autónomo",
  emprendedor: "Emprendedor",
};

export type Lead = {
  id: string;
  created_at: string;
  nombre: string;
  apellido: string | null;
  email: string;
  telefono: string | null;
  tipo_entidad: TipoEntidad | null;
  cantidad_empleados: number | null;
  mensaje: string;
  origen: string;
  status: string;
};

export type Cliente = {
  id: string;
  created_at: string;
  lead_id: string | null;
  proyecto: string;
  nombre: string;
  apellido: string | null;
  email: string | null;
  telefono: string | null;
  empresa: string | null;
  tipo_entidad: TipoEntidad | null;
  cantidad_empleados: number | null;
  fecha_conversion: string;
  notas: string | null;
};

export type Seguimiento = {
  id: string;
  created_at: string;
  proyecto: string;
  lead_id: string | null;
  cliente_id: string | null;
  tipo: "llamada" | "whatsapp" | "mail" | "reunion" | "tarea";
  titulo: string;
  descripcion: string | null;
  fecha_vencimiento: string | null;
  estado: "pendiente" | "hecho";
};

export function nombreCompleto(nombre: string, apellido: string | null): string {
  return apellido ? `${nombre} ${apellido}` : nombre;
}

export type WhatsAppMensaje = {
  id: string;
  created_at: string;
  telefono: string;
  direccion: "entrante" | "saliente";
  texto: string;
  lead_id: string | null;
  cliente_id: string | null;
};
