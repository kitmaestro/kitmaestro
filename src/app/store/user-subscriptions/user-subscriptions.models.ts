import { UserSubscription } from "../../core/models"

export interface UserSubscriptionDto {
    user: string
    subscriptionType: string
    name: string
    status: string
    startDate: Date
    endDate: Date
    method: string
    amount: number
}

export enum UserSubscriptionStateStatus {
    IDLING,
    LOADING_SUBSCRIPTIONS,
    LOADING_SUBSCRIPTION,
    LOADING_CURRENT_SUBSCRIPTION,
    CREATING_SUBSCRIPTION,
    UPDATING_SUBSCRIPTION,
    DELETING_SUBSCRIPTION,
}

export interface UserSubscriptionsState {
    subscriptions: UserSubscription[] // Para findAll (admin)
    currentSubscription: UserSubscription | null // Para checkSubscription / findByUser
    selectedSubscription: UserSubscription | null // Para find (admin)
    error: string | null
    status: UserSubscriptionStateStatus
}

export const initialUserSubscriptionsState: UserSubscriptionsState = {
    subscriptions: [],
    currentSubscription: null,
    selectedSubscription: null,
    error: null,
    status: UserSubscriptionStateStatus.IDLING,
}
