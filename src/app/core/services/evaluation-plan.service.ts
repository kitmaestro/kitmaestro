import { Injectable } from "@angular/core"
import { EvaluationPlan } from "../models/evaluation-plan"
import { AlignmentType, BorderStyle, Document, HeadingLevel, Packer, PageOrientation, Paragraph, Table, TableCell, TableRow, TextRun, WidthType } from "docx"
import { saveAs } from "file-saver"
import { EvaluationEntry } from "../interfaces"
import { ClassSection, UnitPlan } from "../models"
import { PretifyPipe } from "../../shared"

interface EvaluationPlanPromptData {
    classSection: ClassSection
    plan: UnitPlan
    evaluationParticipants: string
    evaluationTypes: string
}

interface EvaluationBlock {
    achievementIndicatorAspect: string
    competence: string
    evidences: string[]
    instrument: string
    weighting: number
}

@Injectable({
    providedIn: 'root'
})
export class EvaluationPlanService {
    private pretify = (new PretifyPipe()).transform

    buildEvaluationPlanPrompt({
        classSection,
        plan,
        evaluationParticipants,
        evaluationTypes,
    }: EvaluationPlanPromptData): string {
        const evaluationContext = {
            grado: `${this.pretify(classSection.year)} de ${this.pretify(classSection.level)}`,
            situationDeAprendizaje: plan.learningSituation,
            ejesTransversales: plan.mainThemes.map(mt => ({
                categoria: mt.category,
                temas: mt.topics,
            })),
            estrategias: plan.strategies,
            recursos: plan.resources,
            competencias: plan.competence.map(c => ({
                competenciaFundamental: this.pretify(c.name, classSection.level),
                asignaturas: this.pretify(c.subject),
                competenciasEspecificas: c.entries,
                criteriosDeEvaluacion: c.criteria,
            })),
            contenidos: plan.contents.map(cb => ({
                areaCurricular: this.pretify(cb.subject),
                contenidosConceptuales: cb.concepts,
                contenidosProcedimentales: cb.procedures,
                contenidosActitudinales: cb.attitudes,
                indicadoresDeLogro: cb.achievement_indicators,
            })),
            actividatesDeAprendizajeYEvaluacion: [...plan.teacherActivities, ...plan.evaluationActivities].map((a) => ({
                asignatura: this.pretify(a.subject),
                actividades: a.activities,
            })),
        }
        const comptBlocks = classSection.level === 'PRIMARIA' ? `- Comunicativa
- Pensamiento Lógico, Creativo y Crítico; Resolución de Problemas; Científica y Tecnológica
- Ética y Ciudadana; Desarrollo Personal y Espiritual; Ambiental y de la Salud` : `- Comunicativa
- Pensamiento Lógico
- Creativo y Crítico
- Resolución de Problemas
- Tecnológica y Científica
- Ética y Ciudadana
- Desarrollo Personal y Espiritual
- Ambiental y de la Salud`

        return `Genera una planificación de evaluación basada en la metodología matricial de Tobón para ${this.pretify(classSection.year)} de ${this.pretify(classSection.level)}.

CONTEXTO:
${JSON.stringify(evaluationContext, null, 2)}

REQUERIMIENTOS DE LA EVALUACIÓN:
- Tipos: ${evaluationTypes}
- Participantes: ${evaluationParticipants}

ESTRUCTURA REQUERIDA PARA TU RESPUESTA (devuélvelo como JSON válido):
{
	"evaluationEntries": {
		subject: string
		specificCompetenceAspect: string
		achievementIndicators: string[]
		criteria: string[]
		evaluationBlocks: {
			achievementIndicatorAspect: string
			competence: string
			evidences: string[]
			instrument: string
			weighting: number
		}[]
	}[]
}

Las competencias fundamentales son estas:
${comptBlocks}

Agrupa los bloques de por competencia y asignatura, no deben haber competencias repetidas para la misma asignatura. Asegúrate que la suma de las ponderaciones por area curricular sea igual a 100%.`
    }

    async downloadAsDocx(plan: EvaluationPlan): Promise<boolean> {
        try {
            const doc = this.createDocument(plan)
            const blob = await Packer.toBlob(doc)
            saveAs(blob, `plan-evaluacion-${plan.classSection.name}-${plan.unitPlan.subjects.map(s => this.pretify(s)).join('-')}.docx`)
            return true
        } catch (error) {
            console.error(error)
            return false
        }
    }

    private createDocument(plan: EvaluationPlan): Document {
        const sections = [
            this.createHeaderSection(plan),
            ...this.createEvaluationEntriesSections(plan)
        ]

        return new Document({
            sections: sections.filter(section => section !== null) as any[],
        })
    }

