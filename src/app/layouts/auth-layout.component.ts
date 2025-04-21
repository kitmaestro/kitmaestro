import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../core/services';

@Component({
	selector: 'app-auth-layout',
	imports: [RouterOutlet],
	standalone: true,
	template: `
		<div class="flex-wrapper">
			<div class="login-card">
				<router-outlet></router-outlet>
			</div>
		</div>
	`,
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
export class AuthLayoutComponent {
	#router = inject(Router);
	#authService = inject(AuthService);
	#user = this.#authService.profile();

	constructor() {
		this.#user.subscribe((user) => {
			if (user) {
				this.#router.navigate(['/']);
			}
		});
	}
}
