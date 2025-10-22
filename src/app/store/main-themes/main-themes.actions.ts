import { createAction, props } from '@ngrx/store'
import { MainTheme } from '../../core/models'
import { MainThemeDto } from './main-themes.models'

// Load a single theme
export const loadTheme = createAction(
    '[Main Themes] Load Theme',
    props<{ id: string }>(),
)
export const loadThemeSuccess = createAction(
    '[Main Themes] Load Theme Success',
    props<{ theme: MainTheme }>(),
)
export const loadThemeFailed = createAction(
    '[Main Themes] Load Theme Failed',
    props<{ error: string }>(),
)

// Load all themes
export const loadThemes = createAction(
    '[Main Themes] Load Themes',
    props<{ filters: any }>(),
)
export const loadThemesSuccess = createAction(
    '[Main Themes] Load Themes Success',
    props<{ themes: MainTheme[] }>(),
)
export const loadThemesFailed = createAction(
    '[Main Themes] Load Themes Failed',
    props<{ error: string }>(),
)

// Create a theme
export const createTheme = createAction(
    '[Main Themes] Create Theme',
    props<{ theme: Partial<MainThemeDto> }>(),
)
export const createThemeSuccess = createAction(
    '[Main Themes] Create Theme Success',
    props<{ theme: MainTheme }>(),
)
export const createThemeFailed = createAction(
    '[Main Themes] Create Theme Failed',
    props<{ error: string }>(),
)

// Update a theme
export const updateTheme = createAction(
    '[Main Themes] Update Theme',
    props<{ id: string; data: Partial<MainThemeDto> }>(),
)
export const updateThemeSuccess = createAction(
    '[Main Themes] Update Theme Success',
    props<{ theme: MainTheme }>(),
)
export const updateThemeFailed = createAction(
    '[Main Themes] Update Theme Failed',
    props<{ error: string }>(),
)

// Delete a theme
export const deleteTheme = createAction(
    '[Main Themes] Delete Theme',
    props<{ id: string }>(),
)
export const deleteThemeSuccess = createAction(
    '[Main Themes] Delete Theme Success',
    props<{ id: string }>(),
)
export const deleteThemeFailed = createAction(
    '[Main Themes] Delete Theme Failed',
    props<{ error: string }>(),
)
