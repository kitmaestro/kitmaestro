import { createFeatureSelector, createSelector } from '@ngrx/store'
import { MainThemesState, MainThemeStateStatus } from './main-themes.models'

export const selectMainThemesState = createFeatureSelector<MainThemesState>('mainThemes')

export const selectAllThemes = createSelector(
    selectMainThemesState,
    state => state.themes,
)

export const selectCurrentTheme = createSelector(
    selectMainThemesState,
    state => state.selectedTheme,
)

export const selectMainThemesStatus = createSelector(
    selectMainThemesState,
    state => state.status,
)

export const selectMainThemesError = createSelector(
    selectMainThemesState,
    state => state.error,
)

// Selectores de estado booleanos
export const selectIsLoadingMany = createSelector(
    selectMainThemesStatus,
    status => status === MainThemeStateStatus.LOADING_THEMES,
)

export const selectIsLoadingOne = createSelector(
    selectMainThemesStatus,
    status => status === MainThemeStateStatus.LOADING_THEME,
)

export const selectIsCreating = createSelector(
    selectMainThemesStatus,
    status => status === MainThemeStateStatus.CREATING_THEME,
)

export const selectIsUpdating = createSelector(
    selectMainThemesStatus,
    status => status === MainThemeStateStatus.UPDATING_THEME,
)

export const selectIsDeleting = createSelector(
    selectMainThemesStatus,
    status => status === MainThemeStateStatus.DELETING_THEME,
)
