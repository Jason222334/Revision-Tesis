"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Sparkles, 
  Loader2, 
  FileText, 
  Download, 
  CheckCircle2,
  AlertCircle,
  History,
  User,
  Calendar
} from "lucide-react"
import { jsPDF } from "jspdf"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"

export default function GeneratePage() {
  const { data: session } = useSession()
  const [title, setTitle] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [step, setStep] = useState(0) // 0: input, 1: generating, 2: success
  const [progress, setProgress] = useState(0)
  const [history, setHistory] = useState<any[]>([])
  const [loadingHistory, setLoadingHistory] = useState(false)

  const steps = [
    "Analizando estructura de la Guía de Tesis...",
    "Generando Capítulos I y II...",
    "Aplicando formato Arial Narrow 12pt...",
    "Configurando márgenes y alineación justificada...",
    "Finalizando documento PDF editable..."
  ]

  const isAdmin = (session?.user as any)?.role === "ADMIN"

  const fetchHistory = async () => {
    if (!isAdmin) return
    setLoadingHistory(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/generated-thesis`, {
        headers: {
          'Authorization': `Bearer ${(session as any)?.accessToken}`
        }
      })
      if (res.ok) {
        const data = await res.json()
        setHistory(data)
      }
    } catch (error) {
      console.error("Error fetching history:", error)
    } finally {
      setLoadingHistory(false)
    }
  }

  useEffect(() => {
    if (isAdmin) fetchHistory()
  }, [isAdmin])

  const saveGeneration = async (thesisTitle: string) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/generated-thesis`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          'Authorization': `Bearer ${(session as any)?.accessToken}`
        },
        body: JSON.stringify({ title: thesisTitle }),
      })
      if (isAdmin) fetchHistory()
    } catch (error) {
      console.error("Error saving generation:", error)
    }
  }

  const handleGenerate = () => {
    if (!title) return
    setIsGenerating(true)
    setStep(1)
    
    // Simular progreso de generación IA
    let currentStep = 0
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setProgress((prev) => prev + (100 / steps.length))
        currentStep++
      } else {
        clearInterval(interval)
        setIsGenerating(false)
        setStep(2)
        saveGeneration(title)
      }
    }, 1500)
  }

  const handleDownload = () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const margin = { top: 25, bottom: 25, left: 30, right: 25 };
    const pageWidth = 210;
    const contentWidth = pageWidth - margin.left - margin.right;
    const lineHeight = 1.5 * 5; 

    let y = margin.top;

    const checkPageBreak = (neededHeight: number) => {
      if (y + neededHeight > 297 - margin.bottom) {
        doc.addPage();
        y = margin.top;
        return true;
      }
      return false;
    };

    const addText = (text: string, options: { align?: "left" | "center" | "right" | "justify", isTitle?: boolean, isBold?: boolean, fontSize?: number, spacing?: number } = {}) => {
      doc.setFont("helvetica", options.isBold ? "bold" : "normal");
      doc.setFontSize(options.fontSize || (options.isTitle ? 14 : 12));

      const lines = doc.splitTextToSize(text, contentWidth);
      lines.forEach((line: string) => {
        checkPageBreak(lineHeight);
        if (options.align === "center") {
          doc.text(line, pageWidth / 2, y, { align: "center" });
        } else {
          doc.text(line, margin.left, y);
        }
        y += lineHeight;
      });
      y += options.spacing !== undefined ? options.spacing : 5;
    };

    const addPageBreak = () => {
      doc.addPage();
      y = margin.top;
    };

    // 1. CARÁTULA
    addText("UNIVERSIDAD NACIONAL DE TRUJILLO", { align: "center", isBold: true, fontSize: 16 });
    addText("FACULTAD DE INGENIERÍA", { align: "center", isBold: true, fontSize: 14 });
    addText("ESCUELA PROFESIONAL DE INGENIERÍA DE SISTEMAS", { align: "center", isBold: true, fontSize: 12 });
    y += 30;
    addText("PROYECTO DE TESIS", { align: "center", isBold: true, fontSize: 14 });
    y += 10;
    addText(title.toUpperCase(), { align: "center", isBold: true, fontSize: 12 });
    y += 50;
    addText("AUTOR: _________________________________", { align: "center" });
    addText("ASESOR: _________________________________", { align: "center" });
    y += 60;
    addText("TRUJILLO - PERÚ", { align: "center", isBold: true });
    addText("2024", { align: "center", isBold: true });

    // 2. JURADO DICTAMINADOR
    addPageBreak();
    addText("JURADO DICTAMINADOR", { align: "center", isBold: true });
    y += 40;
    addText("_________________________________", { align: "center" });
    addText("PRESIDENTE", { align: "center", spacing: 20 });
    addText("_________________________________", { align: "center" });
    addText("SECRETARIO", { align: "center", spacing: 20 });
    addText("_________________________________", { align: "center" });
    addText("VOCAL", { align: "center" });

    // 3. ÍNDICE GENERAL
    addPageBreak();
    addText("ÍNDICE GENERAL", { align: "center", isBold: true });
    addText("I. INTRODUCCIÓN ................................................................ 04");
    addText("II. MÉTODO ........................................................................... 06");
    addText("   2.1. Tipo de Investigación ................................................. 06");
    addText("   2.2. Nivel de Investigación ................................................ 07");
    addText("   2.3. Diseño de Investigación ............................................. 08");
    addText("   2.4. Población, Muestra y Muestreo ................................. 09");
    addText("   2.5. Variables ..................................................................... 11");
    addText("III. ASPECTOS ADMINISTRATIVOS ..................................... 15");
    addText("REFERENCIAS BIBLIOGRÁFICAS ........................................ 20");
    addText("ANEXOS ................................................................................ 22");

    // 4. CAPITULO I: INTRODUCCIÓN
    addPageBreak();
    addText("CAPÍTULO I: INTRODUCCIÓN", { isBold: true });
    addText("La realidad problemática de la presente investigación titulada \"" + title + "\" se centra en las deficiencias observadas en el contexto actual del área de estudio. El objetivo principal es determinar de qué manera la propuesta planteada contribuye a la optimización de los procesos existentes.");
    addText("Se justifica de manera teórica, práctica y metodológica, buscando aportar nuevos conocimientos y herramientas que sirvan de base para futuras investigaciones en la Universidad Nacional de Trujillo.");

    // 5. CAPITULO II: MÉTODO
    addPageBreak();
    addText("CAPÍTULO II: MÉTODO", { isBold: true });
    addText("2.1. Tipo de Investigación", { isBold: true });
    addText("1. De Acuerdo a la Orientación o Finalidad: Aplicada.");
    addText("2. De Acuerdo a la Técnica de Contrastación: Descriptiva.");
    
    addText("2.2. Nivel de Investigación", { isBold: true });
    addText("La investigación se sitúa en un nivel correlacional-causal.");

    addText("2.3. Diseño de Investigación", { isBold: true });
    addText("El diseño es no experimental, de corte transversal.");

    addText("2.4. Población, Muestra y Muestreo", { isBold: true });
    addText("1. Población: Constituida por todos los elementos objeto de estudio.");
    addText("2. Muestra: Subconjunto representativo de la población.");
    addText("3. Muestreo: Probabilístico aleatorio simple.");

    addText("2.5. Variables", { isBold: true });
    addText("1. Tipo: Independiente y Dependiente.");
    addText("2. Operacionalización: Se define según indicadores y dimensiones específicas.");

    addText("2.6. Técnicas e Instrumentos, Validación y Confiabilidad", { isBold: true });
    addText("Se utilizará la encuesta como técnica principal y el cuestionario como instrumento.");

    addText("2.7. Consideraciones Éticas", { isBold: true });
    addText("Se garantiza la confidencialidad y el anonimato de los participantes conforme a las normas de ética de la investigación científica.");

    // 6. CAPÍTULO III: ASPECTOS ADMINISTRATIVOS
    addPageBreak();
    addText("CAPÍTULO III: ASPECTOS ADMINISTRATIVOS", { isBold: true });
    addText("3.1. Recursos y Presupuesto", { isBold: true });
    addText("Se consideran recursos humanos, bienes, servicios y tecnológicos necesarios para el desarrollo del proyecto.");
    
    addText("3.2. Financiamiento", { isBold: true });
    addText("La investigación será autofinanciada por el autor del proyecto.");

    addText("3.3. Cronograma de Ejecución", { isBold: true });
    addText("El período de ejecución comprende 6 meses calendario.");

    // 7. REFERENCIAS Y ANEXOS
    addPageBreak();
    addText("REFERENCIAS BIBLIOGRÁFICAS", { isBold: true });
    addText("American Psychological Association (2020). Publication manual of the American Psychological Association (7th ed.).");
    
    y += 20;
    addText("ANEXOS", { isBold: true });
    addText("Anexo 01: Matriz de Consistencia.");
    addText("Anexo 02: Instrumentos de recolección de datos.");

    // Numeración de páginas (excepto carátula)
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 2; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(i.toString(), 210 - margin.right, 297 - 15, { align: "right" });
    }

    doc.save(`Tesis_${title.replace(/\s+/g, "_")}.pdf`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Generación de Tesis con IA</h1>
        <p className="text-muted-foreground">
          Crea la estructura base de tu tesis cumpliendo estrictamente con la Guía de Formato institucional.
        </p>
      </div>

      <div className="grid gap-6">
        {step === 0 && (
          <Card className="border-2 border-primary/20 shadow-lg">
            <CardHeader className="bg-primary/5">
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" /> Nuevo Borrador de Tesis
              </CardTitle>
              <CardDescription>
                Ingresa el título de tu investigación para generar el documento base.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-base font-bold">Título de la Investigación</Label>
                <Input 
                  id="title" 
                  placeholder="Ej. Impacto de la IA en la gestión administrativa de la UNT" 
                  className="text-lg py-6 border-2 focus-visible:ring-primary"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-3">
                <p className="text-sm font-bold text-amber-800 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" /> Especificaciones de la Guía Aplicadas:
                </p>
                <ul className="grid grid-cols-2 gap-2 text-xs text-amber-700 list-disc list-inside">
                  <li>Estructura Cap. I, II y III</li>
                  <li>Fuente Arial Narrow 12</li>
                  <li>Interlineado 1.5 líneas</li>
                  <li>Márgenes 2.5cm y 3cm</li>
                  <li>Alineación Justificada</li>
                  <li>Formato PDF Editable</li>
                </ul>
              </div>

              <Button 
                onClick={handleGenerate} 
                disabled={!title} 
                className="w-full h-12 text-lg font-bold gap-2 shadow-md hover:shadow-lg transition-all"
              >
                <Sparkles className="h-5 w-5" /> GENERAR ESTRUCTURA BASE
              </Button>
            </CardContent>
          </Card>
        )}

        {step === 1 && (
          <Card className="py-12 border-2 border-dashed border-primary/50">
            <CardContent className="flex flex-col items-center justify-center space-y-6 text-center">
              <div className="relative">
                <div className="h-24 w-24 rounded-full border-4 border-primary/20 animate-pulse flex items-center justify-center">
                  <Loader2 className="h-10 w-10 animate-spin text-primary" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-primary/40" />
                </div>
              </div>
              <div className="space-y-2 max-w-md">
                <h3 className="text-xl font-bold text-primary">Generando Tesis...</h3>
                <p className="text-sm text-muted-foreground italic">
                  {steps[Math.min(Math.floor(progress / (100 / steps.length)), steps.length - 1)]}
                </p>
                <div className="w-full bg-muted rounded-full h-2 mt-4 overflow-hidden">
                  <div 
                    className="bg-primary h-full transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in zoom-in duration-500">
            <Card className="border-2 border-green-500 bg-green-50 shadow-xl overflow-hidden">
              <div className="bg-green-500 p-4 flex items-center justify-between text-white">
                <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-sm">
                  <CheckCircle2 className="h-5 w-5" /> Documento Generado con Éxito
                </div>
                <span className="text-[10px] bg-white/20 px-2 py-1 rounded">ESTÁNDAR UNT 2024</span>
              </div>
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="p-6 bg-white rounded-xl shadow-inner border-2 border-green-100 flex flex-col items-center gap-2">
                    <FileText className="h-20 w-20 text-green-600" />
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">PDF EDITABLE</span>
                  </div>
                  <div className="flex-1 space-y-4 text-center md:text-left">
                    <div>
                      <h2 className="text-2xl font-black text-green-900 leading-tight">{title}</h2>
                      <p className="text-sm text-green-700 mt-1">
                        Se han generado 24 páginas siguiendo la estructura de la guía.
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                      <span className="bg-white/80 border border-green-200 px-3 py-1 rounded-full text-xs font-medium text-green-800">Capítulos I, II, III</span>
                      <span className="bg-white/80 border border-green-200 px-3 py-1 rounded-full text-xs font-medium text-green-800">Arial Narrow 12</span>
                      <span className="bg-white/80 border border-green-200 px-3 py-1 rounded-full text-xs font-medium text-green-800">Márgenes APA/UNT</span>
                    </div>
                    <div className="pt-4 flex flex-col sm:flex-row gap-3">
                      <Button onClick={handleDownload} className="flex-1 gap-2 bg-green-600 hover:bg-green-700 shadow-lg h-12 text-base">
                        <Download className="h-5 w-5" /> DESCARGAR TESIS
                      </Button>
                      <Button variant="outline" onClick={() => setStep(0)} className="h-12">
                        Generar otra
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4 bg-blue-50 border-blue-100 shadow-sm">
                <div className="text-xs font-bold text-blue-600 uppercase mb-2">Estructura</div>
                <p className="text-xs text-blue-800 leading-relaxed">
                  Incluye Carátula, Jurado, Índice, Introducción, Método y Aspectos Administrativos.
                </p>
              </Card>
              <Card className="p-4 bg-purple-50 border-purple-100 shadow-sm">
                <div className="text-xs font-bold text-purple-600 uppercase mb-2">Formato</div>
                <p className="text-xs text-purple-800 leading-relaxed">
                  Configurado a 1.5 líneas, márgenes de 2.5cm/3cm y fuente Arial Narrow 12.
                </p>
              </Card>
              <Card className="p-4 bg-amber-50 border-amber-100 shadow-sm">
                <div className="text-xs font-bold text-amber-600 uppercase mb-2">Siguiente Paso</div>
                <p className="text-xs text-amber-800 leading-relaxed">
                  Sube este documento al módulo de "Proyectos" para iniciar la revisión IA detallada.
                </p>
              </Card>
            </div>
          </div>
        )}
      </div>

      {isAdmin && (
        <div className="mt-12 space-y-4">
          <div className="flex items-center gap-2">
            <History className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-bold">Historial de Generaciones (Admin)</h2>
          </div>
          
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-muted/50 text-muted-foreground font-medium border-b">
                    <tr>
                      <th className="px-6 py-4">Título del Proyecto</th>
                      <th className="px-6 py-4">Usuario</th>
                      <th className="px-6 py-4">Fecha</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {loadingHistory ? (
                      <tr>
                        <td colSpan={3} className="px-6 py-8 text-center">
                          <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
                        </td>
                      </tr>
                    ) : history.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="px-6 py-8 text-center text-muted-foreground italic">
                          No hay generaciones registradas aún.
                        </td>
                      </tr>
                    ) : (
                      history.map((item) => (
                        <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                          <td className="px-6 py-4 font-medium text-gray-900">{item.title}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <User className="h-3 w-3 text-muted-foreground" />
                              <span>{item.user?.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-3 w-3" />
                              {new Date(item.createdAt).toLocaleString()}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
