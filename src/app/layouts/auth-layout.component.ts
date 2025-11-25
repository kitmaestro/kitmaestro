import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectIsAuthenticated } from '../store/auth/auth.selectors';

@Component({
	selector: 'app-auth-layout',
	imports: [RouterOutlet],
	standalone: true,
	template: `<div class="flex-wrapper">
		<div class="login-card"><router-outlet></router-outlet></div>
	</div>`,
	styles: `
		.flex-wrapper {
			display: flex;
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			justify-content: center;
			align-items: center;
			background-image: url('/assets/teacher.jpg');
			background-attachment: fixed;
			background-position: center;
			background-repeat: no-repeat;
			background-size: cover;
		}

		mat-form-field {
			width: 100%;
		}

		.login-card {
			position: absolute;
			top: 0;
			left: 0;
			bottom: 0;
			right: 0;

			form {
				display: flex;
				flex-direction: column;
				justify-content: end;
				min-height: fit-content;

				button {
					width: 100%;
					display: block;
				}
			}

			@media screen and (min-width: 760px) {
				position: static;
				width: 480px;
				margin-left: 64px;
				margin-right: auto;
			}
		}

		.teach-svg {
			display: block;
			width: 50%;
			margin: 42px auto;
		}
	`,
})
export class AuthLayoutComponent implements OnInit {
	#router = inject(Router);
	#store = inject(Store);
	#isAuthenticated = this.#store.select(selectIsAuthenticated);

	ngOnInit() {
		this.#isAuthenticated.subscribe({
			next: (isAuthenticated) => {
				if (isAuthenticated) this.#router.navigateByUrl('/');
			},
		});
	}
}
