import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'IntegridAI MCP Server',
  description: 'MCP Server for IntegridAI - Workflow tools para compliance Ley 27.401',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es-AR">
      <body>{children}</body>
    </html>
  )
}