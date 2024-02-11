import { ApplicationConfig, importProvidersFrom, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getAnalytics, provideAnalytics, ScreenTrackingService, UserTrackingService } from '@angular/fire/analytics';
import { initializeAppCheck, ReCaptchaEnterpriseProvider, provideAppCheck } from '@angular/fire/app-check';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getFunctions, provideFunctions } from '@angular/fire/functions';
import { getMessaging, provideMessaging } from '@angular/fire/messaging';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { provideStore } from '@ngrx/store';
import { provideServiceWorker } from '@angular/service-worker';
import { USE_EMULATOR as USE_AUTH_EMULATOR } from '@angular/fire/compat/auth';
import { USE_EMULATOR as USE_FIRESTORE_EMULATOR } from '@angular/fire/compat/firestore';
// import { USE_EMULATOR as USE_AUTH_EMULATOR } from '@angular/fire';
import { USE_EMULATOR as USE_STORAGE_EMULATOR } from '@angular/fire/compat/storage';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
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
    importProvidersFrom(provideAnalytics(() => getAnalytics())),
    ScreenTrackingService,
    UserTrackingService,
    importProvidersFrom(provideFirestore(() => getFirestore())),
    importProvidersFrom(provideFunctions(() => getFunctions())),
    importProvidersFrom(provideMessaging(() => getMessaging())),
    importProvidersFrom(provideStorage(() => getStorage())),
    provideStore(),
    provideServiceWorker('ngsw-worker.js', {
        enabled: !isDevMode(),
        registrationStrategy: 'registerWhenStable:30000'
    }),
    { provide: USE_AUTH_EMULATOR, useValue: isDevMode() ? ['localhost', 9099] : undefined },
    { provide: USE_FIRESTORE_EMULATOR, useValue: isDevMode() ? ['localhost', 8080] : undefined },
    { provide: USE_STORAGE_EMULATOR, useValue: isDevMode() ? ['localhost', 9199] : undefined },
]
};
