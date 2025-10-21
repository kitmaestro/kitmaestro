import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ClassSectionsState } from './class-sections.models';

export const selectClassSectionsState =
	createFeatureSelector<ClassSectionsState>('classSections');

export const selectAllClassSections = createSelector(
	selectClassSectionsState,
	(state) => state.classSections,
);

export const selectCurrentSection = createSelector(
	selectClassSectionsState,
	(state) => state.selectedSection,
);

export const selectClassSectionsStatus = createSelector(
	selectClassSectionsState,
	(state) => state.status,
);

export const selectClassSectionsError = createSelector(
	selectClassSectionsState,
	(state) => state.error,
);
