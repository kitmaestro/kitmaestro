import { HttpInterceptorFn } from '@angular/common/http';

export const appInterceptor: HttpInterceptorFn = (req, next) => {
	const clone = req.clone({ withCredentials: true });
	return next(clone);
};
