import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { PretifyPipe } from '../../pipes/pretify.pipe';
import { ClassSectionService } from '../../services/class-section.service';
import { ClassSection } from '../../interfaces/class-section';
import { SubjectConceptListService } from '../../services/subject-concept-list.service';
import { SubjectConceptList } from '../../interfaces/subject-concept-list';

@Component({
    selector: 'app-checklist-generator',
    imports: [
        ReactiveFormsModule,
        MatCardModule,
        MatButtonModule,
        MatInputModule,
        MatSelectModule,
        MatFormFieldModule,
        MatIconModule,
        PretifyPipe,
    ],
    templateUrl: './checklist-generator.component.html',
    styleUrl: './checklist-generator.component.scss'
})
export class ChecklistGeneratorComponent {
    private fb = inject(FormBuilder);
    private classSectionService = inject(ClassSectionService);
    private sclService = inject(SubjectConceptListService);

    sections: ClassSection[] = [];
    section: ClassSection | null = null;
    subjects: string[] = [];
    subjectConceptLists: SubjectConceptList[] = [];

    checklistForm = this.fb.group({
        section: [''],
        subject: [''],
        concept: ['']
    });

    ngOnInit() {
        this.classSectionService.findSections().subscribe({
            next: sections => {
                this.sections = sections;
            }
        });
    }

    onSubmit() {}

    onSectionSelect(event: any) {
        const section = this.sections.find(s => s._id == event.value);
        if (section) {
            this.section = section;
            this.subjects = section.subjects;
        }
    }

    onSubjectSelect(event: any) {
        if (this.section) {
            const filters = { grade: this.section.year, level: this.section.level, subject: event.value };
            this.sclService.findAll(filters).subscribe({
                next: res => {
                    this.subjectConceptLists = res;
                }
            })
        }
    }

    onConceptSelect(event: any) {
        if (this.section) {}
    }
}
