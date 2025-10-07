import { Component, Input, inject } from '@angular/core';
import { DidacticResource } from '../../../core/interfaces/didactic-resource';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { DidacticResourceService } from '../../../core/services/didactic-resource.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UserService } from '../../../core/services/user.service';
import { sha512_256 } from 'js-sha512';
import { User } from '../../../core/interfaces';
import { PretifyPipe } from '../../../shared/pipes/pretify.pipe';

@Component({
	selector: 'app-resource-card',
	imports: [
		MatCardModule,
		MatButtonModule,
		MatDialogModule,
		MatSnackBarModule,
		RouterLink,
		CommonModule,
		PretifyPipe,
		MatIconModule,
	],
	template: `
		@if (resource) {
			<mat-card style="max-width: 100%">
				<mat-card-content>
					<div class="grid">
						<div
							class="img"
							style="background: url('{{
								resource.preview
							}}') center; background-size: cover; width: 100%;"
						></div>
						<div>
							<h2>{{ resource.title }}</h2>
							<p>{{ resource.description }}</p>
							<p>
								<b
									>Nivel{{
										resource.level.length > 1 ? 'es' : ''
									}}</b
								>:
								@for (level of resource.level; track $index) {
									{{ $index > 0 ? ', ' : ''
									}}{{ level | pretify }}
								}
							</p>
							<p>
								<b
									>Grado{{
										resource.grade.length > 1 ? 's' : ''
									}}</b
								>:
								@for (grade of resource.grade; track $index) {
									{{ $index > 0 ? ', ' : ''
									}}{{ grade | pretify }}
								}
							</p>
							<p>
								<b
									>&Aacute;rea{{
										resource.subject.length > 1 ? 's' : ''
									}}</b
								>:
								@for (
									subject of resource.subject;
									track $index
								) {
									{{ $index > 0 ? ', ' : ''
									}}{{ subject | pretify }}
								}
							</p>
							<div
								style="
									display: flex;
									margin-bottom: 24px;
									align-items: center;
								"
								routerLink="/users/{{ resource.author._id }}"
							>
								<img
									src="https://gravatar.com/avatar/{{
										gravatar(resource.author.email)
									}}"
									style="
										width: 32px;
										margin-right: 8px;
										border-radius: 50%;
									"
								/>
								<span style="flex: 1 1 auto"
									>{{ resource.author.firstname }}
									{{ resource.author.lastname }}</span
								>
							</div>
							@if (resource.price === 0) {
								<div class="price">
									<div class="integer free">
										&iexcl;GRATIS!
									</div>
								</div>
							} @else {
								<div class="price">
									<div class="integer">
										RD&#36;{{ getInteger(resource.price) }}
									</div>
									<div class="decimals">
										.{{ getDecimals(resource.price) }}
									</div>
								</div>
							}
							<div
								style="margin-top: 24px; display: flex; gap: 12px"
							>
								<button mat-button (click)="bookmark()">
									{{ resource.bookmarks }}
									<mat-icon>bookmark</mat-icon>
								</button>
								<button
									mat-flat-button
									color="primary"
									type="button"
									[routerLink]="'/resources/' + resource._id"
								>
									Detalles
								</button>
							</div>
						</div>
					</div>
				</mat-card-content>
			</mat-card>
		}
	`,
	styles: `
		.btn-group {
			display: flex;
			width: 100%;
			gap: 8px;
			margin-top: 12px;
			margin-bottom: 12px;

			button {
				display: block;
				width: 100%;
			}
		}

		.price {
			display: flex;
			justify-content: flex-start;
			align-items: flex-start;
			margin-top: 12px;

			.integer {
				font-weight: bold;
				font-size: x-large;

				&.free {
					font-style: italic;
				}
			}

			.decimals {
				font-size: 12px;
				margin-top: 0;
				line-height: 1;
			}
		}

		.grid {
			display: grid;
			gap: 12px;
			grid-template-columns: 1fr 3fr;

			// div.img {
			// aspect-ratio: 1/1;
			//}
		}
	`,
})
export class ResourceCardComponent {
	settingsService = inject(UserService);
	@Input() resource: DidacticResource | null = null;
	@Input() owned = false;

	didacticResourceService = inject(DidacticResourceService);
	sb = inject(MatSnackBar);
	user: User | null = null;

	bookmarked = false;

	load() {
		this.settingsService.getSettings().subscribe((user) => {
			this.user = user;
			if (this.resource)
				this.bookmarked = user.bookmarks.includes(this.resource?._id);
		});
	}

	bookmark() {
		if (this.resource) {
			if (this.user) {
				if (this.user.bookmarks.includes(this.resource._id)) {
					return;
				}
			}
			const sus = this.didacticResourceService
				.bookmark(this.resource._id)
				.subscribe({
					next: (res) => {
						sus.unsubscribe();
						if (res.modifiedCount > 0) {
							this.sb.open(
								'El recurso ha sido guardado en tu biblioteca!',
								'Ok',
								{ duration: 2500 },
							);
						}
						this.load();
					},
				});
		}
	}

	getInteger(n?: number) {
		return n ? `${n}`.split('.')[0] : '0';
	}

	getDecimals(n?: number) {
		return n ? `${n}`.split('.').reverse()[0].padStart(2, '0') : '00';
	}

	gravatar(email: string) {
		return sha512_256(email.trim().toLowerCase());
	}
}
