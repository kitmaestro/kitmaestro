import { Component, inject, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { NavigationComponent } from './components/navigation.component';
import { LoadingComponent } from '../shared/ui/loading.component';
import { Store } from '@ngrx/store';
import { selectAuthLoading, selectAuthUser } from '../store/auth/auth.selectors';

@Component({
	selector: 'app-main-layout',
	imports: [RouterOutlet, NavigationComponent, LoadingComponent],
	standalone: true,
	template: `
		<app-loading [loading]="loading()"></app-loading>
		<app-navigation></app-navigation>
		<div class="main-container">
			<router-outlet></router-outlet>
		</div>
	`,
	styles: `
		.loading-back {
			display: flex;
			background-color: #fff;
			position: fixed;
			top: 0;
			bottom: 0;
			left: 0;
			right: 0;
			z-index: 2000;
			justify-content: center;
			align-items: center;
		}

		.page {
			width: 100%;

			.content {
				display: grid;
				grid-template-columns: 25% 25% 25% 25%;

				div {
					height: 50vh;
					max-height: 2.3in;
					display: flex;
					justify-content: center;
					align-items: center;
					padding: 12px;
					font-size: 16pt;
					font-family:
						Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans',
						'Helvetica Neue', sans-serif;
					border: 1px solid #ddd;
				}
			}
		}

		.main-container {
			width: 100%;
			max-width: 1400px;
			margin: 12px auto 42px;
		}

		body {
			background-color: #f2f2f2;
		}
	`,
})
export class MainLayoutComponent implements OnInit {
	#store = inject(Store)
	#router = inject(Router)

	user = this.#store.selectSignal(selectAuthUser)
	loading = this.#store.selectSignal(selectAuthLoading)

	redirectToLogin() {
		const next = location.pathname
		if (!next.includes('auth')) {
			this.#router.navigate(['/auth', 'login'], {
				queryParams: { next },
			})
		}
	}

	ngOnInit() {
		this.#store.select(selectAuthUser)
			.pipe(
				filter((event) => event instanceof NavigationEnd),
			)
			.subscribe({
				next: (user) => {
					if (!user) {
						return this.redirectToLogin();
					}
				},
				error: (err) => {
					this.redirectToLogin();
					console.log(err.message);
				},
			});
	}
}
