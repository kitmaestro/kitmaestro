import { ApplicationConfig, importProvidersFrom, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { provideStore } from '@ngrx/store';
import { provideServiceWorker } from '@angular/service-worker';
import { provideEffects } from '@ngrx/effects';
import { AuthEffects } from './state/effects/auth.effects';
import { authReducer } from './state/reducers/auth.reducers';
import { provideHttpClient } from '@angular/common/http';
import { updatesReducer } from './state/reducers/updates.reducers';
import { UpdatesEffects } from './state/effects/updates.effects';
import { didacticResourcesReducer } from './state/reducers/didactic-resources.reducers';
import { DidacticResourcesEffects } from './state/effects/didactic-resources.effects';

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
    }),
    provideStore({
      auth: authReducer,
      updates: updatesReducer,
      didacticResources: didacticResourcesReducer,
    }),
    provideEffects([
      AuthEffects,
      UpdatesEffects,
      DidacticResourcesEffects,
    ])
  ],
};
