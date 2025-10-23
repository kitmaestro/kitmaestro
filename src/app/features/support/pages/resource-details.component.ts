import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DidacticResource } from '../../../core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { DidacticResourceService } from '../../../core/services/didactic-resource.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UserService } from '../../../core/services/user.service';
import { MatIconModule } from '@angular/material/icon';
import { GravatarPipe } from '../../../shared/pipes/gravatar.pipe';
import { PretifyPipe } from '../../../shared/pipes/pretify.pipe';
import { User } from '../../../core';

@Component({
	selector: 'app-resource-details',
	imports: [
		// SliderComponent,
		CommonModule,
		MatCardModule,
		MatButtonModule,
		MatSnackBarModule,
		GravatarPipe,
		PretifyPipe,
		MatIconModule,
	],
	template: `
		@if (resource) {
			<mat-card class="resource-card">
				<mat-card-header>
					<h2 mat-card-title class="title">{{ resource.title }}</h2>
				</mat-card-header>
				<mat-card-content>
					<h3 mat-card-subtitle class="subtitle">
						<img
							[src]="resource.author.email | gravatar"
							style="border-radius: 50%; width: 32px; height: auto"
							alt="{{ resource.author.firstname }} {{
								resource.author.lastname
							}}"
						/>
						<span
							>{{ resource.author.firstname }}
							{{ resource.author.lastname }}</span
						>
					</h3>
					<div class="content-box">
						<div class="slider-container">
							<!-- <app-slider [slides]="[resource.preview]"></app-slider> -->
						</div>
						<div class="details">
							<p>
								<b>Descripción:</b>
								{{ resource.description }}
							</p>
							<p>
								<b
									>Nivel{{
										resource.level.length > 1 ? 'es' : ''
									}}:</b
								>
								@for (level of resource.level; track $index) {
									{{ $index > 0 ? ', ' : ''
									}}{{ level | pretify }}
								}
							</p>
							<p>
								<b
									>Grado{{
										resource.grade.length > 1 ? 's' : ''
									}}:</b
								>
								@for (grade of resource.grade; track $index) {
									{{ $index > 0 ? ', ' : ''
									}}{{ grade | pretify }}
								}
							</p>
							<p>
								<b
									>&Aacute;rea{{
										resource.subject.length > 1 ? 's' : ''
									}}:</b
								>
								@for (
									subject of resource.subject;
									track $index
								) {
									{{ $index > 0 ? ', ' : ''
									}}{{ subject | pretify }}
								}
							</p>
						</div>
						<div class="purchase-options">
							<div class="price">
								<div class="integer">
									RD&#36;{{ getInteger(resource.price) }}
								</div>
								<div class="decimals">
									.{{ getDecimals(resource.price) }}
								</div>
							</div>
							<div class="btn-container">
								<button
									(click)="
										downloadOrBuy(
											resource.downloadLink,
											resource.price === 0
										)
									"
									mat-flat-button
									color="primary"
								>
									<mat-icon>{{
										resource.price === 0
											? 'download'
											: 'shopping_cart'
									}}</mat-icon>
									{{ resource.downloads }}
									{{
										resource.price === 0
											? 'Descargar'
											: 'Comprar Ahora'
									}}
								</button>
								<button
									mat-raised-button
									color="link"
									(click)="bookmark()"
									[color]="bookmarked ? 'accent' : 'link'"
								>
									<mat-icon>bookmark</mat-icon>
									{{ resource.bookmarks }}
									{{ bookmarked ? 'Olvidar' : 'Guardar' }}
								</button>
							</div>
						</div>
					</div>
				</mat-card-content>
			</mat-card>
		}
	`,
	styles: `
		.resource-card {
			width: 100%;
			max-width: 1200px;
			margin: 0 auto;
		}

		.title {
			font-size: 24pt;
		}

		.subtitle {
			font-size: 18pt;
			display: flex;
			gap: 12px;
			align-items: center;

			span {
				text-decoration: underline;
			}

			img {
				width: 42px;
				height: auto;
			}
		}

		.content-box {
			display: flex;
			gap: 12px;
			position: relative;
		}

		.slider-container {
			flex: 1 1 auto;
			max-width: 420px;
			min-width: 256px;
		}

		.details {
			flex: 1 1 auto;
			max-width: 35%;

			p {
				font-size: 16px;
				font-weight: thin;
				line-height: 1.5;

				b {
					font-size: 18px;
					display: block;
				}

				b,
				span {
					line-height: 1.5;
				}
			}
		}

		.purchase-options {
			margin-left: auto;
			padding: 24px;
			min-width: fit-content;
			max-height: fit-content;
			position: absolute;
			top: 0;
			right: 0;
			border: 1px solid #eee;
			border-radius: 12px;
			box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
		}

		.price {
			display: flex;
			justify-content: center;
			align-items: flex-start;
			max-height: fit-content;
			margin-top: 24px;

			.integer {
				font-weight: bold;
				font-size: 42pt;

				&.free {
					font-style: italic;
					font-size: 16pt;
				}
			}

			.decimals {
				font-size: 12px;
				margin-top: 0;
				line-height: 1;
			}
		}

		.btn-container {
			display: flex;
			flex-direction: column;
			gap: 12px;
			margin-top: 42px;

			button {
				min-width: 256px;
			}
		}
	`,
})
export class ResourceDetailsComponent implements OnInit {
	private route = inject(ActivatedRoute);
	private router = inject(Router);
	private sb = inject(MatSnackBar);
	private didacticResourceService = inject(DidacticResourceService);
	private settingsService = inject(UserService);

	id = this.route.snapshot.paramMap.get('id') || '';
	bookmarked = false;
	downloading = false;
	user: User | null = null;
	resource: DidacticResource | null = null;

	load() {
		this.settingsService.getSettings().subscribe((user) => {
			this.user = user;
			this.bookmarked = user.bookmarks.includes(this.id);
		});
		this.didacticResourceService.findOne(this.id).subscribe({
			next: (resource) => {
				if (resource) this.resource = resource;
			},
			error: (err) => {
				console.log(err);
				this.router.navigateByUrl('/support/resources').then(() => {
					this.sb.open('No se encontro el recurso');
				});
			},
		});
	}

	ngOnInit() {
		this.load();
	}

	getInteger(n?: number) {
		return n ? `${n}`.split('.')[0] : '0';
	}

	getDecimals(n?: number) {
		return n ? `${n}`.split('.').reverse()[0].padStart(2, '0') : '00';
	}

	downloadOrBuy(link: string, download = false) {
		if (!this.id || this.downloading) return;

		this.downloading = true;

		if (download) {
			const a = document.createElement('a') as HTMLAnchorElement;
			document.body.appendChild(a);
			a.style.display = 'none';
			a.href = link;
			a.download = link.split('/').reverse()[0];
			a.target = '_blank';
			a.click();
			document.body.removeChild(a);
			this.didacticResourceService.download(this.id).subscribe((res) => {
				this.load();
			});
			this.downloading = false;
		} else {
			this.downloading = false;
		}
	}

	bookmark() {
		if (!this.id) return;

		this.didacticResourceService.bookmark(this.id).subscribe(() => {
			this.load();
			this.sb.open(
				'El recurso ha sido guardado en tu biblioteca!',
				'Ok',
				{ duration: 2500 },
			);
		});
	}
}
