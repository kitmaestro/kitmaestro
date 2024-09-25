import { createAction, props } from '@ngrx/store';
import { UserSubscription } from '../../interfaces/user-subscription';

export const loadSubscription = createAction('[Subscription] load');

export const loadSubscriptionSuccess = createAction('[Subscription] load success', props<{ user_subscriptions: UserSubscription[] }>());

export const loadSubscriptionFailure = createAction('[Subscription] load failure', props<{ error: any }>());

export const checkSubscription = createAction('[Subscription] check');

export const checkSubscriptionSuccess = createAction('[Subscription] check success', props<{ user_subscription: UserSubscription }>());

export const checkSubscriptionFailure = createAction('[Subscription] check failure', props<{ error: any }>());

export const findSubscription = createAction('[Subscription] find', props<{ id: string }>());

export const findSubscriptionSuccess = createAction('[Subscription] find success', props<{ user_subscription: UserSubscription }>());

export const findSubscriptionFailure = createAction('[Subscription] find success', props<{ error: any }>());

export const findSubscriptionByUser = createAction('[Subscription] find by user', props<{ id: string }>());

export const findSubscriptionByUserSuccess = createAction('[Subscription] find by user success', props<{ user_subscription: UserSubscription }>());

export const findSubscriptionByUserFailure = createAction('[Subscription] find by user success', props<{ error: any }>());

export const createSubscription = createAction('[Subscription] create', props<{ user_subscription: UserSubscription }>());

export const createSubscriptionSuccess = createAction('[Subscription] create success', props<{ user_subscription: UserSubscription }>());

export const createSubscriptionFailure = createAction('[Subscription] create failure', props<{ error: any }>());

export const updateSubscription = createAction('[Subscription] update', props<{ id: string, user_subscription: UserSubscription }>());

export const updateSubscriptionSuccess = createAction('[Subscription] update success', props<{ result: any }>());

export const updateSubscriptionFailure = createAction('[Subscription] update failure', props<{ error: any }>());

export const deleteSubscription = createAction('[Subscription] delete', props<{ id: string }>());

export const deleteSubscriptionSuccess = createAction('[Subscription] delete success', props<{ result: any }>());

export const deleteSubscriptionFailure = createAction('[Subscription] delete failure', props<{ error: any }>());
