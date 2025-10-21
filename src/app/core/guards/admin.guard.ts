import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { filter, firstValueFrom, map } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectAuthState } from '../../store/auth/auth.selectors';

export const adminGuard: CanActivateFn = async (route, state) => {
	const store = inject(Store);
	const router = inject(Router);
	try {
		const user = await firstValueFrom(
			store.select(selectAuthState).pipe(
				filter((state) => !!state && state.initialized),
				map((state) => state.user),
			),
		);
		return (
			(!!user && ['orgalay.dev@gmail.com'].includes(user.email)) ||
			router.parseUrl('/')
		);
	} catch (e) {
		console.log(e);
		return false;
	}
};
