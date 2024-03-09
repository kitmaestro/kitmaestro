import { Injectable } from '@angular/core';
import jspdf from 'jspdf';
import html2canvas from 'html2canvas';

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  async createFromHTML(id: string, p: boolean = true): Promise<jspdf> {
    const el = document.getElementById(id) as HTMLElement;
    const canvas = await html2canvas(el, {});
    const imgWidth = p ? 208 : 279.4;
    const imgHeight = canvas.height * imgWidth / canvas.width;

    const contentDataURL = canvas.toDataURL('image/png');
    const pdf = new jspdf(p ? 'p' : 'l', 'mm', 'letter');
    pdf.addImage(contentDataURL, 'PNG', p ? 3.95 : 0, p ? 12.2 : 0, imgWidth, imgHeight);

    return pdf;
  }

  async createAndDownloadFromHTML(id: string, name: string, p: boolean = true) {
    const pdf = await this.createFromHTML(id, p);
    pdf.save(name + '.pdf');
  }
}
