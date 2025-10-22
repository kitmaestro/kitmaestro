import { createAction, props } from '@ngrx/store'
import { UserSubscription } from '../../core/models'
import { UserSubscriptionDto } from './user-subscriptions.models'

// Load a single subscription (admin find)
export const loadSubscription = createAction(
    '[User Subscriptions] Load Subscription',
    props<{ id: string }>(),
)
export const loadSubscriptionSuccess = createAction(
    '[User Subscriptions] Load Subscription Success',
    props<{ subscription: UserSubscription }>(),
)
export const loadSubscriptionFailed = createAction(
    '[User Subscriptions] Load Subscription Failed',
    props<{ error: string }>(),
)

// Load all subscriptions (admin findAll)
export const loadSubscriptions = createAction('[User Subscriptions] Load Subscriptions')
export const loadSubscriptionsSuccess = createAction(
    '[User Subscriptions] Load Subscriptions Success',
    props<{ subscriptions: UserSubscription[] }>(),
)
export const loadSubscriptionsFailed = createAction(
    '[User Subscriptions] Load Subscriptions Failed',
    props<{ error: string }>(),
)

// Load current user's subscription (checkSubscription)
export const loadCurrentSubscription = createAction(
    '[User Subscriptions] Load Current Subscription',
)
export const loadCurrentSubscriptionSuccess = createAction(
    '[User Subscriptions] Load Current Subscription Success',
    props<{ subscription: UserSubscription | null }>(),
)
export const loadCurrentSubscriptionFailed = createAction(
    '[User Subscriptions] Load Current Subscription Failed',
    props<{ error: string }>(),
)

// Load a specific user's subscription (findByUser)
export const loadUserSubscription = createAction(
    '[User Subscriptions] Load User Subscription',
    props<{ userId: string }>(),
)
// (reutiliza loadCurrentSubscriptionSuccess/Failed)

// Create/Subscribe/Add Referral
export const createSubscription = createAction(
    '[User Subscriptions] Create Subscription',
    props<{ data: Partial<UserSubscriptionDto> }>(),
)
export const subscribe = createAction(
    '[User Subscriptions] Subscribe',
    props<{
        subscriptionType: string
        method: string
        duration: number
        amount: number
        user?: string
    }>(),
)
export const addReferral = createAction(
    '[User Subscriptions] Add Referral',
    props<{ referral: Partial<UserSubscriptionDto> }>(),
)
export const createSubscriptionSuccess = createAction(
    '[User Subscriptions] Create Subscription Success',
    props<{ subscription: UserSubscription }>(),
)
export const createSubscriptionFailed = createAction(
    '[User Subscriptions] Create Subscription Failed',
    props<{ error: string }>(),
)

// Update Referral
export const updateReferral = createAction(
    '[User Subscriptions] Update Referral',
    props<{ id: string; data: Partial<UserSubscriptionDto> }>(),
)
export const updateSubscriptionSuccess = createAction(
    '[User Subscriptions] Update Subscription Success',
    props<{ subscription: UserSubscription }>(),
)
export const updateSubscriptionFailed = createAction(
    '[User Subscriptions] Update Subscription Failed',
    props<{ error: string }>(),
)

// Delete Referral
export const deleteReferral = createAction(
    '[User Subscriptions] Delete Referral',
    props<{ id: string }>(),
)
export const deleteSubscriptionSuccess = createAction(
    '[User Subscriptions] Delete Subscription Success',
    props<{ id: string }>(),
)
export const deleteSubscriptionFailed = createAction(
    '[User Subscriptions] Delete Subscription Failed',
    props<{ error: string }>(),
)
