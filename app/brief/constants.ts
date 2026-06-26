import {
  Building2,
  Sparkles,
  Package,
  Palette,
  ListChecks,
  type LucideIcon,
} from "lucide-react";
import type { BriefData, Step } from "./types";

export const PAQUETES = [
  {
    id: "vitrina",
    nombre: "Web Vitrina",
    desc: "Presencia profesional, lista para representar al negocio.",
  },
  {
    id: "plus",
    nombre: "Web PLUS",
    desc: "Pensada para captar y convertir clientes.",
  },
  {
    id: "premium",
    nombre: "Web Premium",
    desc: "Automatización completa y crecimiento agresivo.",
  },
  {
    id: "indeciso",
    nombre: "Aún no lo decido",
    desc: "Lo definimos juntos según tus objetivos.",
  },
] as const;

export const STEPS: (Step & { icon: LucideIcon })[] = [
  { key: "identidad", label: "Identidad", icon: Building2 },
  { key: "negocio", label: "El negocio", icon: Sparkles },
  { key: "paquete", label: "Paquete", icon: Package },
  { key: "marca", label: "Marca", icon: Palette },
  { key: "necesidades", label: "Necesidades", icon: ListChecks },
];

export const EMPTY_BRIEF: BriefData = {
  negocio: "",
  contacto: "",
  whatsapp: "",
  correo: "",
  ubicacion: "",
  sucursales: "",
  ubicacionSucursales: "",
  descripcion: "",
  antiguedad: "",
  diferenciador: "",
  paquete: "",
  logo: "",
  logoFile: null,
  colores: "",
  redes: "",
  funcionesExtra: "",
};
