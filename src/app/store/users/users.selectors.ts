import { createFeatureSelector, createSelector } from "@ngrx/store"
import { UsersState } from "./users.models"

export const selectUsersState = createFeatureSelector<UsersState>('users')

export const selectUsersCurrentUser = createSelector(
    selectUsersState,
    (state) => state.selectedUser
)

export const selectUsersStatus = createSelector(
    selectUsersState,
    (state) => state.status
)

export const selectUsersUsers = createSelector(
    selectUsersState,
    (state) => state.users,
)

export const selectUsersError = createSelector(
    selectUsersState,
    (state) => state.error
)
