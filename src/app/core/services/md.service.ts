import { Injectable } from '@angular/core';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import { saveAs } from 'file-saver';

@Injectable({
	providedIn: 'root',
})
export class MdService {
	constructor() {}

	/**
	 * Convierte una cadena de texto en formato Markdown a un documento .docx y lo descarga.
	 * @param mdString El texto en formato Markdown a convertir.
	 */
	public mdToDocx(mdString: string): void {
		// 1. Parsear el markdown para obtener un array de elementos de `docx`
		const docxElements = this.parseMd(mdString);

		// 2. Crear el documento de Word con los elementos parseados
		const doc = new Document({
			sections: [
				{
					properties: {},
					children: docxElements,
				},
			],
		});

		// 3. Usar Packer para generar el archivo y file-saver para descargarlo
		Packer.toBlob(doc).then((blob) => {
			saveAs(blob, 'documento-markdown.docx');
			console.log('Documento creado y descargado exitosamente.');
		});
	}

	/**
	 * Procesa la cadena de Markdown línea por línea y la convierte en un array
	 * de objetos Paragraph compatibles con la librería docx.
	 * @param mdString El texto en formato Markdown.
	 * @returns Un array de objetos Paragraph.
	 */
	private parseMd(mdString: string): Paragraph[] {
		const lines = mdString.split('\n');
		const docxElements: Paragraph[] = [];

		for (const line of lines) {
			// Manejar encabezados (H1, H2, H3)
			if (line.startsWith('# ')) {
				docxElements.push(
					this.createStyledParagraph(
						line.substring(2),
						HeadingLevel.HEADING_1,
					),
				);
				continue;
			}
			if (line.startsWith('## ')) {
				docxElements.push(
					this.createStyledParagraph(
						line.substring(3),
						HeadingLevel.HEADING_2,
					),
				);
				continue;
			}
			if (line.startsWith('### ')) {
				docxElements.push(
					this.createStyledParagraph(
						line.substring(4),
						HeadingLevel.HEADING_3,
					),
				);
				continue;
			}

			// Manejar listas no ordenadas
			if (line.startsWith('- ') || line.startsWith('* ')) {
				docxElements.push(this.createListItem(line.substring(2)));
				continue;
			}

			// Manejar líneas en blanco como un párrafo vacío para espaciado
			if (line.trim() === '') {
				docxElements.push(new Paragraph(''));
				continue;
			}

			// Manejar párrafos normales con formato en línea (negrita, itálica)
			docxElements.push(this.createParagraphWithInlineFormatting(line));
		}

		return docxElements;
	}

	/**
	 * Crea un párrafo con un estilo de encabezado específico.
	 * @param text El texto del encabezado.
	 * @param level El nivel de encabezado (ej. HEADING_1).
	 * @returns Un objeto Paragraph con estilo de encabezado.
	 */
	private createStyledParagraph(text: string, level: any): Paragraph {
		return new Paragraph({
			children: this.parseInlineFormatting(text), // Permite formato dentro de encabezados
			heading: level,
		});
	}

	/**
	 * Crea un párrafo con formato de viñeta (lista).
	 * @param text El texto del elemento de la lista.
	 * @returns Un objeto Paragraph con una viñeta.
	 */
	private createListItem(text: string): Paragraph {
		return new Paragraph({
			children: this.parseInlineFormatting(text),
			bullet: {
				level: 0, // Nivel de indentación de la viñeta
			},
		});
	}

	/**
	 * Crea un párrafo estándar a partir de una línea de texto.
	 * @param line El texto del párrafo.
	 * @returns Un objeto Paragraph.
	 */
	private createParagraphWithInlineFormatting(line: string): Paragraph {
		return new Paragraph({
			children: this.parseInlineFormatting(line),
		});
	}

	/**
	 * Parsea una cadena de texto para identificar formatos en línea como negrita e itálica.
	 * @param text El texto a parsear.
	 * @returns Un array de objetos TextRun, cada uno con su propio estilo si aplica.
	 */
	private parseInlineFormatting(text: string): TextRun[] {
		const runs: TextRun[] = [];

		// Regex para separar el texto por los marcadores de markdown (**, *, __, _), manteniéndolos.
		const parts = text
			.split(/(\*\*.*?\*\*|\*.*?\*|__.*?__|_.*?_)/g)
			.filter(Boolean);

		for (const part of parts) {
			if (
				(part.startsWith('**') && part.endsWith('**')) ||
				(part.startsWith('__') && part.endsWith('__'))
			) {
				// Es negrita
				runs.push(new TextRun({ text: part.slice(2, -2), bold: true }));
			} else if (
				(part.startsWith('*') && part.endsWith('*')) ||
				(part.startsWith('_') && part.endsWith('_'))
			) {
				// Es itálica
				runs.push(
					new TextRun({ text: part.slice(1, -1), italics: true }),
				);
			} else {
				// Es texto normal
				runs.push(new TextRun(part));
			}
		}
		return runs;
	}
}
