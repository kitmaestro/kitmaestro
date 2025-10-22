import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TestsState, TestStateStatus } from './tests.models';

export const selectTestsState = createFeatureSelector<TestsState>('tests');

export const selectAllTests = createSelector(
	selectTestsState,
	(state) => state.tests,
);

export const selectCurrentTest = createSelector(
	selectTestsState,
	(state) => state.selectedTest,
);

export const selectTestsStatus = createSelector(
	selectTestsState,
	(state) => state.status,
);

export const selectTestsError = createSelector(
	selectTestsState,
	(state) => state.error,
);

// Selectores de estado booleanos
export const selectIsLoadingMany = createSelector(
	selectTestsStatus,
	(status) => status === TestStateStatus.LOADING_TESTS,
);

export const selectIsLoadingOne = createSelector(
	selectTestsStatus,
	(status) => status === TestStateStatus.LOADING_TEST,
);

export const selectIsCreating = createSelector(
	selectTestsStatus,
	(status) => status === TestStateStatus.CREATING_TEST,
);

export const selectIsUpdating = createSelector(
	selectTestsStatus,
	(status) => status === TestStateStatus.UPDATING_TEST,
);

export const selectIsDeleting = createSelector(
	selectTestsStatus,
	(status) => status === TestStateStatus.DELETING_TEST,
);
