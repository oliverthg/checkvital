'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabaseBrowser } from '@/lib/supabaseClient'
import { uploadMedicalFile, listMedicalFiles, deleteMedicalFile, getSignedUrl } from '@/lib/storage'

export default function DashboardPage() {
  const supabase = supabaseBrowser()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [docs, setDocs] = useState<any[]>([])
  const [busy, setBusy] = useState(false)
  const [category, setCategory] = useState<'exame' | 'receita' | 'vacina' | 'outro'>('exame')

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) router.push('/sign-in')
      else {
        setUser(data.user)
        await refresh()
      }
    })
  }, [])

  async function refresh() {
    const rows = await listMedicalFiles()
    setDocs(rows)
  }

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setBusy(true)
    try {
      await uploadMedicalFile(file, category)
      await refresh()
    } catch (e: any) {
      alert(e.message || 'Erro ao enviar')
    } finally {
      setBusy(false)
      e.currentTarget.value = ''
    }
  }

  async function onDelete(id: string, storagePath: string) {
    if (!confirm('Apagar este documento?')) return
    setBusy(true)
    try {
      await deleteMedicalFile(id, storagePath)
      await refresh()
    } catch (e: any) {
      alert(e.message || 'Erro ao apagar')
    } finally {
      setBusy(false)
    }
  }

  async function onDownload(storagePath: string) {
    try {
      const url = await getSignedUrl(storagePath)
      window.open(url, '_blank')
    } catch {
      alert('Falha ao gerar link de download')
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    router.push('/sign-in')
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-gray-50 p-4">
      <header className="sticky top-0 z-10 -mx-4 mb-4 border-b bg-white px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold">CheckVital</h1>
          <button onClick={signOut} className="rounded bg-red-600 px-3 py-1.5 text-sm text-white">
            Sair
          </button>
        </div>
        {user && <p className="mt-1 text-xs text-gray-500">{user.email}</p>}
      </header>

      <section className="rounded-2xl border bg-white p-4 shadow-sm">
        <p className="text-sm text-gray-600">Envie seus documentos médicos e organize por categoria.</p>
        <div className="mt-3 flex items-center gap-2">
          <select
            className="flex-1 rounded border px-3 py-2 text-sm"
            value={category}
            onChange={(e) => setCategory(e.target.value as any)}
          >
            <option value="exame">Exame</option>
            <option value="receita">Receita</option>
            <option value="vacina">Vacina</option>
            <option value="outro">Outro</option>
          </select>
          <label
            className={`cursor-pointer rounded bg-emerald-600 px-3 py-2 text-sm font-medium text-white ${
              busy ? 'opacity-60' : ''
            }`}
          >
            {busy ? 'Enviando…' : 'Enviar arquivo'}
            <input type="file" className="hidden" onChange={onUpload} disabled={busy} />
          </label>
        </div>
      </section>

      <section className="mt-4 space-y-2">
        {docs.length === 0 && <p className="text-center text-sm text-gray-500">Nenhum documento enviado.</p>}
        {docs.map((d) => (
          <article
            key={d.id}
            className="flex items-center justify-between rounded-xl border bg-white p-3 text-sm shadow-sm"
          >
            <div className="min-w-0">
              <p className="truncate font-medium">{d.file_name}</p>
              <p className="truncate text-xs text-gray-500">
                {d.category} • {(d.size_bytes / 1024).toFixed(1)} KB • {new Date(d.created_at).toLocaleDateString()}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button onClick={() => onDownload(d.storage_path)} className="rounded border px-2 py-1 hover:bg-gray-50">
                Baixar
              </button>
              <button
                onClick={() => onDelete(d.id, d.storage_path)}
                className="rounded bg-red-50 px-2 py-1 text-red-600 hover:bg-red-100"
              >
                Apagar
              </button>
            </div>
          </article>
        ))}
      </section>
    </div>
  )
}
