import { createActionGroup, props } from "@ngrx/store";

export const UserActions = createActionGroup({
    source: 'User',
    events: {
        'login': props<{ email: string, password: string }>(),
        'update profile': props<{ photoUrl: string, displayName: string }>(),
    }
})
