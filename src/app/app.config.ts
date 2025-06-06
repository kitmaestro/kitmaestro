import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideServiceWorker } from '@angular/service-worker';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { provideMarkdown } from 'ngx-markdown';
import { appInterceptor } from './core/interceptors/app.interceptor';

export const appConfig: ApplicationConfig = {
	providers: [
		provideRouter(routes),
		provideHttpClient(
			withInterceptors([appInterceptor]),
		),
		provideAnimationsAsync(),
		provideServiceWorker('ngsw-worker.js', {
			enabled: !isDevMode(),
			registrationStrategy: 'registerWhenStable:30000',
		}),
		provideAnimationsAsync(),
		provideFirebaseApp(() =>
			initializeApp({
				projectId: 'kit-maestro',
				appId: '1:604854508995:web:589737edbf2038209c7176',
				storageBucket: 'kit-maestro.appspot.com',
				locationId: 'us-central',
				apiKey: 'AIzaSyAStMcbRBeZa5VEBbCRNQUPfd1zO1Y3Kws',
				authDomain: 'kit-maestro.firebaseapp.com',
				messagingSenderId: '604854508995',
			} as any),
		),
		provideStorage(() => getStorage()),
		provideMarkdown(),
		// importProvidersFrom(AdsenseModule.forRoot({ adClient: 'ca-pub-3940117372405832' })),
	],
};
