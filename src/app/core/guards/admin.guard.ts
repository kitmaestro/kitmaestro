import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services';
import { lastValueFrom } from 'rxjs';

export const adminGuard: CanActivateFn = async (route, state) => {
	const authService = inject(AuthService);
	try {
		const profile = await lastValueFrom(authService.profile());
		return ['orgalay.dev@gmail.com'].includes(profile.email);
	} catch (e) {
		console.log(e);
		return false;
	}
};
