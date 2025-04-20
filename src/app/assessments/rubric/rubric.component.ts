import { Component, inject, input, signal, OnInit } from '@angular/core';
import { Rubric } from '../../interfaces/rubric';
import { Student } from '../../interfaces/student';
import { StudentsService } from '../../services/students.service';
import { NgIf } from '@angular/common';
import { ClassSectionService } from '../../services/class-section.service';
import { ClassSection } from '../../interfaces/class-section';

@Component({
	selector: 'app-rubric',
	imports: [NgIf],
	templateUrl: './rubric.component.html',
	styleUrl: './rubric.component.scss',
})
export class RubricComponent implements OnInit {
	private studentService = inject(StudentsService);
	private sectionService = inject(ClassSectionService);

	rubric = input<Rubric>();
	students: Student[] = [];
	section = signal<ClassSection | null>(null);

	ngOnInit() {
		const rubric = this.rubric();
		if (rubric && rubric.section) {
			const section: string =
				typeof rubric.section === 'string'
					? rubric.section
					: rubric.section._id;
			this.studentService
				.findBySection(section)
				.subscribe((students) => (this.students = students));
			this.sectionService
				.findSection(section)
				.subscribe((s) => this.section.set(s));
		}
	}
}
