import { Component, Input, OnInit } from '@angular/core';
import {
	UnitPlan,
	CompetenceEntry,
	ContentBlock,
	ClassSection,
	UserSettings,
	MainTheme,
} from '../../../../core/interfaces';
import { PretifyPipe } from '../../../../shared/pipes/pretify.pipe';

@Component({
	selector: 'app-unit-plan',
	imports: [PretifyPipe],
	templateUrl: './unit-plan.component.html',
	styleUrl: './unit-plan.component.scss',
})
export class UnitPlanComponent implements OnInit {
	@Input() unitPlan: UnitPlan | null = null;
	@Input() section: ClassSection | null = null;
	@Input() user: UserSettings | null = null;
	@Input() contents: ContentBlock[] = [];
	@Input() competence: CompetenceEntry[] = [];
	@Input() mainThemes: MainTheme[] = [];
	public isPrintView = window.location.href.includes('print');

	removeDuplicates(strings: string[]): string[] {
		const seen = new Set<string>();

		return strings.filter((str) => {
			if (!seen.has(str)) {
				seen.add(str);
				return true;
			}
			return false;
		});
	}

	removeCompetenceDuplicates(competence: CompetenceEntry[]): string[] {
		const seen = new Set<string>();

		return competence
			.map((c) => c.name)
			.filter((str) => {
				if (!seen.has(str)) {
					seen.add(str);
					return true;
				}
				return false;
			});
	}

	subjectValue(subject: string) {
		if (subject === 'LENGUA_ESPANOLA') {
			return 1;
		}
		if (subject === 'MATEMATICA') {
			return 2;
		}
		if (subject === 'CIENCIAS_SOCIALES') {
			return 3;
		}
		if (subject === 'CIENCIAS_NATURALES') {
			return 4;
		}
		if (subject === 'INGLES') {
			return 5;
		}
		if (subject === 'FRANCES') {
			return 6;
		}
		if (subject === 'FORMACION_HUMANA') {
			return 7;
		}
		if (subject === 'EDUCACION_FISICA') {
			return 8;
		}
		if (subject === 'EDUCACION_ARTISTICA') {
			return 9;
		}
		return 10;
	}

	ngOnInit() {
		setTimeout(() => {
			this.unitPlan?.competence.sort(
				(a, b) =>
					this.subjectValue(a.subject) - this.subjectValue(b.subject),
			);
			this.unitPlan?.contents.sort(
				(a, b) =>
					this.subjectValue(a.subject) - this.subjectValue(b.subject),
			);
			// join all contents and indicators of the same subject
			if (this.unitPlan) {
				const found: string[] = [];
				const reduceContents = (
					prev: ContentBlock[],
					curr: ContentBlock,
				) => {
					if (found.includes(curr.subject)) {
						const old = prev.find(
							(block) => block.subject === curr.subject,
						);
						if (old) {
							old.concepts = this.removeDuplicates([
								...old.concepts,
								...curr.concepts,
							]);
							old.procedures = this.removeDuplicates([
								...old.procedures,
								...curr.procedures,
							]);
							old.attitudes = this.removeDuplicates([
								...old.attitudes,
								...curr.attitudes,
							]);
							old.achievement_indicators = this.removeDuplicates([
								...old.achievement_indicators,
								...curr.achievement_indicators,
							]);
						}
					} else {
						found.push(curr.subject);
						prev.push(curr);
					}
					return prev;
				};
				this.unitPlan.contents = this.unitPlan.contents.reduce(
					reduceContents,
					[] as ContentBlock[],
				);
			}
		}, 0);
	}
}
