import { createReducer, on } from '@ngrx/store'
import * as MainThemesActions from './main-themes.actions'
import { initialMainThemesState, MainThemeStateStatus } from './main-themes.models'

export const mainThemesReducer = createReducer(
    initialMainThemesState,

    // Set status for ongoing operations
    on(MainThemesActions.loadTheme, state => ({
        ...state,
        status: MainThemeStateStatus.LOADING_THEME,
    })),
    on(MainThemesActions.loadThemes, state => ({
        ...state,
        status: MainThemeStateStatus.LOADING_THEMES,
    })),
    on(MainThemesActions.createTheme, state => ({
        ...state,
        status: MainThemeStateStatus.CREATING_THEME,
    })),
    on(MainThemesActions.updateTheme, state => ({
        ...state,
        status: MainThemeStateStatus.UPDATING_THEME,
    })),
    on(MainThemesActions.deleteTheme, state => ({
        ...state,
        status: MainThemeStateStatus.DELETING_THEME,
    })),

    // Handle failure cases
    on(
        MainThemesActions.loadThemeFailed,
        MainThemesActions.loadThemesFailed,
        MainThemesActions.createThemeFailed,
        MainThemesActions.updateThemeFailed,
        MainThemesActions.deleteThemeFailed,
        (state, { error }) => ({ ...state, status: MainThemeStateStatus.IDLING, error }),
    ),

    // Handle success cases
    on(MainThemesActions.loadThemeSuccess, (state, { theme }) => ({
        ...state,
        status: MainThemeStateStatus.IDLING,
        selectedTheme: theme,
    })),
    on(MainThemesActions.loadThemesSuccess, (state, { themes }) => ({
        ...state,
        status: MainThemeStateStatus.IDLING,
        themes,
    })),
    on(MainThemesActions.createThemeSuccess, (state, { theme }) => ({
        ...state,
        status: MainThemeStateStatus.IDLING,
        themes: [theme, ...state.themes],
    })),
    on(MainThemesActions.updateThemeSuccess, (state, { theme: updatedTheme }) => ({
        ...state,
        status: MainThemeStateStatus.IDLING,
        selectedTheme:
            state.selectedTheme?._id === updatedTheme._id ? updatedTheme : state.selectedTheme,
        themes: state.themes.map(t => (t._id === updatedTheme._id ? updatedTheme : t)),
    })),
    on(MainThemesActions.deleteThemeSuccess, (state, { id }) => ({
        ...state,
        status: MainThemeStateStatus.IDLING,
        selectedTheme: state.selectedTheme?._id === id ? null : state.selectedTheme,
        themes: state.themes.filter(t => t._id !== id),
    })),
)
