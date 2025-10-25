import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ChecklistsState, ChecklistStateStatus } from './checklists.models';

export const selectChecklistsState =
	createFeatureSelector<ChecklistsState>('checklists');

export const selectAllChecklists = createSelector(
	selectChecklistsState,
	(state) => state.checklists,
);

export const selectCurrentChecklist = createSelector(
	selectChecklistsState,
	(state) => state.selectedChecklist,
);

export const selectChecklistsStatus = createSelector(
	selectChecklistsState,
	(state) => state.status,
);

export const selectChecklistsError = createSelector(
	selectChecklistsState,
	(state) => state.error,
);

export const selectChecklistsLoading = createSelector(
	selectChecklistsState,
	(state) => state.status === ChecklistStateStatus.LOADING_CHECKLISTS,
)

export const selectChecklistLoading = createSelector(
	selectChecklistsState,
	(state) => state.status === ChecklistStateStatus.LOADING_CHECKLIST,
)

export const selectChecklistCreating = createSelector(
	selectChecklistsState,
	(state) => state.status === ChecklistStateStatus.CREATING_CHECKLIST,
)

export const selectChecklistUpdating = createSelector(
	selectChecklistsState,
	(state) => state.status === ChecklistStateStatus.UPDATING_CHECKLIST,
)

export const selectChecklistDeleting = createSelector(
	selectChecklistsState,
	(state) => state.status === ChecklistStateStatus.DELETING_CHECKLIST,
)

export const selectChecklistDownloading = createSelector(
	selectChecklistsState,
	(state) => state.status === ChecklistStateStatus.DOWNLOADING_CHECKLIST,
)
