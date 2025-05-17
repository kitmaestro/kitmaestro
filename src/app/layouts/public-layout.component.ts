import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
	selector: 'app-public-layout',
	imports: [RouterOutlet],
	standalone: true,
	template: `<router-outlet />`,
	styles: ``,
})
export class PublicLayoutComponent {}