    private createHeaderSection(plan: EvaluationPlan): any {
        return {
            properties: {
                page: {
                    size: {
                        orientation: PageOrientation.LANDSCAPE,
                        height: '279mm',
                        width: '216mm',
                    },
                },
            },
            children: [
                new Paragraph({
                    text: "Planificación de la evaluación de las competencias",
                    heading: HeadingLevel.HEADING_1,
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 400 }
                }),
                new Table({
                    width: { size: 100, type: WidthType.PERCENTAGE },
                    borders: this.getTableBorders(),
                    rows: [
                        new TableRow({
                            tableHeader: true,
                            children: [
                                new TableCell({
                                    children: [
                                        new Paragraph({ children: [
                                            new TextRun({ text: plan.unitPlan.subjects.length > 1 ? "Áreas curriculares: " : "Área curricular: ", bold: true }),
                                            new TextRun(plan.unitPlan.subjects.map(s => this.pretify(s)).join(', ')),
                                        ]}),
                                        new Paragraph({ children: [
                                            new TextRun({ text: "\nGrado: ", bold: true }),
                                            new TextRun(plan.classSection.name),
                                        ] }),
                                    ],
                                    width: { size: 33.33, type: WidthType.PERCENTAGE }
                                }),
                                new TableCell({
                                    children: [ new Paragraph({ children: [ new TextRun({ text: "Tipos de evaluación", bold: true }) ] }), ],
                                    width: { size: 33.33, type: WidthType.PERCENTAGE }
                                }),
                                new TableCell({
                                    children: [ new Paragraph({ children: [ new TextRun({ text: "Evaluación según los participantes", bold: true }) ] }), ],
                                    width: { size: 33.34, type: WidthType.PERCENTAGE }
                                })
                            ]
                        }),
                        new TableRow({
                            children: [
                                new TableCell({ children: plan.competence.flatMap(c => c.entries).map(comp => new Paragraph(`- ${comp}`)) }),
                                new TableCell({ children: plan.evaluationTypes.map(type => new Paragraph(`- ${type}`)) }),
                                new TableCell({ children: plan.evaluationParticipants.map(participant => new Paragraph(`• ${participant}`)) }),
                            ]
                        })
                    ]
                }),
                new Paragraph(''),
            ]
        }
    }

    private createEvaluationEntriesSections(plan: EvaluationPlan): any[] {
        return plan.evaluationEntries.map((area, index) => ({
            properties: {
                page: {
                    size: {
                        orientation: PageOrientation.LANDSCAPE,
                        height: '279mm',
                        width: '216mm',
                    },
                },
            },
            children: [
                index === 0 ? new Paragraph({
                    text: this.prettifyText(area.subject),
                    heading: HeadingLevel.HEADING_2,
                    alignment: AlignmentType.CENTER,
                    spacing: { before: 600, after: 400 }
                }) : new Paragraph({
                    text: this.prettifyText(area.subject),
                    heading: HeadingLevel.HEADING_2,
                    alignment: AlignmentType.CENTER,
                    spacing: { before: 800, after: 400 }
                }),
                this.createEvaluationAreaTable(area)
            ]
        }))
    }

    private createEvaluationAreaTable(area: EvaluationEntry): Table {
        const dataRows: TableRow[] = area.evaluationBlocks.flatMap((block, i) => {
            const evaluationRow = new TableRow({
                children: [
                    new TableCell({
                        children: [new Paragraph(block.achievementIndicatorAspect)],
                        width: {
                            size: 25,
                            type: WidthType.PERCENTAGE
                        }
                    }),
                    new TableCell({
                        children: block.evidences.map(evidence =>
                            new Paragraph({
                                text: `• ${evidence}`,
                                spacing: { after: 0 }
                            })
                        ),
                        width: {
                            size: 25,
                            type: WidthType.PERCENTAGE
                        }
                    }),
                    new TableCell({
                        children: [new Paragraph(`${block.weighting}%`)],
                        width: {
                            size: 25,
                            type: WidthType.PERCENTAGE
                        }
                    }),
                    new TableCell({
                        children: [new Paragraph(`• ${block.instrument}`)],
                        width: {
                            size: 25,
                            type: WidthType.PERCENTAGE
                        }
                    })
                ]
            })
            if (i == 0) {
                return [
                    new TableRow({
                        children: [
                            new TableCell({
                                children: [ new Paragraph({ children: [new TextRun({ text: this.pretify(block.competence), bold: true })], alignment: AlignmentType.CENTER }) ],
                                width: {
                                    size: 100,
                                    type: WidthType.PERCENTAGE
                                }
                            })
                        ]
                    }),
                    new TableRow({
                        children: [
                            new TableCell({
                                children: [ new Paragraph({ children: [new TextRun({ text: "Aspecto del Indicador", bold: true })] }), ],
                                width: {
                                    size: 25,
                                    type: WidthType.PERCENTAGE
                                }
                            }),
                            new TableCell({
                                children: [new Paragraph({ children: [new TextRun({ text: "Evidencias", bold: true })] }), ],
                                width: {
                                    size: 25,
                                    type: WidthType.PERCENTAGE
                                }
                            }),
                            new TableCell({
                                children: [ new Paragraph({ children: [new TextRun({ text: "Ponderación", bold: true })] }), ],
                                width: {
                                    size: 25,
                                    type: WidthType.PERCENTAGE
                                }
                            }),
                            new TableCell({
                                children: [ new Paragraph({ children: [new TextRun({ text: "Instrumento (s)", bold: true })] }), ],
                                width: {
                                    size: 25,
                                    type: WidthType.PERCENTAGE
                                }
                            }),
                        ],
                    }),
                    evaluationRow
                ]
            }
            return evaluationRow
        })
        const rows: TableRow[] = [
            // Header row
            new TableRow({
                children: [
                    new TableCell({
                        children: [
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: "Aspecto de la competencia específica del grado:",
                                        bold: true
                                    }),
                                ]
                            }),
                            new Paragraph(area.specificCompetenceAspect)
                        ],
                        width: {
                            size: 33.33,
                            type: WidthType.PERCENTAGE
                        }
                    }),
                    new TableCell({
                        children: [
                            new Paragraph({ children: [ new TextRun({ text: "Indicadores de Logro", bold: true }) ] }),
                            ...area.achievementIndicators.map(indicator => new Paragraph(`• ${indicator}`))
                        ],
                        width: {
                            size: 33.33,
                            type: WidthType.PERCENTAGE
                        }
                    }),
                    new TableCell({
                        children: [
                            new Paragraph({ children: [ new TextRun({ text: "Criterios", bold: true }) ] }),
                            ...area.criteria.map(criterion => new Paragraph(`• ${criterion}`))
                        ],
                        width: {
                            size: 33.34,
                            type: WidthType.PERCENTAGE
                        }
                    })
                ]
            }),
            // Data row
            ...dataRows
        ]

        return new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: this.getTableBorders(),
            rows
        })
    }

    private getTableBorders(): any {
        return {
            top: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
            bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
            left: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
            right: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
            insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
            insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }
        }
    }

    private prettifyText(text: string): string {
        // Implementa la misma lógica que tu PretifyPipe
        return text
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ')
    }

    async copyToClipboard(plan: EvaluationPlan): Promise<void> {
        try {
            const textContent = this.generateTextContent(plan)

            // Intentar usar la API moderna del portapapeles
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(textContent)
            } else {
                // Fallback para navegadores más antiguos o contextos no seguros
                await this.copyUsingExecCommand(textContent)
            }
        } catch (error) {
            console.error('Error al copiar al portapapeles:', error)
            throw new Error('No se pudo copiar el contenido al portapapeles')
        }
    }

    private generateTextContent(plan: EvaluationPlan): string {
        let content = ''

        // Encabezado principal
        content += 'PLANIFICACIÓN DE LA EVALUACIÓN DE LAS COMPETENCIAS\n'
        content += '='.repeat(60) + '\n\n'

        // Información básica
        content += `ÁREA CURRICULAR: ${this.prettifyText(plan.unitPlan.subjects.join(', '))}\n`
        content += `GRADO: ${plan.classSection.name}\n\n`

        // Tipos de evaluación
        content += 'TIPOS DE EVALUACIÓN:\n'
        content += '- ' + plan.evaluationTypes.join('\n- ') + '\n\n'

        // Participantes en la evaluación
        content += 'EVALUACIÓN SEGÚN LOS PARTICIPANTES:\n'
        content += '- ' + plan.evaluationParticipants.join('\n- ') + '\n\n'

        // Competencias específicas
        content += 'COMPETENCIAS ESPECÍFICAS DEL GRADO:\n'
        plan.competence.forEach(comp => {
            comp.entries.forEach(entry => {
                content += `- ${entry}\n`
            })
        })
        content += '\n'

        // Entradas de evaluación por área
        plan.evaluationEntries.forEach((area, areaIndex) => {
            content += `${this.prettifyText(area.subject).toUpperCase()}\n`
            content += '-'.repeat(50) + '\n\n'

            // Aspecto de competencia específica
            content += 'ASPECTO DE LA COMPETENCIA ESPECÍFICA DEL GRADO:\n'
            content += `${area.specificCompetenceAspect}\n\n`

            // Indicadores de logro
            content += 'INDICADORES DE LOGRO:\n'
            area.achievementIndicators.forEach(indicator => {
                content += `- ${indicator}\n`
            })
            content += '\n'

            // Criterios
            content += 'CRITERIOS:\n'
            area.criteria.forEach(criterion => {
                content += `- ${criterion}\n`
            })
            content += '\n'

            // Bloques de evaluación
            area.evaluationBlocks.forEach((block, blockIndex) => {
                if (blockIndex === 0) {
                    content += `COMPETENCIA: ${this.prettifyText(block.competence)}\n`
                    content += '┌' + '─'.repeat(20) + '┬' + '─'.repeat(20) + '┬' + '─'.repeat(10) + '┬' + '─'.repeat(20) + '┐\n'
                    content += '│ Aspecto Indicador  │ Evidencias         │ Ponderación │ Instrumento(s)     │\n'
                    content += '├' + '─'.repeat(20) + '┼' + '─'.repeat(20) + '┼' + '─'.repeat(10) + '┼' + '─'.repeat(20) + '┤\n'
                }

                // Truncar textos largos para mantener formato de tabla
                const aspecto = block.achievementIndicatorAspect
                const instrumento = block.instrument

                content += `│ ${aspecto} │ ${block.evidences[0]} │ ${block.weighting.toString()} │ ${instrumento} │\n`

                // Evidencias adicionales (si hay más de una)
                for (let i = 1; i < block.evidences.length; i++) {
                    content += `│ ${block.evidences[i]} │ ${block.evidences[i]} │ ${block.weighting.toString()} │ ${instrumento} │\n`
                }

                if (blockIndex === area.evaluationBlocks.length - 1) {
                    content += '└' + '─'.repeat(20) + '┴' + '─'.repeat(20) + '┴' + '─'.repeat(10) + '┴' + '─'.repeat(20) + '┘\n'
                }
            })

            content += '\n' + '='.repeat(60) + '\n\n'
        })

        return content
    }

    // Versión alternativa con formato más simple (sin tablas)
    generateSimpleTextContent(plan: EvaluationPlan): string {
        let content = ''

        // Encabezado principal
        content += 'PLANIFICACIÓN DE LA EVALUACIÓN DE LAS COMPETENCIAS\n\n'

        // Información básica
        content += `Área curricular: ${this.prettifyText(plan.unitPlan.subjects.join(', '))}\n`
        content += `Grado: ${plan.classSection.name}\n\n`

        // Tipos de evaluación
        content += 'TIPOS DE EVALUACIÓN:\n'
        plan.evaluationTypes.forEach(type => {
            content += `• ${type}\n`
        })
        content += '\n'

        // Participantes
        content += 'EVALUACIÓN SEGÚN LOS PARTICIPANTES:\n'
        plan.evaluationParticipants.forEach(participant => {
            content += `• ${participant}\n`
        })
        content += '\n'

        // Competencias
        content += 'COMPETENCIAS ESPECÍFICAS DEL GRADO:\n'
        plan.competence.forEach(comp => {
            comp.entries.forEach(entry => {
                content += `• ${entry}\n`
            })
        })
        content += '\n'

        // Áreas de evaluación
        plan.evaluationEntries.forEach(area => {
            content += `--- ${this.prettifyText(area.subject).toUpperCase()} ---\n\n`

            content += 'Aspecto de la competencia específica:\n'
            content += `${area.specificCompetenceAspect}\n\n`

            content += 'Indicadores de logro:\n'
            area.achievementIndicators.forEach(indicator => {
                content += `• ${indicator}\n`
            })
            content += '\n'

            content += 'Criterios:\n'
            area.criteria.forEach(criterion => {
                content += `• ${criterion}\n`
            })
            content += '\n'

            content += 'BLOQUES DE EVALUACIÓN:\n'
            area.evaluationBlocks.forEach(block => {
                content += `Competencia: ${this.prettifyText(block.competence)}\n`
                content += `• Aspecto del indicador: ${block.achievementIndicatorAspect}\n`
                content += `• Evidencias: ${block.evidences.join(', ')}\n`
                content += `• Ponderación: ${block.weighting}\n`
                content += `• Instrumento: ${block.instrument}\n\n`
            })

            content += '\n'
        })

        return content
    }

    private async copyUsingExecCommand(text: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const textArea = document.createElement('textarea')
            textArea.value = text
            textArea.style.position = 'fixed'
            textArea.style.left = '-999999px'
            textArea.style.top = '-999999px'
            document.body.appendChild(textArea)
            textArea.focus()
            textArea.select()

            try {
                const successful = document.execCommand('copy')
                document.body.removeChild(textArea)
                if (successful) {
                    resolve()
                } else {
                    reject(new Error('Falló el comando execCommand'))
                }
            } catch (error) {
                document.body.removeChild(textArea)
                reject(error)
            }
        })
    }
}