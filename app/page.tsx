export default function Home() {
  return (
    <div className="space-y-4">
      <img src="/checkvital-logo.svg" alt="CheckVital" className="h-10" />
      <h1 className="text-2xl font-semibold">Bem-vindo ao CheckVital</h1>
      <p className="text-gray-600">Guarde exames, receitas e vacinas com segurança.</p>
      <div className="flex gap-3">
        <a href="/sign-up" className="rounded bg-blue-600 px-4 py-2 text-white">Criar conta</a>
        <a href="/sign-in" className="rounded border px-4 py-2">Entrar</a>
      </div>
    </div>
  )
}
