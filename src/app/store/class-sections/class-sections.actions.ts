import { createAction, props } from '@ngrx/store';
import { ClassSectionDto } from './class-sections.models';
import { ClassSection } from '../../core/models';

// Load a single section
export const loadSection = createAction(
	'[Class Sections] Load Section',
	props<{ id: string }>(),
);
export const loadSectionSuccess = createAction(
	'[Class Sections] Load Section Success',
	props<{ section: ClassSection }>(),
);
export const loadSectionFailed = createAction(
	'[Class Sections] Load Section Failed',
	props<{ error: string }>(),
);

// Load all sections
export const loadSections = createAction('[Class Sections] Load Sections');
export const loadSectionsSuccess = createAction(
	'[Class Sections] Load Sections Success',
	props<{ sections: ClassSection[] }>(),
);
export const loadSectionsFailed = createAction(
	'[Class Sections] Load Sections Failed',
	props<{ error: string }>(),
);

// Create a section
export const createSection = createAction(
	'[Class Sections] Create Section',
	props<{ section: ClassSectionDto }>(),
);
export const createSectionSuccess = createAction(
	'[Class Sections] Create Section Success',
	props<{ section: ClassSection }>(),
);
export const createSectionFailed = createAction(
	'[Class Sections] Create Section Failed',
	props<{ error: string }>(),
);

// Update a section
export const updateSection = createAction(
	'[Class Sections] Update Section',
	props<{ id: string; data: Partial<ClassSectionDto> }>(),
);
export const updateSectionSuccess = createAction(
	'[Class Sections] Update Section Success',
	props<{ section: ClassSection }>(),
);
export const updateSectionFailed = createAction(
	'[Class Sections] Update Section Failed',
	props<{ error: string }>(),
);

// Delete a section
export const deleteSection = createAction(
	'[Class Sections] Delete Section',
	props<{ id: string }>(),
);
export const deleteSectionSuccess = createAction(
	'[Class Sections] Delete Section Success',
	props<{ id: string }>(),
);
export const deleteSectionFailed = createAction(
	'[Class Sections] Delete Section Failed',
	props<{ error: string }>(),
);
