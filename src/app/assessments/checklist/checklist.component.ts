import { Component, input, OnInit } from '@angular/core';
import { Checklist } from '../../interfaces/checklist';
import { PretifyPipe } from '../../pipes/pretify.pipe';
import { NgIf } from '@angular/common';

@Component({
	selector: 'app-checklist',
	imports: [NgIf],
	templateUrl: './checklist.component.html',
	styleUrl: './checklist.component.scss',
})
export class ChecklistComponent implements OnInit {
	checklist = input<Checklist>();
	compNames = '';

	pretify(str: string) {
		return new PretifyPipe().transform(str);
	}

	ngOnInit() {
		const checklist = this.checklist();
		if (checklist) {
			this.compNames = checklist.competence
				.flatMap((c) => this.pretify(c.name))
				.join(', ');
		}
	}
}
