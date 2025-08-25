'use client'
import { useRef, useState } from "react"

type Props = {
  busy?: boolean
  onUpload: (file: File, category: "exame" | "receita" | "vacina" | "outro") => Promise<void> | void
}

export default function UploadBox({ busy, onUpload }: Props) {
  const [category, setCategory] = useState<"exame" | "receita" | "vacina" | "outro">("exame")
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)

  function handleFiles(files?: FileList | null) {
    const file = files?.[0]
    if (!file || busy) return
    onUpload(file, category)
  }

  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <p className="text-sm text-gray-600">Envie seus documentos médicos e organize por categoria.</p>

      <div className="mt-3 flex items-center gap-2">
        <select
          className="rounded-lg border px-3 py-2 text-sm"
          value={category}
          onChange={(e) => setCategory(e.target.value as any)}
          disabled={busy}
        >
          <option value="exame">Exame</option>
          <option value="receita">Receita</option>
          <option value="vacina">Vacina</option>
          <option value="outro">Outro</option>
        </select>

        <button
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className={`rounded-lg px-3 py-2 text-sm font-medium text-white ${
            busy ? "bg-emerald-400" : "bg-emerald-600 hover:bg-emerald-700"
          }`}
        >
          {busy ? "Enviando…" : "Escolher arquivo"}
        </button>

        <input
          ref={inputRef}
          type="file"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
          disabled={busy}
        />
      </div>

      {/* Drag & drop */}
      <div
        className={`mt-3 flex cursor-pointer items-center justify-center rounded-xl border-2 border-dashed p-6 text-center text-sm transition
          ${dragOver ? "border-blue-400 bg-blue-50" : "border-gray-300 hover:border-blue-300"}`}
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragOver(false)
          handleFiles(e.dataTransfer.files)
        }}
        onClick={() => inputRef.current?.click()}
      >
        <div>
          <div className="mb-1 text-2xl">📤</div>
          <p className="text-gray-600">Arraste ou clique para enviar</p>
        </div>
      </div>
    </div>
  )
}
