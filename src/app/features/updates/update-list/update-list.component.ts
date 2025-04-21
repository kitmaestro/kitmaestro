import { Component, inject, OnInit } from '@angular/core';
import { Update } from '../../../core/interfaces/update';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AsyncPipe, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import {} from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { UpdateService } from '../../../core/services/update.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
	selector: 'app-updates',
	imports: [
		MatCardModule,
		MatExpansionModule,
		MatButtonModule,
		MatIconModule,
		RouterModule,
		DatePipe,
		AsyncPipe,
	],
	templateUrl: './update-list.component.html',
})
export class UpdateListComponent implements OnInit {
	private updateService = inject(UpdateService);
	private authService = inject(AuthService);
	public updates$: Observable<Update[]> = this.updateService.findAll().pipe(
		map((updates) => {
			const sorted = updates.sort(
				(a, b) => +new Date(b.date) - +new Date(a.date),
			);
			return sorted;
		}),
	);
	public authorUser = false;

	authors: string[] = ['orgalay.dev@gmail.com'];

	ngOnInit() {
		this.authService.profile().subscribe((user) => {
			this.authorUser = this.authors.includes(user.email);
		});
	}
}
