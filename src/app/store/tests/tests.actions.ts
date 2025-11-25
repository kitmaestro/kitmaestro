import { createAction, props } from '@ngrx/store';
import { Test } from '../../core/models';
import { TestDto } from './tests.models';

// Load a single test
export const loadTest = createAction(
	'[Tests] Load Test',
	props<{ id: string }>(),
);
export const loadTestSuccess = createAction(
	'[Tests] Load Test Success',
	props<{ test: Test }>(),
);
export const loadTestFailed = createAction(
	'[Tests] Load Test Failed',
	props<{ error: string }>(),
);

// Load all tests
export const loadTests = createAction(
	'[Tests] Load Tests',
	props<{ filters: any }>(),
);
export const loadTestsSuccess = createAction(
	'[Tests] Load Tests Success',
	props<{ tests: Test[] }>(),
);
export const loadTestsFailed = createAction(
	'[Tests] Load Tests Failed',
	props<{ error: string }>(),
);

// Create a test
export const createTest = createAction(
	'[Tests] Create Test',
	props<{ test: Partial<TestDto> }>(),
);
export const createTestSuccess = createAction(
	'[Tests] Create Test Success',
	props<{ test: Test }>(),
);
export const createTestFailed = createAction(
	'[Tests] Create Test Failed',
	props<{ error: string }>(),
);

// Update a test
export const updateTest = createAction(
	'[Tests] Update Test',
	props<{ id: string; data: Partial<TestDto> }>(),
);
export const updateTestSuccess = createAction(
	'[Tests] Update Test Success',
	props<{ test: Test }>(),
);
export const updateTestFailed = createAction(
	'[Tests] Update Test Failed',
	props<{ error: string }>(),
);

// Delete a test
export const deleteTest = createAction(
	'[Tests] Delete Test',
	props<{ id: string }>(),
);
export const deleteTestSuccess = createAction(
	'[Tests] Delete Test Success',
	props<{ id: string }>(),
);
export const deleteTestFailed = createAction(
	'[Tests] Delete Test Failed',
	props<{ error: string }>(),
);

// Download a test
export const downloadTest = createAction(
	'[Tests] Download Test',
	props<{ test: Test }>(),
);
export const downloadTestSuccess = createAction(
	'[Tests] Download Test Success',
);
export const downloadTestFailed = createAction(
	'[Tests] Download Test Failed',
	props<{ error: string }>(),
);
