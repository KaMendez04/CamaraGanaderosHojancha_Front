import { volunteerOrganizacionSchema } from "../schemas/volunteerSchema"

export function validateOrgStep1Required(form: any) {
  const v = form?.state?.values?.organizacion || {}
  const r = v?.representante || {}
  const p = r?.persona || {}
  const hasText = (value: any) => String(value ?? "").trim().length > 0

  const anyEmpty =
    !hasText(v.nombre) ||
    !v.numeroVoluntarios ||
    !hasText(v.cedulaJuridica) ||
    !hasText(v.tipoOrganizacion) ||
    !hasText(v.direccion) ||
    !hasText(v.telefono) ||
    !hasText(v.email) ||
    !hasText(r.cargo) ||
    !hasText(p.cedula) ||
    !hasText(p.nombre) ||
    !hasText(p.apellido1) ||
    !hasText(p.apellido2) ||
    !hasText(p.telefono) ||
    !hasText(p.email) ||
    !hasText(p.fechaNacimiento)

  const namesToValidate = [
    "organizacion.nombre",
    "organizacion.numeroVoluntarios",
    "organizacion.cedulaJuridica",
    "organizacion.tipoOrganizacion",
    "organizacion.direccion",
    "organizacion.telefono",
    "organizacion.email",
    "organizacion.representante.cargo",
    "organizacion.representante.persona.cedula",
    "organizacion.representante.persona.nombre",
    "organizacion.representante.persona.apellido1",
    "organizacion.representante.persona.apellido2",
    "organizacion.representante.persona.telefono",
    "organizacion.representante.persona.email",
    "organizacion.representante.persona.fechaNacimiento",
  ]

  namesToValidate.forEach((n) => form?.validateField?.(n, "change"))
  const hasFieldErrors = namesToValidate.some((name) => {
    const fieldMeta =
      form?.getFieldMeta?.(name) ??
      form?.state?.fieldMeta?.[name] ??
      form?.getFieldInfo?.(name)?.instance?.state?.meta
    const errors = fieldMeta?.errors
    return Array.isArray(errors) && errors.length > 0
  })

  const step1Schema = volunteerOrganizacionSchema.shape.organizacion.omit({
    razonesSociales: true,
    disponibilidades: true,
    areasInteres: true,
  })

  const schemaValidation = step1Schema.safeParse(v)

  const hasSchemaErrors = !schemaValidation.success
  const canContinue = !(anyEmpty || hasFieldErrors || hasSchemaErrors)

  return { anyEmpty, hasFieldErrors, hasSchemaErrors, canContinue }
}