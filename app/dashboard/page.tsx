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
  const [category, setCategory] = useState<'exame'|'receita'|'vacina'|'outro'>('exame')

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
    setBusy(True)
  }
