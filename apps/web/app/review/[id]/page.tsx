import { auth } from "@/auth"
import { redirect, notFound } from "next/navigation"
import { ReviewPanel } from "@/components/review/review-panel"
import { DownloadReportButton } from "@/components/review/download-report-button"

async function getSubmissionData(id: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/submissions/${id}`, {
      cache: 'no-store'
    })
    if (!res.ok) return null
    return res.json()
  } catch (error) {
    return null
  }
}

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

export default async function ReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  const { id } = await params
  const submission = await getSubmissionData(id)

  if (!submission) {
    notFound()
  }

  // Si no hay evaluación real aún, mostramos una vacía o la simulamos
  const evaluation = submission.evaluation || {
    overallScore: 0,
    aiSummary: "El análisis de IA está pendiente o no se pudo completar.",
    findings: []
  }

  const documentUrl = await getFileUrl(submission.fileUrl)

  return (
    <div className="p-8 h-screen flex flex-col">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Revisión de Avance: {submission.fileUrl.split('/').pop()}</h1>
          <p className="text-gray-500 text-sm">
            Estudiante: {submission.project?.student?.name || 'Sistema'} | 
            Programa: {submission.project?.program?.name} | 
            Versión: {submission.version}
          </p>
        </div>
        <div className="flex gap-4">
          <DownloadReportButton submissionId={submission.id} />
        </div>
      </div>
      
      <ReviewPanel 
        submissionId={submission.id}
        documentUrl={documentUrl} 
        evaluation={evaluation} 
      />
    </div>
  )
}
