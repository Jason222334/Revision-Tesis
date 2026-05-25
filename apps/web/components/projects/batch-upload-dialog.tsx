"use client"

import { useState } from "react"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Upload, Loader2, Files, X, FileText } from "lucide-react"

export function BatchUploadDialog() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [files, setFiles] = useState<File[]>([])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setFiles(prev => [...prev, ...newFiles])
    }
  }

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (files.length === 0) return

    setLoading(true)
    // Simular carga
    setTimeout(() => {
      setLoading(false)
      setOpen(false)
      setFiles([])
      alert("Simulación: Se han enviado " + files.length + " archivos para revisión en bloque.")
    }, 2000)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="secondary" className="gap-2">
            <Files className="h-4 w-4" /> BLOQUES
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Revisión en Bloque (Multi-archivo)</DialogTitle>
          <DialogDescription>
            Sube múltiples documentos para que la IA los analice simultáneamente. Ideal para revisar capítulos separados.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Documentos de Tesis</Label>
            <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-muted/50 transition-colors relative">
              <input 
                type="file" 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                accept=".pdf,.doc,.docx"
                multiple
                onChange={handleFileChange}
              />
              <Upload className="h-8 w-8 text-muted-foreground mb-1" />
              <span className="text-sm font-medium">Arrastra o selecciona archivos</span>
              <p className="text-xs text-muted-foreground text-center">Puedes seleccionar varios archivos PDF o Word a la vez.</p>
            </div>
          </div>

          {files.length > 0 && (
            <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
              <p className="text-xs font-bold uppercase text-muted-foreground">Archivos seleccionados ({files.length})</p>
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted/30 rounded border text-sm">
                  <div className="flex items-center gap-2 truncate">
                    <FileText className="h-4 w-4 text-primary shrink-0" />
                    <span className="truncate">{file.name}</span>
                    <span className="text-[10px] text-muted-foreground shrink-0">({(file.size / 1024).toFixed(1)} KB)</span>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => removeFile(index)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <DialogFooter>
            <Button type="submit" disabled={loading || files.length === 0} className="w-full">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Iniciar Revisión Masiva
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
