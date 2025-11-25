import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { filter, firstValueFrom, map } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectAuthState } from '../../store/auth';

export const authGuard: CanActivateFn = async (route, state) => {
	const router = inject(Router);
	const store = inject(Store);
	const authRoute: UrlTree = router.parseUrl('/auth/login');

	try {
		const profile = await firstValueFrom(
			store.select(selectAuthState).pipe(
				filter(
					(state) => !!state && !state.loading && state.initialized,
				),
				map((state) => !!state.user),
			),
		);
		if (profile) return true;
		else return authRoute;
	} catch (error) {
		console.log(error);
		return authRoute;
	}
};
