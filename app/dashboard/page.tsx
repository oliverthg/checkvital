'use client'
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import UploadBox from "@/components/UploadBox"
import DocCard from "@/components/DocCard"

import { supabaseBrowser } from "@/lib/supabaseClient"
import { uploadMedicalFile, listMedicalFiles, deleteMedicalFile, getSignedUrl } from "@/lib/storage"

type Doc = {
  id: string
  file_name: string
  category: "exame" | "receita" | "vacina" | "outro"
  size_bytes?: number
  created_at?: string
  storage_path: string
}

export default function DashboardPage() {
  const supabase = supabaseBrowser()
  const router = useRouter()

  const [user, setUser] = useState<any>(null)
  const [docs, setDocs] = useState<Doc[]>([])
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) router.push("/sign-in")
      else {
        setUser(data.user)
        await refresh()
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function refresh() {
    const rows = await listMedicalFiles()
    setDocs(rows as any)
  }

  async function handleUpload(file: File, category: Doc["category"]) {
    setBusy(true)
    try {
      await uploadMedicalFile(file, category)
      await refresh()
    } catch (e: any) {
      alert(e.message || "Erro ao enviar")
    } finally {
      setBusy(false)
    }
  }

  async function onDelete(doc: Doc) {
    if (!confirm("Apagar este documento?")) return
    setBusy(true)
    try {
      await deleteMedicalFile(doc.id, doc.storage_path)
      await refresh()
    } catch (e: any) {
      alert(e.message || "Erro ao apagar")
    } finally {
      setBusy(false)
    }
  }

  async function onDownload(storagePath: string) {
    try {
      const url = await getSignedUrl(storagePath)
      window.open(url, "_blank")
    } catch {
      alert("Falha ao gerar link de download")
    }
  }

  async function signOut() {
    await supabase.auth.signOut()
    router.push("/sign-in")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">Logado como</p>
          <p className="text-sm font-medium">{user?.email}</p>
        </div>
        <button
          onClick={signOut}
          className="rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          Sair
        </button>
      </div>

      <UploadBox busy={busy} onUpload={handleUpload} />

      <section className="space-y-3">
        {docs.length === 0 && (
          <p className="text-center text-sm text-gray-500">Nenhum documento enviado.</p>
        )}
        {docs.map((d) => (
          <DocCard key={d.id} doc={d} onDownload={onDownload} onDelete={onDelete} />
        ))}
      </section>
    </div>
  )
}
