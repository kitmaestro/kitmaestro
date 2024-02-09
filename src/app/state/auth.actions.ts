import { User } from "@angular/fire/auth";
import { createActionGroup, props } from "@ngrx/store";

export const AuthActions = createActionGroup({
    source: 'Auth',
    events: {
        login: props<{ user: User }>(),
    }
});
