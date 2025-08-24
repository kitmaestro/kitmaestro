import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class WhatsAppShareService {
	private base = 'https://wa.me/';

	// phone optional; if omitted opens WhatsApp Web/new chat screen
	createUrl(text: string, phone?: string): string {
		return phone
			? `${this.base}${this.normalizePhone(phone)}?text=${encodeURIComponent(text)}`
			: `${this.base}?text=${encodeURIComponent(text)}`;
	}

	// remove non-digit chars and leading '+'
	private normalizePhone(phone: string): string {
		return phone.replace(/\D+/g, '').replace(/^0+/, '');
	}

	// open in new tab
	open(text: string, phone?: string) {
		const url = this.createUrl(text, phone);
		window.open(url, '_blank');
	}
}
