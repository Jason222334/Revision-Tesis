"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FileDown, Loader2 } from "lucide-react"

interface DownloadReportButtonProps {
  submissionId: string
}

export function DownloadReportButton({ submissionId }: DownloadReportButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownload = async () => {
    setIsDownloading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reports/${submissionId}/download`)
      if (!response.ok) throw new Error("Error al generar el reporte")
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `reporte-revision-${submissionId}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error(error)
      alert("No se pudo descargar el reporte. Asegúrate de que la evaluación esté completa.")
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <Button 
      variant="outline" 
      onClick={handleDownload} 
      disabled={isDownloading}
      className="flex items-center gap-2 font-bold border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all"
    >
      {isDownloading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          GENERANDO PDF...
        </>
      ) : (
        <>
          <FileDown className="h-4 w-4" />
          DESCARGAR REPORTE PDF
        </>
      )}
    </Button>
  )
}
