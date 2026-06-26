export type BriefData = {
  // identidad
  negocio: string;
  contacto: string;
  whatsapp: string;
  correo: string;
  ubicacion: string;
  sucursales: string;
  ubicacionSucursales: string;
  // negocio
  descripcion: string;
  antiguedad: string;
  diferenciador: string;
  // paquete
  paquete: string;
  // marca
  logo: string;
  logoFile: string | null;
  colores: string;
  redes: string;
  // necesidades
  funcionesExtra: string;
};

export type BriefErrors = Partial<Record<keyof BriefData, true>>;

export type StepKey =
  | "identidad"
  | "negocio"
  | "paquete"
  | "marca"
  | "necesidades";

export type Step = {
  key: StepKey;
  label: string;
};
