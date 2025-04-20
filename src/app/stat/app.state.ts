import {
	AuthState,
	initialState as initialAuthState,
} from './reducers/auth.reducers';
import {
	DidacticResourceState,
	initialState as initialDidacticResourcesState,
} from './reducers/didactic-resources.reducers';
import {
	initialState as initialSubscripionState,
	SubscriptionsState,
} from './reducers/subscriptions.reducers';
import {
	initialState as initialUpdatesState,
	UpdatesState,
} from './reducers/updates.reducers';

export interface AppState {
	auth: AuthState;
	didacticResources: DidacticResourceState;
	userSubscription: SubscriptionsState;
	updates: UpdatesState;
}

export const initialAppState: AppState = {
	auth: initialAuthState,
	didacticResources: initialDidacticResourcesState,
	userSubscription: initialSubscripionState,
	updates: initialUpdatesState,
};
