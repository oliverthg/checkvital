import type { Doc } from "./types"

import { supabaseBrowser } from '@/lib/supabaseClient'

export async function uploadMedicalFile(file: File, category: string) {
  const supabase = supabaseBrowser()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Não autenticado')

  const ext = file.name.split('.').pop() || 'bin'
  const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const up = await supabase.storage.from('medical_docs').upload(path, file, {
    cacheControl: '3600', upsert: false, contentType: file.type || 'application/octet-stream'
  })
  if (up.error) throw up.error

  const ins = await supabase.from('documents').insert({
    user_id: user.id,
    category,
    file_name: file.name,
    storage_path: path,
    mime_type: file.type,
    size_bytes: file.size,
  }).select().single()
  if (ins.error) {
    await supabase.storage.from('medical_docs').remove([path])
    throw ins.error
  }
  return ins.data
}

export async function listMedicalFiles() {
  const supabase = supabaseBrowser()
  const { data, error } = await supabase.from('documents').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function deleteMedicalFile(id: string, storagePath: string) {
  const supabase = supabaseBrowser()
  const del = await supabase.from('documents').delete().eq('id', id)
  if (del.error) throw del.error
  const st = await supabase.storage.from('medical_docs').remove([storagePath])
  if (st.error) throw st.error
}

export async function getSignedUrl(storagePath: string) {
  const supabase = supabaseBrowser()
  const { data, error } = await supabase
    .storage
    .from('medical_docs')
    .createSignedUrl(storagePath, 60 * 5)
  if (error) throw error
  return data.signedUrl
}
