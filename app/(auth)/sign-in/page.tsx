'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabaseBrowser } from '@/lib/supabaseClient'

export default function SignInPage() {
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
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) return setError(error.message)
    router.push('/dashboard')
  }

  return (
    <div className="mx-auto max-w-md p-6 bg-white rounded-2xl border shadow-sm">
      <h1 className="text-2xl font-semibold">Entrar</h1>
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <input type="email" required placeholder="seu@email.com"
               value={email} onChange={e=>setEmail(e.target.value)}
               className="w-full rounded border px-3 py-2" />
        <input type="password" required placeholder="Sua senha"
               value={password} onChange={e=>setPassword(e.target.value)}
               className="w-full rounded border px-3 py-2" />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button disabled={loading} className="w-full rounded bg-blue-600 px-4 py-2 font-medium text-white">
          {loading ? 'Entrando…' : 'Entrar'}
        </button>
      </form>
      <p className="mt-4 text-sm text-gray-600">Novo aqui? <a href="/sign-up" className="text-blue-600 underline">Criar conta</a></p>
    </div>
  )
}
