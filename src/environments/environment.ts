import { isDevMode } from '@angular/core';

export const environment = {
	apiUrl: isDevMode()
		? 'http://localhost:3000/'
		: 'https://api.kitmaestro.com/',
};
