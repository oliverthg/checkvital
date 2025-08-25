export const metadata = { title: 'CheckVital', description: 'Seus documentos médicos organizados' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <div className="mx-auto max-w-2xl p-6">{children}</div>
      </body>
    </html>
  )
}
