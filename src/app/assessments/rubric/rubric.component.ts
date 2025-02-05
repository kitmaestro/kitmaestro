import { Component, inject, input } from '@angular/core';
import { Rubric } from '../../interfaces/rubric';
import { Student } from '../../interfaces/student';
import { StudentsService } from '../../services/students.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-rubric',
  imports: [
    NgIf,
  ],
  templateUrl: './rubric.component.html',
  styleUrl: './rubric.component.scss'
})
export class RubricComponent {
  private studentService = inject(StudentsService);

  rubric = input<Rubric>();
  students: Student[] = []

  ngOnInit() {
    const section = this.rubric()?.section;
    if (section)
      this.studentService.findBySection(section._id).subscribe(students => this.students = students);
  }
}
