import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
	selector: 'app-auth-container',
	imports: [RouterModule, MatCardModule],
	templateUrl: './auth-container.component.html',
	styleUrl: './auth-container.component.scss',
})
export class AuthContainerComponent {
	private router = inject(Router);
	private authService = inject(AuthService);
	private user = this.authService.profile();

	constructor() {
		this.user.subscribe((user) => {
			if (user) {
				this.router.navigate(['/']);
			}
		});
	}
}
