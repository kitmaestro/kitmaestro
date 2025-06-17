import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services';
import { lastValueFrom } from 'rxjs';

export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const authRoute: UrlTree = router.parseUrl('/auth/login');
  try {
    const profile = await lastValueFrom(authService.profile());
    if (profile && profile._id)
      return true;
    else
		return authRoute
} catch (error) {
	console.log(error)
	return authRoute
  }
};
