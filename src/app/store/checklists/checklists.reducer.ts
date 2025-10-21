import { createReducer, on } from '@ngrx/store';
import * as ChecklistsActions from './checklists.actions';
import {
	initialChecklistsState,
	ChecklistStateStatus,
} from './checklists.models';
import { Checklist } from '../../core/models';

export const checklistsReducer = createReducer(
	initialChecklistsState,

	// Set status for ongoing operations
	on(ChecklistsActions.loadChecklist, (state) => ({
		...state,
		status: ChecklistStateStatus.LOADING_CHECKLIST,
	})),
	on(ChecklistsActions.loadChecklists, (state) => ({
		...state,
		status: ChecklistStateStatus.LOADING_CHECKLISTS,
	})),
	on(ChecklistsActions.createChecklist, (state) => ({
		...state,
		status: ChecklistStateStatus.CREATING_CHECKLIST,
	})),
	on(ChecklistsActions.updateChecklist, (state) => ({
		...state,
		status: ChecklistStateStatus.UPDATING_CHECKLIST,
	})),
	on(ChecklistsActions.deleteChecklist, (state) => ({
		...state,
		status: ChecklistStateStatus.DELETING_CHECKLIST,
	})),

	// Handle failure cases
	on(
		ChecklistsActions.loadChecklistFailed,
		ChecklistsActions.loadChecklistsFailed,
		ChecklistsActions.createChecklistFailed,
		ChecklistsActions.updateChecklistFailed,
		ChecklistsActions.deleteChecklistFailed,
		(state, { error }) => ({
			...state,
			status: ChecklistStateStatus.IDLING,
			error,
		}),
	),

	// Handle success cases
	on(ChecklistsActions.loadChecklistSuccess, (state, { checklist }) => ({
		...state,
		status: ChecklistStateStatus.IDLING,
		selectedChecklist: checklist,
	})),
	on(ChecklistsActions.loadChecklistsSuccess, (state, { checklists }) => ({
		...state,
		status: ChecklistStateStatus.IDLING,
		checklists,
	})),
	on(ChecklistsActions.createChecklistSuccess, (state, { checklist }) => ({
		...state,
		status: ChecklistStateStatus.IDLING,
		checklists: [checklist, ...state.checklists],
	})),
	on(ChecklistsActions.updateChecklistSuccess, (state, { checklist }) => {
		const updatedChecklist = checklist;
		return {
			...state,
			status: ChecklistStateStatus.IDLING,
			selectedChecklist:
				state.selectedChecklist?._id === updatedChecklist._id
					? updatedChecklist
					: state.selectedChecklist,
			checklists: state.checklists.map((c) =>
				c._id === updatedChecklist._id ? updatedChecklist : c,
			),
		};
	}),
	on(ChecklistsActions.deleteChecklistSuccess, (state, { id }) => ({
		...state,
		status: ChecklistStateStatus.IDLING,
		selectedChecklist:
			state.selectedChecklist?._id === id
				? null
				: state.selectedChecklist,
		checklists: state.checklists.filter((c) => c._id !== id),
	})),
);
