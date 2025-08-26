"use client"

import { useEffect, useState } from "react"
import type { Doc } from "@/lib/types"
import {
  listMedicalFiles,
  deleteMedicalFile,
  getSignedUrl,
  // importe aqui a sua função de upload já existente:
  // uploadMedicalFile,
} from "@/lib/storage"
import UploadBox from "@/components/UploadBox"

export default function DashboardPage() {
  const [busy, setBusy] = useState(false)
  const [docs, setDocs] = useState<Doc[]>([])

  async function refresh() {
    const items = await listMedicalFiles()
    setDocs(items)
  }

  useEffect(() => {
    refresh()
  }, [])

  const onUpload = async (file: File, category: Doc["category"]) => {
    try {
      setBusy(true)
      // Chame sua função de upload existente.
      // Ela deve inserir na tabela "documents" e salvar arquivo no storage.
      // Exemplo se o nome for `uploadMedicalFile`:
      // await uploadMedicalFile(file, category)

      await refresh()
    } finally {
      setBusy(false)
    }
  }

  const onDelete = async (doc: Doc) => {
    if (!confirm("Apagar este documento?")) return
    try {
      setBusy(true)
      await deleteMedicalFile(doc.id, doc.storage_path)
      await refresh()
    } finally {
      setBusy(false)
    }
  }

  const onDownload = async (doc: Doc) => {
    const url = await getSignedUrl(doc.storage_path)
    window.open(url, "_blank")
  }

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">CheckVital</h1>

      <section className="mb-8">
        <UploadBox busy={busy} onUpload={onUpload} />
      </section>

      <section className="space-y-4">
        {docs.length === 0 ? (
          <p className="text-gray-600">Nenhum documento enviado.</p>
        ) : (
          docs.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between rounded-xl border p-4"
            >
              <div className="min-w-0">
                <p className="font-medium truncate">{doc.name}</p>
                <p className="text-sm text-gray-600">
                  {doc.category} • {(doc.size_bytes / 1024).toFixed(1)} KB •{" "}
                  {new Date(doc.created_at).toLocaleDateString("pt-BR")}
                </p>
              </div>

              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => onDownload(doc)}
                  className="px-3 py-1 rounded-md border"
                >
                  Baixar
                </button>
                <button
                  onClick={() => onDelete(doc)}
                  className="px-3 py-1 rounded-md border text-red-600"
                  disabled={busy}
                >
                  Apagar
                </button>
              </div>
            </div>
          ))
        )}
      </section>
    </main>
  )
}
