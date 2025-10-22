import { createAction, props } from '@ngrx/store';
import { Student } from '../../core/models';
import { StudentDto } from './students.models';

// Load a single student
export const loadStudent = createAction(
	'[Students] Load Student',
	props<{ id: string }>(),
);
export const loadStudentSuccess = createAction(
	'[Students] Load Student Success',
	props<{ student: Student }>(),
);
export const loadStudentFailed = createAction(
	'[Students] Load Student Failed',
	props<{ error: string }>(),
);

// Load all students (findAll)
export const loadStudents = createAction('[Students] Load Students');
export const loadStudentsSuccess = createAction(
	'[Students] Load Students Success',
	props<{ students: Student[] }>(),
);
export const loadStudentsFailed = createAction(
	'[Students] Load Students Failed',
	props<{ error: string }>(),
);

// Load students by section (findBySection)
export const loadStudentsBySection = createAction(
	'[Students] Load Students By Section',
	props<{ sectionId: string }>(),
);
export const loadStudentsBySectionSuccess = createAction(
	'[Students] Load Students By Section Success',
	props<{ students: Student[] }>(),
);
export const loadStudentsBySectionFailed = createAction(
	'[Students] Load Students By Section Failed',
	props<{ error: string }>(),
);

// Create a student
export const createStudent = createAction(
	'[Students] Create Student',
	props<{ student: Partial<StudentDto> }>(),
);
export const createStudentSuccess = createAction(
	'[Students] Create Student Success',
	props<{ student: Student }>(),
);
export const createStudentFailed = createAction(
	'[Students] Create Student Failed',
	props<{ error: string }>(),
);

// Update a student
export const updateStudent = createAction(
	'[Students] Update Student',
	props<{ id: string; data: Partial<StudentDto> }>(),
);
export const updateStudentSuccess = createAction(
	'[Students] Update Student Success',
	props<{ student: Student }>(),
);
export const updateStudentFailed = createAction(
	'[Students] Update Student Failed',
	props<{ error: string }>(),
);

// Delete a student
export const deleteStudent = createAction(
	'[Students] Delete Student',
	props<{ id: string }>(),
);
export const deleteStudentSuccess = createAction(
	'[Students] Delete Student Success',
	props<{ id: string }>(),
);
export const deleteStudentFailed = createAction(
	'[Students] Delete Student Failed',
	props<{ error: string }>(),
);
