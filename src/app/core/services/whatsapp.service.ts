import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class WhatsAppShareService {
	private base = 'https://wa.me/';

	createUrl(text: string, phone?: string): string {
		return phone
			? `${this.base}${this.normalizePhone(phone)}?text=${encodeURIComponent(text)}`
			: `${this.base}?text=${encodeURIComponent(text)}`;
	}

	private normalizePhone(phone: string): string {
		return phone.replace(/\D+/g, '').replace(/^0+/, '');
	}

	open(text: string, phone?: string) {
		const url = this.createUrl(text, phone);
		window.open(url, '_blank');
	}
}
