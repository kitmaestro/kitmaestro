import { MainTheme } from '../../core/models'

export interface MainThemeDto {
    level: string
    year: string
    subject: string
    category: string
    topics: string[]
}

export enum MainThemeStateStatus {
    IDLING,
    LOADING_THEMES,
    LOADING_THEME,
    CREATING_THEME,
    UPDATING_THEME,
    DELETING_THEME,
}

export interface MainThemesState {
    themes: MainTheme[]
    selectedTheme: MainTheme | null
    error: string | null
    status: MainThemeStateStatus
}

export const initialMainThemesState: MainThemesState = {
    themes: [],
    selectedTheme: null,
    error: null,
    status: MainThemeStateStatus.IDLING,
}
