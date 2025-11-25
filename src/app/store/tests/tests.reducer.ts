import { createReducer, on } from '@ngrx/store';
import * as TestsActions from './tests.actions';
import { initialTestsState, TestStateStatus } from './tests.models';

export const testsReducer = createReducer(
	initialTestsState,

	// Set status for ongoing operations
	on(TestsActions.loadTest, (state) => ({
		...state,
		status: TestStateStatus.LOADING_TEST,
	})),
	on(TestsActions.loadTests, (state) => ({
		...state,
		status: TestStateStatus.LOADING_TESTS,
	})),
	on(TestsActions.createTest, (state) => ({
		...state,
		status: TestStateStatus.CREATING_TEST,
	})),
	on(TestsActions.updateTest, (state) => ({
		...state,
		status: TestStateStatus.UPDATING_TEST,
	})),
	on(TestsActions.deleteTest, (state) => ({
		...state,
		status: TestStateStatus.DELETING_TEST,
	})),

	// Handle failure cases
	on(
		TestsActions.loadTestFailed,
		TestsActions.loadTestsFailed,
		TestsActions.createTestFailed,
		TestsActions.updateTestFailed,
		TestsActions.deleteTestFailed,
		(state, { error }) => ({
			...state,
			status: TestStateStatus.IDLING,
			error,
		}),
	),

	// Handle success cases
	on(TestsActions.loadTestSuccess, (state, { test }) => ({
		...state,
		status: TestStateStatus.IDLING,
		selectedTest: test,
	})),
	on(TestsActions.loadTestsSuccess, (state, { tests }) => ({
		...state,
		status: TestStateStatus.IDLING,
		tests,
	})),
	on(TestsActions.createTestSuccess, (state, { test }) => ({
		...state,
		status: TestStateStatus.IDLING,
		tests: [test, ...state.tests],
	})),
	on(TestsActions.updateTestSuccess, (state, { test: updatedTest }) => ({
		...state,
		status: TestStateStatus.IDLING,
		selectedTest:
			state.selectedTest?._id === updatedTest._id
				? updatedTest
				: state.selectedTest,
		tests: state.tests.map((t) =>
			t._id === updatedTest._id ? updatedTest : t,
		),
	})),
	on(TestsActions.deleteTestSuccess, (state, { id }) => ({
		...state,
		status: TestStateStatus.IDLING,
		selectedTest:
			state.selectedTest?._id === id ? null : state.selectedTest,
		tests: state.tests.filter((t) => t._id !== id),
	})),
);
