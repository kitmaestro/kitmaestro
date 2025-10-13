import { Component, input } from '@angular/core';
import { MarkdownComponent } from 'ngx-markdown';

@Component({
	selector: 'app-test',
	imports: [MarkdownComponent],
	template: `
		@if (data()) {
			<markdown [data]="data()"></markdown>
		}
	`,
})
export class TestComponent {
	data = input<string>('');
}
