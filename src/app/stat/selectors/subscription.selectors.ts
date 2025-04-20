import { createSelector } from '@ngrx/store';
import { AppState } from '../app.state';
import { SubscriptionsState } from '../reducers/subscriptions.reducers';

export const selectUserSubscription = (state: AppState) =>
	state.userSubscription;

export const userSubscriptionSelector = createSelector(
	selectUserSubscription,
	(sub: SubscriptionsState) => sub.user_subscription,
);

export const userSubscriptionsSelector = createSelector(
	selectUserSubscription,
	(sub: SubscriptionsState) => sub.user_subscriptions,
);

export const userSubscriptionLoadingSelector = createSelector(
	selectUserSubscription,
	(sub: SubscriptionsState) => sub.loading,
);

export const userSubscriptionResultSelector = createSelector(
	selectUserSubscription,
	(sub: SubscriptionsState) => sub.result,
);

export const userSubscriptionErrorSelector = createSelector(
	selectUserSubscription,
	(sub: SubscriptionsState) => sub.error,
);
