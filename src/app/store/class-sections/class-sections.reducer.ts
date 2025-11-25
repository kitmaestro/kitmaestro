import { createReducer, on } from '@ngrx/store';
import * as ClassSectionsActions from './class-sections.actions';
import {
	initialClassSectionsState,
	ClassSectionStateStatus,
} from './class-sections.models';

export const classSectionsReducer = createReducer(
	initialClassSectionsState,

	on(ClassSectionsActions.loadSection, (state) => ({
		...state,
		status: ClassSectionStateStatus.LOADING_SECTION,
	})),
	on(ClassSectionsActions.loadSections, (state) => ({
		...state,
		status: ClassSectionStateStatus.LOADING_SECTIONS,
	})),
	on(ClassSectionsActions.createSection, (state) => ({
		...state,
		status: ClassSectionStateStatus.CREATING_SECTION,
	})),
	on(ClassSectionsActions.updateSection, (state) => ({
		...state,
		status: ClassSectionStateStatus.UPDATING_SECTION,
	})),
	on(ClassSectionsActions.deleteSection, (state) => ({
		...state,
		status: ClassSectionStateStatus.DELETING_SECTION,
	})),

	on(
		ClassSectionsActions.loadSectionFailed,
		ClassSectionsActions.loadSectionsFailed,
		ClassSectionsActions.createSectionFailed,
		ClassSectionsActions.updateSectionFailed,
		ClassSectionsActions.deleteSectionFailed,
		(state, { error }) => ({
			...state,
			status: ClassSectionStateStatus.IDLING,
			error,
		}),
	),

	on(ClassSectionsActions.loadSectionSuccess, (state, { section }) => ({
		...state,
		status: ClassSectionStateStatus.IDLING,
		selectedSection: section,
	})),
	on(ClassSectionsActions.loadSectionsSuccess, (state, { sections }) => ({
		...state,
		status: ClassSectionStateStatus.IDLING,
		classSections: sections,
	})),
	on(ClassSectionsActions.createSectionSuccess, (state, { section }) => ({
		...state,
		status: ClassSectionStateStatus.IDLING,
		classSections: [section, ...state.classSections],
	})),
	on(ClassSectionsActions.updateSectionSuccess, (state, { section }) => {
		const updatedSection = section;
		return {
			...state,
			status: ClassSectionStateStatus.IDLING,
			selectedSection: section,
			classSections: state.classSections.map((cs) =>
				cs._id === updatedSection._id ? updatedSection : cs,
			),
		};
	}),
	on(ClassSectionsActions.deleteSectionSuccess, (state, { id }) => ({
		...state,
		status: ClassSectionStateStatus.IDLING,
		selectedSection:
			state.selectedSection?._id === id ? null : state.selectedSection,
		classSections: state.classSections.filter(
			(section) => section._id !== id,
		),
	})),
);
