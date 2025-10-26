import { Component, inject, OnInit } from '@angular/core';
import { Update } from '../../../core';
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
	template: `
		<mat-card style="margin-bottom: 42px">
			<mat-card-header>
				<h2>Notificaciones</h2>
				@if (authorUser) {
					<span style="flex: 1 1 auto"></span>
					<button
						mat-icon-button
						type="button"
						routerLink="/updates/new"
						color="primary"
					>
						<mat-icon>add</mat-icon>
					</button>
				}
			</mat-card-header>
		</mat-card>
		<mat-accordion>
			@for (update of updates$ | async; track update; let i = $index) {
				<mat-expansion-panel [expanded]="i === 0">
					<mat-expansion-panel-header>
						<mat-panel-title>{{ update.title }}</mat-panel-title>
						<mat-panel-description>{{
							update.description
						}}</mat-panel-description>
					</mat-expansion-panel-header>
					<p>
						<b>{{ update.author }}</b
						><br />
						{{ update.date | date: 'dd/MM/yyyy' }}
						<br /><br />
						@if (update.type === 'notice') {
							<i>Actualizaci&oacute;n</i>
						} @else if (update.type === 'feature') {
							<i>¡Nueva Funci&oacute;n Disponible!</i>
						} @else {
							<i>¡Error Arreglado!</i>
						}
						<br /><br />
						@for (
							paragraph of update.content.split(
								'
'
							);
							track $index
						) {
							{{ paragraph }}
							@if (
								$index <
								update.content.split(
									'
'
								).length -
									1
							) {
								<br /><br />
							}
						}
						<span style="display: block; margin-top: 24px">
							@for (action of update.actions; track action) {
								<button
									mat-raised-button
									color="link"
									style="margin-right: 12px"
									[routerLink]="action.link"
								>
									{{ action.label }}
								</button>
							}
							@for (link of update.links || []; track link) {
								<a
									mat-raised-button
									color="link"
									style="margin-right: 12px"
									[target]="link.external ? '_blank' : ''"
									[href]="link.link"
									>{{ link.label }}</a
								>
							}
						</span>
					</p>
				</mat-expansion-panel>
			}
		</mat-accordion>
	`,
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
