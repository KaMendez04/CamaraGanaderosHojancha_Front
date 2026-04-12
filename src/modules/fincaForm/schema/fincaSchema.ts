import { z } from "zod";

// Schema para información básica de la finca
export const fincaBasicSchema = z.object({
  nombreFinca: z.string()
    .min(1, "El nombre de la finca es requerido")
    .max(100, "Máximo 100 caracteres"),

  areaHa: z.string()
    .min(1, "El área es requerida")
    .regex(/^\d+(\.\d{1,2})?$/, "Formato inválido (ej: 15.50)"),

  numeroPlano: z.string()
    .min(1, "El número de plano es requerido")
    .max(50, "Máximo 50 caracteres"),
});

// Schema para geografía
export const geografiaSchema = z.object({
  provincia: z.string()
    .min(1, "La provincia es requerida"),

  canton: z.string()
    .min(1, "El cantón es requerido"),

  distrito: z.string()
    .min(1, "El distrito es requerido"),

  caserio: z.string()
    .min(1, "El caserio es requerido")
    .max(100, "Máximo 100 caracteres")
    .or(z.literal("")),
});


// Campos del Propietario (solo se aplican si NO es el solicitante)
export const propietarioFieldsSchema = z.object({
  propietarioCedula: z.string().min(8, "Cédula del propietario debe tener al menos 8 dígitos").trim(),
  propietarioNombre: z.string().min(1, "Nombre del propietario es obligatorio").trim(),
  propietarioApellido1: z.string().min(1, "Primer apellido es obligatorio").trim(),
  propietarioApellido2: z.string().min(1, "Segundo apellido es obligatorio").trim(),
  propietarioTelefono: z.string().min(8, "Teléfono debe tener al menos 8 dígitos").trim(),
  propietarioEmail: z.string().email("Email inválido").trim(),
  propietarioFechaNacimiento: z.string()
    .min(1, "Fecha de nacimiento es obligatoria")
    .refine((fecha) => {
      if (!fecha) return false;

      const fechaNacimiento = new Date(fecha);
      const hoy = new Date();

      // Calcular edad
      let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
      const mesActual = hoy.getMonth();
      const mesNacimiento = fechaNacimiento.getMonth();

      // Ajustar si aún no ha cumplido años este año
      if (mesActual < mesNacimiento ||
        (mesActual === mesNacimiento && hoy.getDate() < fechaNacimiento.getDate())) {
        edad--;
      }

      return edad >= 18;
    }, {
      message: "El propietario debe ser mayor de 18 años"
    }),
  propietarioDireccion: z.string().optional(),
});


// Schema completo de finca
export const fincaCompleteSchema = z.object({
  ...fincaBasicSchema.shape,
  ...geografiaSchema.shape,
  ...propietarioFieldsSchema.shape,
});

export type FincaBasicValues = z.infer<typeof fincaBasicSchema>;
export type GeografiaValues = z.infer<typeof geografiaSchema>;
export type PropietarioValues = z.infer<typeof propietarioFieldsSchema>;
export type FincaCompleteValues = z.infer<typeof fincaCompleteSchema>;

//Hato Ganadero 

export const hatoItemSchema = z.object({
  animal: z
    .string()
    .min(1, "El nombre del animal es requerido")
    .max(75, "Máximo 75 caracteres"),

  edad: z.preprocess(
    (v) => (typeof v === "string" ? Number(v) : v),
    z.number().int().min(0, "La edad no puede ser negativa").max(110, "Edad excesiva")
  ),

  cantidad: z.preprocess(
    (v) => (typeof v === "string" ? Number(v) : v),
    z.number().int().min(1, "La cantidad debe ser al menos 1").max(999999, "La cantidad debe tener máximo 6 dígitos")
  ),
});

export const hatoGanaderoSchema = z
  .object({
    tipoExplotacion: z
      .string()
      .min(1, "Tipo de explotación requerida")
      .max(75, "Máximo 75 caracteres"),

    razaPredominante: z
      .string()
      .max(75, "Máximo 75 caracteres")
      .optional()
      .or(z.literal("")),

    hatoItems: z
      .array(hatoItemSchema)
      .min(1, "Agrega al menos un registro de animales")
      .max(200, "Demasiados registros"),
  });

export type HatoItemValues = z.infer<typeof hatoItemSchema>;
export type HatoGanaderoValues = z.infer<typeof hatoGanaderoSchema>;



// Un forraje
export const forrajeItemSchema = z.object({
  tipoForraje: z
    .string()
    .min(1, "El tipo de forraje es requerido")
    .max(75, "Máximo 75 caracteres"),

  // ✅ Solo letras (incluye tildes/ñ/ü) y espacios
  variedad: z
    .string()
    .min(1, "La variedad es requerida")
    .max(75, "Máximo 75 caracteres"),

  // Coerción robusta para evitar 'expected number, received NaN'
  hectareas: z.preprocess(
    (v) => {
      if (v === "" || v === null || v === undefined) return 0;
      const n = typeof v === "string" ? Number(v) : Number(v);
      return Number.isFinite(n) ? n : 0;
    },
    z
      .number()
      .positive("Las hectáreas deben ser mayores a 0")
      .max(100000, "Cantidad demasiado alta")
  ),

  // ✅ Solo letras (incluye tildes/ñ/ü) y espacios
  utilizacion: z
    .string()
    .min(1, "La utilización es requerida")
    .max(75, "Máximo 75 caracteres"),
});

// (opcional) lista
export const forrajeListSchema = z
  .array(forrajeItemSchema)
  .min(1, "Debe registrar al menos un tipo de forraje")
  .max(100, "Demasiados registros");

export type ForrajeItemValues = z.infer<typeof forrajeItemSchema>;

/* =========================================================
   🔹 Fuentes de agua y métodos de riego (Zod + requeridos)
   ========================================================= */

// Solo letras (incluye tildes/ñ/ü) y espacios
const soloLetrasRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/;

export const fuenteAguaItemSchema = z.object({
  nombre: z
    .string()
    .min(1, "La fuente de agua es requerida")
    .max(150, "Máximo 250 caracteres")
    .regex(soloLetrasRegex, "Solo letras y espacios"),
});

export const metodoRiegoItemSchema = z.object({
  tipo: z
    .string()
    .min(1, "El método de riego es requerido")
    .max(150, "Máximo 250 caracteres")
    .regex(soloLetrasRegex, "Solo letras y espacios"),
});

// Listas: ahora son REQUERIDAS
export const fuentesAguaListSchema = z
  .array(fuenteAguaItemSchema)
  .min(1, "Debe registrar al menos una fuente de agua")
  .max(200, "Demasiados elementos");

export const metodosRiegoListSchema = z
  .array(metodoRiegoItemSchema)
  .min(1, "Debe registrar al menos un método de riego")
  .max(200, "Demasiados elementos");
