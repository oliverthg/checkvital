// lib/types.ts
export type Doc = {
  id: string
  name: string
  size_bytes: number
  category: "exame" | "receita" | "vacina" | "outro"
  created_at: string
  storage_path: string
  mime_type?: string | null
}
