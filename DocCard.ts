'use client'

type Doc = {
  id: string
  file_name: string
  category: string
  size_bytes?: number
  created_at?: string
  storage_path: string
}

type Props = {
  doc: Doc
  onDownload: (storagePath: string) => Promise<void> | void
  onDelete: (doc: Doc) => Promise<void> | void
}

function formatBytes(n?: number) {
  if (!n || n <= 0) return "—"
  const units = ["B","KB","MB","GB"]
  let i = 0, v = n
  while (v >= 1024 && i < units.length - 1) { v /= 1024; i++ }
  return `${v.toFixed(1)} ${units[i]}`
}

export default function DocCard({ doc, onDownload, onDelete }: Props) {
  const date = doc.created_at ? new Date(doc.created_at) : null

  return (
    <article className="flex items-center justify-between rounded-xl border bg-white p-4 shadow-sm">
      <div className="min-w-0">
        <p className="truncate font-medium">📄 {doc.file_name}</p>
        <p className="truncate text-xs text-gray-500">
          {doc.category || "—"} • {formatBytes(doc.size_bytes)} {date ? `• ${date.toLocaleDateString()}` : ""}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onDownload(doc.storage_path)}
          className="rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50"
        >
          ⬇️ Baixar
        </button>
        <button
          onClick={() => onDelete(doc)}
          className="rounded-lg bg-red-50 px-3 py-1.5 text-sm text-red-600 hover:bg-red-100"
        >
          🗑️ Apagar
        </button>
      </div>
    </article>
  )
}
