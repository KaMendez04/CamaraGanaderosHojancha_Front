import { DocumentUploadVoluntarios } from "../../components/DocumentUploadVoluntarios"
import { NavigationButtons } from "../../components/NavigationButtons"
import { useMemo, useState } from "react"

export function Step3Organization(props: {
  files: any
  setFiles: (files: any) => void
  goPrev: () => void
  goNext: () => void
  isStepValid: () => boolean
}) {
  const { files, setFiles, goPrev, goNext } = props
  const [showErrors, setShowErrors] = useState(false)

  const missing = useMemo(
    () => ({
      legal: !files?.cedula,
      carta: !files?.carta,
    }),
    [files]
  )

  const disableNext = missing.legal || missing.carta

  const handleNext = () => {
    setShowErrors(true)
    if (disableNext) return
    goNext()
  }

  return (
    <div className="bg-white rounded-xl shadow-md border border-[#DCD6C9]">
      <div className="px-6 py-4 border-b border-[#DCD6C9] flex items-center space-x-2">
        <div className="w-8 h-8 bg-[#708C3E] rounded-full flex items-center justify-center text-white font-bold text-sm">
          3
        </div>
        <h3 className="text-lg font-semibold text-[#708C3E]">Documentos de la Organización</h3>
      </div>

      <DocumentUploadVoluntarios
        tipo="ORGANIZACION"
        files={files}
        setFiles={setFiles}
      />

      {showErrors && disableNext && (
        <div className="px-6 pb-2">
          <p className="text-sm text-[#9c1414] mt-1">
            Debes adjuntar el documento legal y la carta de motivación para continuar.
          </p>
        </div>
      )}

      <NavigationButtons onPrev={goPrev} onNext={handleNext} disableNext={disableNext} />
    </div>
  )
}