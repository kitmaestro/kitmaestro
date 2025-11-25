import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
	UserSubscriptionsState,
	UserSubscriptionStateStatus,
} from './user-subscriptions.models';

export const selectUserSubscriptionsState =
	createFeatureSelector<UserSubscriptionsState>('userSubscriptions');

export const selectAllSubscriptions = createSelector(
	selectUserSubscriptionsState,
	(state) => state.subscriptions,
);

export const selectCurrentSubscription = createSelector(
	selectUserSubscriptionsState,
	(state) => state.currentSubscription,
);

export const selectSelectedSubscription = createSelector(
	selectUserSubscriptionsState,
	(state) => state.selectedSubscription,
);

export const selectSubscriptionsStatus = createSelector(
	selectUserSubscriptionsState,
	(state) => state.status,
);

export const selectSubscriptionsError = createSelector(
	selectUserSubscriptionsState,
	(state) => state.error,
);

// Selectores de estado booleanos
export const selectIsLoadingMany = createSelector(
	selectSubscriptionsStatus,
	(status) => status === UserSubscriptionStateStatus.LOADING_SUBSCRIPTIONS,
);

export const selectIsLoadingCurrent = createSelector(
	selectSubscriptionsStatus,
	(status) =>
		status === UserSubscriptionStateStatus.LOADING_CURRENT_SUBSCRIPTION,
);

export const selectIsLoadingOne = createSelector(
	selectSubscriptionsStatus,
	(status) => status === UserSubscriptionStateStatus.LOADING_SUBSCRIPTION,
);

export const selectIsCreating = createSelector(
	selectSubscriptionsStatus,
	(status) => status === UserSubscriptionStateStatus.CREATING_SUBSCRIPTION,
);

export const selectIsUpdating = createSelector(
	selectSubscriptionsStatus,
	(status) => status === UserSubscriptionStateStatus.UPDATING_SUBSCRIPTION,
);

export const selectIsDeleting = createSelector(
	selectSubscriptionsStatus,
	(status) => status === UserSubscriptionStateStatus.DELETING_SUBSCRIPTION,
);

export const selectIsPremium = createSelector(
	selectCurrentSubscription,
	(subscription) =>
		subscription &&
		subscription.subscriptionType !== 'FREE' &&
		new Date(subscription.endDate) > new Date(),
);
