import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.models';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectAuthUser = createSelector(
	selectAuthState,
	(state) => state.user,
);

export const selectAuthError = createSelector(
	selectAuthState,
	(state) => state.error,
);

export const selectAuthLoading = createSelector(
	selectAuthState,
	(state) => state.loading,
);

export const selectIsAuthenticated = createSelector(
	selectAuthState,
	(authState) => authState.initialized && !!authState.user,
);

export const selectSigningIn = createSelector(
	selectAuthState,
	(state) => state.status.signingIn,
);

export const selectSigningOut = createSelector(
	selectAuthState,
	(state) => state.status.signingOut,
);

export const selectSigningUp = createSelector(
	selectAuthState,
	(state) => state.status.signingUp,
);

export const selectUpdating = createSelector(
	selectAuthState,
	(state) => state.status.updating,
);

export const selectConfirmingEmail = createSelector(
	selectAuthState,
	(state) => state.status.confirmingEmail,
);

export const selectRequestingEmail = createSelector(
	selectAuthState,
	(state) => state.status.requestingEmail,
);

export const selectCheckingAuth = createSelector(
	selectAuthState,
	(state) => state.status.checkingAuth,
);

export const selectAuthUserSettings = createSelector(
	selectAuthUser,
	(user) => user ? user.settings || {
		complementaryActivitiesInClassPlans: true,
		achievementIndicatorInClassPlans: true,
		preferredUnitPlanScheme: 'unitplan1',
		preferredClassPlanScheme: 'classplan1',
		preferredTemplateColor: '#00b0ff'
	} : null
);
