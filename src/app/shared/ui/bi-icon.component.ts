import { Component, Input } from '@angular/core';

@Component({
	selector: 'bi-icon',
	imports: [],
	template: '<span class="bi bi-{{iconName}}"></span>',
})
export class BiIconComponent {
	@Input('icon') iconName = 'house';
}
