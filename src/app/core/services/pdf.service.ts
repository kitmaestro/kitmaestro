import { Injectable } from '@angular/core'
import jspdf from 'jspdf'
import html2canvas from 'html2canvas'
// @ts-ignore
import html2pdf from 'html2pdf.js/dist/html2pdf.bundle.min.js'

@Injectable({
	providedIn: 'root',
})
export class PdfService {
	async createFromHTML(id: string, p = true): Promise<jspdf> {
		const el = document.getElementById(id) as HTMLElement
		const canvas = await html2canvas(el, {})
		const imgWidth = p ? 208 : 279.4
		const imgHeight = (canvas.height * imgWidth) / canvas.width

		const contentDataURL = canvas.toDataURL('image/png')
		const pdf = new jspdf(p ? 'p' : 'l', 'mm', 'letter')
		pdf.addImage(
			contentDataURL,
			'PNG',
			p ? 3.95 : 0,
			p ? 12.2 : 0,
			imgWidth,
			imgHeight,
		)

		return pdf
	}

	async createAndDownloadFromHTML(id: string, name: string, p = true) {
		const pdf = await this.createFromHTML(id, p)
		pdf.save(name + '.pdf')
	}

	exportTableToPDF(tableId: string, title: string, portrait = true) {
		const data = document.getElementById(tableId)
		if (data) {
			html2canvas(data).then((canvas) => {
				const imgData = canvas.toDataURL('image/png')
				const pdf = new jspdf(portrait ? 'p' : 'l', 'pt', 'letter') // 'p' for portrait, 'letter' for letter size

				// Set margin in points (0.35 inches)
				const margin = 25.2 // 0.35 inches in points

				const imgWidth = portrait ? 72 * 8 : 72 * 10.5 // Adjust based on your needs
				const pageHeight = pdf.internal.pageSize.height
				const imgHeight = (canvas.height * imgWidth) / canvas.width
				let heightLeft = imgHeight

				let position = margin // Start position with margin

				pdf.addImage(
					imgData,
					'PNG',
					margin,
					position,
					imgWidth,
					imgHeight - 2 * margin,
				) // Adjust width for margins
				heightLeft -= pageHeight

				while (heightLeft >= 0) {
					position = heightLeft - (imgHeight - 2 * margin)
					pdf.addPage()
					pdf.addImage(
						imgData,
						'PNG',
						margin,
						position,
						imgWidth,
						imgHeight - 2 * margin,
					) // Adjust width for margins
					heightLeft -= pageHeight
				}

				pdf.save(`${title}.pdf`)
			})
		}
	}

	exportToPdf(id: string, title: string, portrait = true) {
		const element = document.getElementById(id)
		const opt = {
			margin: 0.5,
			filename: `${title}.pdf`,
			image: { type: 'jpeg', quality: 0.98 },
			html2canvas: { scale: 3 },
			jsPDF: {
				unit: 'in',
				format: 'letter',
				orientation: portrait ? 'portrait' : 'landscape',
			},
		}

		html2pdf().from(element).set(opt).save()
	}
}
