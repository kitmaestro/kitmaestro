import { createReducer, on } from '@ngrx/store';
import * as UserSubscriptionsActions from './user-subscriptions.actions';
import {
	initialUserSubscriptionsState,
	UserSubscriptionStateStatus,
} from './user-subscriptions.models';
import { UserSubscription } from '../../core/models';

export const userSubscriptionsReducer = createReducer(
	initialUserSubscriptionsState,

	// Set status for ongoing operations
	on(UserSubscriptionsActions.loadSubscription, (state) => ({
		...state,
		status: UserSubscriptionStateStatus.LOADING_SUBSCRIPTION,
	})),
	on(UserSubscriptionsActions.loadSubscriptions, (state) => ({
		...state,
		status: UserSubscriptionStateStatus.LOADING_SUBSCRIPTIONS,
	})),
	on(
		UserSubscriptionsActions.loadCurrentSubscription,
		UserSubscriptionsActions.loadUserSubscription,
		(state) => ({
			...state,
			status: UserSubscriptionStateStatus.LOADING_CURRENT_SUBSCRIPTION,
		}),
	),
	on(
		UserSubscriptionsActions.createSubscription,
		UserSubscriptionsActions.subscribe,
		UserSubscriptionsActions.addReferral,
		(state) => ({
			...state,
			status: UserSubscriptionStateStatus.CREATING_SUBSCRIPTION,
		}),
	),
	on(UserSubscriptionsActions.updateReferral, (state) => ({
		...state,
		status: UserSubscriptionStateStatus.UPDATING_SUBSCRIPTION,
	})),
	on(UserSubscriptionsActions.deleteReferral, (state) => ({
		...state,
		status: UserSubscriptionStateStatus.DELETING_SUBSCRIPTION,
	})),

	// Handle failure cases
	on(
		UserSubscriptionsActions.loadSubscriptionFailed,
		UserSubscriptionsActions.loadSubscriptionsFailed,
		UserSubscriptionsActions.loadCurrentSubscriptionFailed,
		UserSubscriptionsActions.createSubscriptionFailed,
		UserSubscriptionsActions.updateSubscriptionFailed,
		UserSubscriptionsActions.deleteSubscriptionFailed,
		(state, { error }) => ({
			...state,
			status: UserSubscriptionStateStatus.IDLING,
			error,
		}),
	),

	// Handle success cases
	on(
		UserSubscriptionsActions.loadSubscriptionSuccess,
		(state, { subscription }) => ({
			...state,
			status: UserSubscriptionStateStatus.IDLING,
			selectedSubscription: subscription,
		}),
	),
	on(
		UserSubscriptionsActions.loadSubscriptionsSuccess,
		(state, { subscriptions }) => ({
			...state,
			status: UserSubscriptionStateStatus.IDLING,
			subscriptions,
		}),
	),
	on(
		UserSubscriptionsActions.loadCurrentSubscriptionSuccess,
		(state, { subscription }) => ({
			...state,
			status: UserSubscriptionStateStatus.IDLING,
			currentSubscription: subscription,
		}),
	),
	on(
		UserSubscriptionsActions.createSubscriptionSuccess,
		(state, { subscription }) => ({
			...state,
			status: UserSubscriptionStateStatus.IDLING,
			subscriptions: [...state.subscriptions, subscription],
			currentSubscription: subscription, // Asumimos que la nueva sub es la actual
		}),
	),
	on(
		UserSubscriptionsActions.updateSubscriptionSuccess,
		(state, { subscription }) => {
			const updatedSubscription = subscription as UserSubscription;
			return {
				...state,
				status: UserSubscriptionStateStatus.IDLING,
				selectedSubscription:
					state.selectedSubscription?._id === updatedSubscription._id
						? updatedSubscription
						: state.selectedSubscription,
				currentSubscription:
					state.currentSubscription?._id === updatedSubscription._id
						? updatedSubscription
						: state.currentSubscription,
				subscriptions: state.subscriptions.map((s) =>
					s._id === updatedSubscription._id ? updatedSubscription : s,
				),
			};
		},
	),
	on(UserSubscriptionsActions.deleteSubscriptionSuccess, (state, { id }) => ({
		...state,
		status: UserSubscriptionStateStatus.IDLING,
		selectedSubscription:
			state.selectedSubscription?._id === id
				? null
				: state.selectedSubscription,
		currentSubscription:
			state.currentSubscription?._id === id
				? null
				: state.currentSubscription,
		subscriptions: state.subscriptions.filter((s) => s._id !== id),
	})),
);
