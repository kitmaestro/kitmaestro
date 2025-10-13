import { Component, inject, OnInit } from '@angular/core';
import { IsPremiumComponent } from '../../../shared/ui/is-premium.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { AuthService } from '../../../core/services/auth.service';
import { UserSubscriptionService } from '../../../core/services/user-subscription.service';
import { User } from '../../../core/interfaces';
import { CurrencyPipe } from '@angular/common';
import { ReferralsService } from '../../../core/services/referrals.service';
import { Referral } from '../../../core/interfaces/referral';
import { RouterLink } from '@angular/router';
import { concatMap, forkJoin, map, Observable } from 'rxjs';
import { UserSubscription } from '../../../core/interfaces/user-subscription';

@Component({
	selector: 'app-referrals',
	imports: [
		IsPremiumComponent,
		MatCardModule,
		MatButtonModule,
		MatTableModule,
		MatIconModule,
		CurrencyPipe,
		RouterLink,
		CurrencyPipe,
	],
	template: `
		<app-is-premium>
			<mat-card>
				<mat-card-header>
					<h2 mat-card-title style="margin-top: 8px">Panel de Comisiones</h2>
					<a
						class="desktop"
						target="_blank"
						[disabled]="!refCode"
						[href]="waShareableLink"
						mat-icon-button
						color="success"
						style="margin-left: auto"
						title="Compartir mi Enlace"
					>
						<i class="bi bi-whatsapp"></i>
					</a>
					<a
						class="mobile"
						target="_blank"
						[disabled]="!refCode"
						[href]="waMobileShareableLink"
						mat-icon-button
						color="success"
						style="margin-left: auto"
						title="Compartir mi Enlace"
					>
						<i class="bi bi-whatsapp"></i>
					</a>
					<a
						target="_blank"
						[disabled]="!refCode"
						[href]="tgShareableLink"
						mat-icon-button
						color="success"
						style="margin-left: 12px"
						title="Compartir mi Enlace"
					>
						<i class="bi bi-telegram"></i>
					</a>
				</mat-card-header>
			</mat-card>

			<div class="card-grid" style="margin-bottom: 24px">
				<mat-card>
					<mat-card-header>
						<h2 style="margin-left: auto; margin-right: auto">
							Referidos Este Mes
						</h2>
					</mat-card-header>
					<mat-card-content>
						<div class="giant">{{ refs.thisMonth }}</div>
					</mat-card-content>
				</mat-card>
				<mat-card>
					<mat-card-header>
						<h2 style="margin-left: auto; margin-right: auto">
							Anteriores
						</h2>
					</mat-card-header>
					<mat-card-content>
						<div class="giant">{{ refs.before }}</div>
					</mat-card-content>
				</mat-card>
				<mat-card>
					<mat-card-header>
						<h2 style="margin-left: auto; margin-right: auto">
							Pendientes
						</h2>
					</mat-card-header>
					<mat-card-content>
						<div class="giant">{{ refs.pending }}</div>
					</mat-card-content>
				</mat-card>
				<mat-card>
					<mat-card-header>
						<h2 style="margin-left: auto; margin-right: auto">Pagados</h2>
					</mat-card-header>
					<mat-card-content>
						<div class="giant">{{ refs.paid }}</div>
					</mat-card-content>
				</mat-card>
			</div>
			<div class="card-grid-2">
				<mat-card>
					<mat-card-header>
						<h2 style="margin-left: auto; margin-right: auto">
							Usuarios Referidos
						</h2>
					</mat-card-header>
					<mat-card-content>
						<div class="giant">{{ refs.before + refs.thisMonth }}</div>
					</mat-card-content>
				</mat-card>
				<mat-card>
					<mat-card-header>
						<h2 style="margin-left: auto; margin-right: auto">
							Comisiones Ganadas
						</h2>
					</mat-card-header>
					<mat-card-content>
						<div class="giant">
							{{ (refs.paid + refs.pending) * 9.99 | currency }}
						</div>
					</mat-card-content>
				</mat-card>
			</div>

			<div style="margin-top: 24px">
				<mat-card-title>Mis Referidos</mat-card-title>
			</div>

			<table
				mat-table
				[dataSource]="referrals"
				class="mat-elevation-z4"
				style="margin-top: 24px"
			>
				<ng-container matColumnDef="user">
					<th mat-header-cell *matHeaderCellDef>Usuario</th>
					<td mat-cell *matCellDef="let element">
						{{
							element.ref.referred.firstname
								? element.ref.referred.firstname +
									" " +
									element.ref.referred.lastname
								: element.ref.referred.email
						}}
					</td>
				</ng-container>
				<ng-container matColumnDef="plan">
					<th mat-header-cell *matHeaderCellDef>Plan Elegido</th>
					<td mat-cell *matCellDef="let element">
						{{ element.subscription.subscriptionType }}
					</td>
				</ng-container>
				<ng-container matColumnDef="status">
					<th mat-header-cell *matHeaderCellDef>
						Estado de la Suscripci&oacute;n
					</th>
					<td mat-cell *matCellDef="let element">
						{{
							element.subscription.status === "active"
								? "Activa"
								: "Inactiva"
						}}
					</td>
				</ng-container>
				<ng-container matColumnDef="comision">
					<th mat-header-cell *matHeaderCellDef>Comisi&oacute;n</th>
					<td mat-cell *matCellDef="let element">
						{{ element.subscription.amount * 0.2 | currency }}
					</td>
				</ng-container>
				<ng-container matColumnDef="comision-status">
					<th mat-header-cell *matHeaderCellDef>
						Estado de la Comisi&oacute;n
					</th>
					<td mat-cell *matCellDef="let element">
						{{
							element.ref.status === "pending"
								? "Pendiente"
								: element.status
						}}
					</td>
				</ng-container>
				<ng-container matColumnDef="actions">
					<th mat-header-cell *matHeaderCellDef>Acciones</th>
					<td mat-cell *matCellDef="let element">
						<button
							[routerLink]="['/teachers', element._id]"
							color="primary"
							mat-icon-button
						>
							<mat-icon>open_in_new</mat-icon>
						</button>
						<button mat-icon-button color="link">
							<i class="bi bi-whatsapp"></i>
						</button>
					</td>
				</ng-container>

				<tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
				<tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
			</table>
			<div style="height: 32px"></div>
		</app-is-premium>
	`,
	styles: `
		.giant {
			font-size: 5em;
			text-align: center;
			padding: 24px;
		}

		.card-grid-2 {
			display: grid;
			gap: 16px;
			margin-top: 24px;
			grid-template-columns: 1fr;

			@media screen and (min-width: 960px) {
				grid-template-columns: 1fr 1fr;
			}
		}

		.card-grid {
			display: grid;
			gap: 16px;
			margin-top: 24px;
			grid-template-columns: 1fr;

			@media screen and (min-width: 960px) {
				grid-template-columns: 1fr 1fr;
			}

			@media screen and (min-width: 1200px) {
				grid-template-columns: 1fr 1fr 1fr 1fr;
			}
		}

		.shadow {
			box-shadow: 10px 10px 14px 0px rgba(0, 0, 0, 0.75);
			-webkit-box-shadow: 10px 10px 14px 0px rgba(0, 0, 0, 0.75);
			-moz-box-shadow: 10px 10px 14px 0px rgba(0, 0, 0, 0.75);
		}

		.mobile {
			display: block;

			@media screen and (min-width: 960px) {
				display: none;
			}
		}

		.desktop {
			display: none;

			@media screen and (min-width: 960px) {
				display: block;
			}
		}
	`,
})
export class ReferralsComponent implements OnInit {
	private userSubscriptionService = inject(UserSubscriptionService);
	private referralService = inject(ReferralsService);
	private authService = inject(AuthService);

