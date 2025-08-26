// lib/storage.ts
import { supabaseBrowser } from "./supabaseClient" // (deixe como já está no seu projeto)
import type { Doc } from "./types"                 // <-- ADICIONE ESTA LINHA

// ... (sua função de upload que você já tem) ...

// Lista documentos
export async function listMedicalFiles(): Promise<Doc[]> {
  const supabase = supabaseBrowser()
  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) throw error
  return data as Doc[]
}

// Deleta documento + arquivo no storage
export async function deleteMedicalFile(id: string, storagePath: string): Promise<void> {
  const supabase = supabaseBrowser()

  const del = await supabase.from("documents").delete().eq("id", id)
  if (del.error) throw del.error

  const st = await supabase.storage.from("medical_docs").remove([storagePath])
  if (st.error) throw st.error
}

// Gera URL assinada (se você usa isso para download/preview)
export async function getSignedUrl(storagePath: string): Promise<string> {
  const supabase = supabaseBrowser()
  const { data, error } = await supabase
    .storage
    .from("medical_docs")
    .createSignedUrl(storagePath, 60 * 5)

  if (error) throw error
  return data.signedUrl
}
