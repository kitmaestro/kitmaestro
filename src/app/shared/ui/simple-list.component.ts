import { Component, input } from '@angular/core';

@Component({
	selector: 'app-simple-list',
	template: `
		<ul>
			@for (item of items(); track $index) {
				<li>{{ item }}</li>
			}
		</ul>
	`,
	styles: `
		ul {
			margin: 0;
			padding: 0;
			list-style: none;
		}
	`,
})
export class SimpleList {
	items = input<string[]>([]);
}
