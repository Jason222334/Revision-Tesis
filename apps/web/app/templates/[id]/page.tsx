import { auth } from "@/auth"
import { redirect, notFound } from "next/navigation"

async function getFileUrl(fileName: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reports/url?fileName=${encodeURIComponent(fileName)}`)
    if (!res.ok) return null
    const data = await res.json()
    return data.url
  } catch (error) {
    return null
  }
}

export default async function TemplateViewPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  const { id } = await params

  if (!session) {
    redirect("/login")
  }

  // Buscamos la info del patrón
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/templates/${id}`)
  if (!res.ok) notFound()
  const template = await res.json()

  const documentUrl = await getFileUrl(template.fileUrl)

  return (
    <div className="h-screen flex flex-col p-4 md:p-8 space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Vista Previa: {template.name}</h1>
          <p className="text-muted-foreground text-sm">Programa: {template.program?.name}</p>
        </div>
      </div>
      
      <div className="flex-1 border rounded-xl overflow-hidden bg-muted/20">
        {documentUrl ? (
          <iframe 
            src={`${documentUrl}#toolbar=0`} 
            className="w-full h-full border-none"
            title={template.name}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            No se pudo cargar la vista previa del documento patrón.
          </div>
        )}
      </div>
    </div>
  )
}
