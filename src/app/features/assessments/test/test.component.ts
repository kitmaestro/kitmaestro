import { Component, input } from '@angular/core';
import { MarkdownComponent } from 'ngx-markdown';
import { Test } from '../../../core/interfaces/test';

@Component({
	selector: 'app-test',
	imports: [MarkdownComponent],
	templateUrl: './test.component.html',
	styleUrl: './test.component.scss',
})
export class TestComponent {
	data = input<string>('');
}
