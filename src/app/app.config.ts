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
import { provideStore } from '@ngrx/store';
import { reducers, metaReducers } from './reducers';
import { provideEffects } from '@ngrx/effects';
import { AppEffects } from './app.effects';
import { AuthEffects } from './store/auth';
import { UsersEffects } from './store/users';
import { ClassPlansEffects } from './store/class-plans/class-plans.effects';
import {
	ClassSectionsEffects,
	CompetenceEntriesEffects,
	ContentBlocksEffects,
	DiagnosticEvaluationsEffects,
	DidacticResourcesEffects,
	EstimationScalesEffects,
	UnitPlansEffects,
	IdeasEffects,
	LogRegistryEntriesEffects,
	MainThemesEffects,
	ObservationGuidesEffects,
	ReadingActivitiesEffects,
	RubricsEffects,
	ScoreSystemsEffects,
	StudentsEffects,
	TestsEffects,
	SubjectConceptListsEffects,
	TodoListsEffects,
	TodosEffects,
	UpdatesEffects,
	UserSubscriptionsEffects,
	AiEffects,
	DidacticSequencesEffects,
	DidacticPlansEffects,
	DidacticActivitiesEffects,
	ActivityResourcesEffects,
} from './store';
import { ChecklistsEffects } from './store/checklists/checklists.effects';
import { provideRouterStore } from '@ngrx/router-store';

export const appConfig: ApplicationConfig = {
	providers: [
		provideRouter(routes),
		provideHttpClient(withInterceptors([appInterceptor])),
		provideAnimationsAsync(),
		provideServiceWorker('ngsw-worker.js', {
			enabled: !isDevMode(),
			registrationStrategy: 'registerWhenStable:30000',
		}),
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
		provideStore(reducers, { metaReducers }),
		provideEffects(
			AppEffects,
			AuthEffects,
			UsersEffects,
			ClassPlansEffects,
			ClassSectionsEffects,
			ChecklistsEffects,
			ContentBlocksEffects,
			DiagnosticEvaluationsEffects,
			EstimationScalesEffects,
			UnitPlansEffects,
			CompetenceEntriesEffects,
			DidacticResourcesEffects,
			IdeasEffects,
			LogRegistryEntriesEffects,
			MainThemesEffects,
			ObservationGuidesEffects,
			ReadingActivitiesEffects,
			RubricsEffects,
			ScoreSystemsEffects,
			StudentsEffects,
			SubjectConceptListsEffects,
			TestsEffects,
			TodoListsEffects,
			TodosEffects,
			UpdatesEffects,
			UserSubscriptionsEffects,
			MainThemesEffects,
			DidacticSequencesEffects,
			DidacticPlansEffects,
			AiEffects,
			DidacticActivitiesEffects,
			ActivityResourcesEffects,
		),
		provideRouterStore(),
	],
};
