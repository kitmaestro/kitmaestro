import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { loadAuthUser } from './store/auth';
import { LoadingComponent } from './shared';
import { loadCurrentSubscription } from './store';
import { selectGlobalLoading } from './store/global.selectors';

@Component({
	selector: 'app-root',
	imports: [
		RouterOutlet,
		LoadingComponent,
	],
	template: `
		@if (globalLoading()) {
			<app-loading />
		}
		<router-outlet />
	`,
})
export class AppComponent implements OnInit {
	#store = inject(Store);
	globalLoading = this.#store.selectSignal(selectGlobalLoading);

	ngOnInit() {
		this.#store.dispatch(loadAuthUser());
		this.#store.dispatch(loadCurrentSubscription());
	}
}
