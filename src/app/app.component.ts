import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { loadAuthUser } from './store/auth';

@Component({
	selector: 'app-root',
	imports: [RouterOutlet],
	template: '<router-outlet />',
})
export class AppComponent {
	#store = inject(Store)

	ngOnInit() {
		this.#store.dispatch(loadAuthUser())
	}
}
