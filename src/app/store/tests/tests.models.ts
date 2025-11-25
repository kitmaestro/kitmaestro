import { Test } from '../../core/models';

export interface TestDto {
	section: string;
	subject: string;
	user: string;
	body: string;
	answers: string;
}

export enum TestStateStatus {
	IDLING,
	LOADING_TESTS,
	LOADING_TEST,
	CREATING_TEST,
	UPDATING_TEST,
	DELETING_TEST,
}

export interface TestsState {
	tests: Test[];
	selectedTest: Test | null;
	error: string | null;
	status: TestStateStatus;
}

export const initialTestsState: TestsState = {
	tests: [],
	selectedTest: null,
	error: null,
	status: TestStateStatus.IDLING,
};
