import { createReducer, on } from '@ngrx/store';
import { UserSubscription } from '../../interfaces/user-subscription';
import * as SubscriptionActions from '../actions/subscriptions.actions';

export interface SubscriptionsState {
	user_subscriptions: UserSubscription[];
	user_subscription: any;
	result: any;
	loading: boolean;
	error: any;
}

export const initialState: SubscriptionsState = {
	user_subscription: null,
	user_subscriptions: [],
	result: null,
	loading: true,
	error: null,
};

export const subscriptionReducer = createReducer(
	initialState,
	on(
		SubscriptionActions.loadSubscriptionSuccess,
		(state, { user_subscriptions }) => ({
			...state,
			user_subscriptions,
			loading: false,
		}),
	),
	on(
		SubscriptionActions.checkSubscriptionSuccess,
		(state, { user_subscription }) => ({
			...state,
			user_subscription,
			loading: false,
		}),
	),
	on(
		SubscriptionActions.findSubscriptionSuccess,
		(state, { user_subscription }) => ({
			...state,
			user_subscription,
			loading: false,
		}),
	),
	on(
		SubscriptionActions.findSubscriptionByUserSuccess,
		(state, { user_subscription }) => ({
			...state,
			user_subscription,
			loading: false,
		}),
	),
	on(
		SubscriptionActions.createSubscriptionSuccess,
		(state, { user_subscription }) => ({
			...state,
			user_subscription,
			loading: false,
		}),
	),
	on(SubscriptionActions.updateSubscriptionSuccess, (state, { result }) => ({
		...state,
		result,
		loading: false,
	})),
	on(SubscriptionActions.deleteSubscriptionSuccess, (state, { result }) => ({
		...state,
		result,
		loading: false,
	})),
	on(SubscriptionActions.loadSubscriptionFailure, (state, { error }) => ({
		...state,
		error,
		loading: false,
	})),
	on(SubscriptionActions.checkSubscriptionFailure, (state, { error }) => ({
		...state,
		error,
		loading: false,
	})),
	on(SubscriptionActions.findSubscriptionFailure, (state, { error }) => ({
		...state,
		error,
		loading: false,
	})),
	on(
		SubscriptionActions.findSubscriptionByUserFailure,
		(state, { error }) => ({ ...state, error, loading: false }),
	),
	on(SubscriptionActions.createSubscriptionFailure, (state, { error }) => ({
		...state,
		error,
		loading: false,
	})),
	on(SubscriptionActions.updateSubscriptionFailure, (state, { error }) => ({
		...state,
		error,
		loading: false,
	})),
	on(SubscriptionActions.deleteSubscriptionFailure, (state, { error }) => ({
		...state,
		error,
		loading: false,
	})),
);