	user: User | null = null;
	referrals: Observable<{ ref: Referral; subscription: UserSubscription }[]> =
		this.referralService.findAll().pipe(
			concatMap((referrals) => {
				return forkJoin(
					referrals.map((ref) =>
						this.userSubscriptionService
							.findByUser(ref.referred._id)
							.pipe(
								map((subscription) => ({ ref, subscription })),
							),
					),
				);
			}),
		);
	displayedColumns = [
		'user',
		'plan',
		'status',
		'comision',
		'comision-status',
		// 'actions',
	];

	base = 'https://web.whatsapp.com/send?text=';
	mobileBase = 'https://api.whatsapp.com/send?text=';
	tgBase = 'https://t.me/share/url?';
	text = `¿Qué esperas para formar parte de la revolución educativa del siglo? 🌟

Regístrate en KitMaestro ahora. La app es gratis y, con mi enlace, obtienes un 20% de descuento y una prueba gratuita de la suscripción premium.
¡No te pierdas esta oportunidad de transformar tu vida!

https://kit-maestro.web.app/app/?ref=`;
	tgText = `¿Qué esperas para formar parte de la revolución educativa del siglo? 🌟

Regístrate en KitMaestro ahora. La app es gratis y, con mi enlace, obtienes un 20% de descuento y una prueba gratuita de la suscripción premium.
¡No te pierdas esta oportunidad de transformar tu vida!`;
	refCode = '';

	refs = {
		thisMonth: 0,
		before: 0,
		paid: 0,
		pending: 0,
	};

	ngOnInit() {
		this.authService.profile().subscribe({
			next: (user) => {
				this.user = user;
				this.refCode = user.refCode;
			},
		});
		this.referralService.findAll().subscribe((refs) => {
			// this.referrals = refs;
			const currentMonth = new Date().getMonth();
			const currentYear = new Date().getFullYear();
			this.refs.thisMonth = refs.filter(
				(r) =>
					r.date &&
					new Date(r.date).getMonth() === currentMonth &&
					new Date(r.date).getFullYear() === currentYear,
			).length;
			this.refs.before = refs.length - this.refs.thisMonth;
			this.refs.paid = refs.filter((r) => r.status === 'paid').length;
			this.refs.pending = refs.filter(
				(r) => r.status === 'pending',
			).length;
		});
	}

	get waMobileShareableLink() {
		return this.mobileBase + encodeURIComponent(this.text + this.refCode);
	}

	get waShareableLink() {
		return this.base + encodeURIComponent(this.text + this.refCode);
	}

	get tgShareableLink() {
		return (
			this.tgBase +
			'text=' +
			encodeURIComponent(this.text + this.refCode) +
			'&url=' +
			encodeURIComponent(
				'https://kit-maestro.web.app/app/?ref=' + this.refCode,
			)
		);
	}
}
