import { createFeatureSelector, createSelector } from '@ngrx/store'
import { ClassSectionsState, ClassSectionStateStatus } from './class-sections.models'

export const selectClassSectionsState =
	createFeatureSelector<ClassSectionsState>('classSections')

export const selectAllClassSections = createSelector(
	selectClassSectionsState,
	(state) => state.classSections,
)

export const selectCurrentSection = createSelector(
	selectClassSectionsState,
	(state) => state.selectedSection,
)

export const selectClassSectionsStatus = createSelector(
	selectClassSectionsState,
	(state) => state.status,
)

export const selectClassSectionsError = createSelector(
	selectClassSectionsState,
	(state) => state.error,
)

export const selectIsLoadingSections = createSelector(
	selectClassSectionsState,
	(state) => state.status === ClassSectionStateStatus.LOADING_SECTIONS,
)

export const selectIsLoadingSection = createSelector(
	selectClassSectionsState,
	(state) => state.status === ClassSectionStateStatus.LOADING_SECTION,
)
