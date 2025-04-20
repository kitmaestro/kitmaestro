import { Component, input } from '@angular/core';
import { MathExercise } from '../builders/mixed-operations/mixed-operations.component';

@Component({
	selector: 'app-math-exercise',
	imports: [],
	template: `
		@for (operation of exercise()?.operations; track $index) {
			@if ($index > 0) {
				<span class="operator">{{
					getOperatorSymbol(operation.type)
				}}</span>
			}
			@for (operand of operation.operands; track $index; let j = $index) {
				<span class="operand"
					>{{ operand
					}}{{ j < operation.operands.length - 1 ? ' ' : '' }}</span
				>
			}
		}
	`,
	styles: ``,
})
export class MathExerciseComponent {
	exercise = input<MathExercise>();

	getOperatorSymbol(type: string): string {
		switch (type) {
			case 'addition':
				return '+';
			case 'subtraction':
				return '-';
			case 'multiplication':
				return '×';
			case 'division':
				return '÷';
			default:
				return '';
		}
	}
}
