import { ApplicationConfig, importProvidersFrom, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { provideServiceWorker } from '@angular/service-worker';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideAnimationsAsync(),
    importProvidersFrom(provideFirebaseApp(() => initializeApp({
      "projectId": "kit-maestro",
      "appId": "1:604854508995:web:589737edbf2038209c7176",
      "storageBucket": "kit-maestro.appspot.com",
      "apiKey": "AIzaSyAStMcbRBeZa5VEBbCRNQUPfd1zO1Y3Kws",
      "authDomain": "kit-maestro.firebaseapp.com",
      "messagingSenderId": "604854508995"
    }))),
    importProvidersFrom(provideAuth(() => getAuth())),
    importProvidersFrom(provideFirestore(() => getFirestore())),
    importProvidersFrom(provideStorage(() => getStorage())),
    provideServiceWorker('ngsw-worker.js', {
        enabled: !isDevMode(),
        registrationStrategy: 'registerWhenStable:30000'
    }), provideAnimationsAsync(),
    // importProvidersFrom(AdsenseModule.forRoot({ adClient: 'ca-pub-3940117372405832' })),
  ],
};
