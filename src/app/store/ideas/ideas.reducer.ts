import { createReducer, on } from '@ngrx/store';
import * as IdeasActions from './ideas.actions';
import { initialIdeasState, IdeaStateStatus } from './ideas.models';

export const ideasReducer = createReducer(
	initialIdeasState,

	// Set status for ongoing operations
	on(IdeasActions.loadIdea, (state) => ({
		...state,
		status: IdeaStateStatus.LOADING_IDEA,
	})),
	on(IdeasActions.loadIdeas, (state) => ({
		...state,
		status: IdeaStateStatus.LOADING_IDEAS,
	})),
	on(IdeasActions.createIdea, (state) => ({
		...state,
		status: IdeaStateStatus.CREATING_IDEA,
	})),
	on(IdeasActions.updateIdea, (state) => ({
		...state,
		status: IdeaStateStatus.UPDATING_IDEA,
	})),
	on(IdeasActions.deleteIdea, (state) => ({
		...state,
		status: IdeaStateStatus.DELETING_IDEA,
	})),

	// Handle failure cases
	on(
		IdeasActions.loadIdeaFailed,
		IdeasActions.loadIdeasFailed,
		IdeasActions.createIdeaFailed,
		IdeasActions.updateIdeaFailed,
		IdeasActions.deleteIdeaFailed,
		(state, { error }) => ({
			...state,
			status: IdeaStateStatus.IDLING,
			error,
		}),
	),

	// Handle success cases
	on(IdeasActions.loadIdeaSuccess, (state, { idea }) => ({
		...state,
		status: IdeaStateStatus.IDLING,
		selectedIdea: idea,
	})),
	on(IdeasActions.loadIdeasSuccess, (state, { ideas }) => ({
		...state,
		status: IdeaStateStatus.IDLING,
		ideas,
	})),
	on(IdeasActions.createIdeaSuccess, (state, { idea }) => ({
		...state,
		status: IdeaStateStatus.IDLING,
		ideas: [idea, ...state.ideas],
	})),
	on(IdeasActions.updateIdeaSuccess, (state, { idea: updatedIdea }) => ({
		...state,
		status: IdeaStateStatus.IDLING,
		selectedIdea:
			state.selectedIdea?._id === updatedIdea._id
				? updatedIdea
				: state.selectedIdea,
		ideas: state.ideas.map((i) =>
			i._id === updatedIdea._id ? updatedIdea : i,
		),
	})),
	on(IdeasActions.deleteIdeaSuccess, (state, { id }) => ({
		...state,
		status: IdeaStateStatus.IDLING,
		selectedIdea:
			state.selectedIdea?._id === id ? null : state.selectedIdea,
		ideas: state.ideas.filter((i) => i._id !== id),
	})),
);
