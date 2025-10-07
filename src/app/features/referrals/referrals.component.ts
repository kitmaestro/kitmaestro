import { Component, inject, OnInit } from '@angular/core';
import { IsPremiumComponent } from '../../shared/ui/is-premium.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { AuthService } from '../../core/services/auth.service';
import { UserSubscriptionService } from '../../core/services/user-subscription.service';
import { User } from '../../core/interfaces';
import { CurrencyPipe } from '@angular/common';
import { ReferralsService } from '../../core/services/referrals.service';
import { Referral } from '../../core/interfaces/referral';
import { RouterLink } from '@angular/router';
import { concatMap, forkJoin, map, Observable } from 'rxjs';
import { UserSubscription } from '../../core/interfaces/user-subscription';

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
	templateUrl: './referrals.component.html',
	styleUrl: './referrals.component.scss',
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
