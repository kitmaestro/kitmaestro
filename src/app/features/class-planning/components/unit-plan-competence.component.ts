import { Component, input } from '@angular/core';
import {
	ClassSection,
	CompetenceEntry,
	UnitPlan,
} from '../../../core/interfaces';
import { PretifyPipe } from '../../../shared/pipes/pretify.pipe';

@Component({
	selector: 'app-unit-plan-competence',
	imports: [PretifyPipe],
	template: `
		@if (unitPlan(); as plan) {}
	`,
	styles: `
		td,
		th,
		caption {
			border: 1px solid #ccc;
			padding: 10px;
			line-height: 1.5;
			font-size: 12pt;
		}

		td {
			vertical-align: top;
		}

		th,
		caption {
			font-weight: bold;
			text-align: center;
		}

		caption {
			border-bottom: none;
		}

		.text-center {
			text-align: center;
		}

		.font-bold,
		.bold {
			font-weight: bold;
		}
	`,
})
export class UnitPlanCompetenceComponent {
	unitPlan = input<UnitPlan | null>(null);
	competence = input<CompetenceEntry[]>([]);
	section = input<ClassSection | null>(null);
}
