'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabaseBrowser } from '@/lib/supabaseClient'

export default function SignUpPage() {
  const router = useRouter()
  const supabase = supabaseBrowser()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const { error } = await supabase.auth.signUp({ email, password })
    setLoading(false)
    if (error) return setError(error.message)
    // For quick testing with email confirmation disabled
    router.push('/dashboard')
  }

  return (
    <div className="mx-auto max-w-md p-6 bg-white rounded-2xl border shadow-sm">
      <h1 className="text-2xl font-semibold">Criar conta</h1>
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <input type="email" required placeholder="seu@email.com"
               value={email} onChange={e=>setEmail(e.target.value)}
               className="w-full rounded border px-3 py-2" />
        <input type="password" required minLength={6} placeholder="Senha (mín. 6 caracteres)"
               value={password} onChange={e=>setPassword(e.target.value)}
               className="w-full rounded border px-3 py-2" />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button disabled={loading} className="w-full rounded bg-blue-600 px-4 py-2 font-medium text-white">
          {loading ? 'Criando…' : 'Criar conta'}
        </button>
      </form>
      <p className="mt-4 text-sm text-gray-600">Já tem conta? <a href="/sign-in" className="text-blue-600 underline">Entrar</a></p>
    </div>
  )
}
