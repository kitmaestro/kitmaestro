import { Component, inject, OnInit, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, finalize, switchMap } from 'rxjs';
import { AuthService } from '../core/services/auth.service';
import { User } from '../core/interfaces/user';
import { NavigationComponent } from './components/navigation.component';
import { LoadingComponent } from '../shared/ui/loading.component';

@Component({
	selector: 'app-main-layout',
	imports: [RouterOutlet, NavigationComponent, LoadingComponent],
	standalone: true,
	template: `
		<app-loading [loading]="loading()"></app-loading>
		<app-navigation (signOut)="reset()"></app-navigation>
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
	#authService = inject(AuthService);
	#router = inject(Router);

	user = signal<User | null>(null);
	loading = signal(true);

	redirectToLogin() {
		const next = location.pathname;
		this.loading.set(false);
		if (!next.includes('auth')) {
			this.#router.navigate(['/auth', 'login'], {
				queryParams: { next },
			});
		}
	}

	reset() {
		this.loading.set(true);
		this.user.set(null);
		setTimeout(() => {
			this.loading.set(false);
		}, 1300);
	}

	ngOnInit() {
		this.#authService
			.profile()
			.pipe(
				switchMap(() => this.#authService.profile()),
				filter((event) => event instanceof NavigationEnd),
				finalize(() => this.loading.set(false)),
			)
			.subscribe({
				next: (user) => {
					if (!user) {
						return this.redirectToLogin();
					}
					this.user.set(user);
					this.loading.set(false);
				},
				error: (err) => {
					this.redirectToLogin();
					console.log(err.message);
					this.loading.set(false);
				},
			});
	}
}
