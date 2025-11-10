import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { loadAuthUser } from './store/auth';

@Component({
	selector: 'app-root',
	imports: [RouterOutlet],
	template: '<router-outlet />',
})
export class AppComponent implements OnInit {
	#store = inject(Store);

	ngOnInit() {
		this.#store.dispatch(loadAuthUser());
	}
}
