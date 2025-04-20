import { Component, OnInit, inject } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { UserSettingsComponent } from '../user-settings/user-settings.component';
import { UserProfileComponent } from '../user-profile/user-profile.component';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Auth, authState, signOut } from '@angular/fire/auth';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { Observable, tap } from 'rxjs';
import { UserSubscription } from '../interfaces/user-subscription';
import { UserSettingsService } from '../services/user-settings.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatBadgeModule } from '@angular/material/badge';
import { QuoteDialogComponent } from '../ui/quote-dialog/quote-dialog.component';
import { UserSubscriptionService } from '../services/user-subscription.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
	selector: 'app-dashboard',
	standalone: true,
	imports: [
		MatTabsModule,
		MatBadgeModule,
		UserSettingsComponent,
		UserProfileComponent,
		MatToolbarModule,
		MatIconModule,
		MatButtonModule,
		RouterModule,
		MatMenuModule,
		MatSidenavModule,
		MatListModule,
		MatDialogModule,
		CommonModule,
		HttpClientModule,
	],
	templateUrl: './dashboard.component.html',
	styleUrl: './dashboard.component.scss',
})
export class OldDashboardComponent implements OnInit {
	auth = inject(Auth);
	sb = inject(MatSnackBar);
	router = inject(Router);
	route = inject(ActivatedRoute);
	activatedRoute = '';
	userSettingsService = inject(UserSettingsService);
	userSubscriptionService = inject(UserSubscriptionService);
	userSettings$ = this.userSettingsService.getSettings();
	subscription$: Observable<UserSubscription | undefined> =
		this.userSubscriptionService.subscription$.pipe(
			tap((_) => (this.loading = false)),
		);
	loading = true;
	dialog = inject(MatDialog);

	ngOnInit() {
		this.activatedRoute = location.pathname;
		this.router.events.subscribe({
			next: () => {
				this.activatedRoute = location.pathname;
			},
		});
		authState(this.auth).subscribe((user) => {
			if (user) {
				const referrer = localStorage.getItem('referrer');
				if (referrer) {
					this.subscription$.subscribe({
						next: (subscription) => {
							if (!subscription) {
								const sub: UserSubscription = {
									active: false,
									referral: referrer,
									referries: '',
									refsCount: 0,
									expiresAt: new Date(),
									method: 'none',
									purchaseDate: new Date(),
									refCode: '',
									uid: user.uid,
								} as any as UserSubscription;
								this.userSubscriptionService.subscribe(sub);
							}
							if (subscription && !subscription.referral) {
								// assign a referral
								subscription.referral = referrer;
								// update subscription
								this.userSubscriptionService.updateSubscription(
									subscription,
								);
								localStorage.removeItem('referrer');
							}
						},
						error: (error) => {},
					});
				}
				const referral = this.route.snapshot.queryParamMap.get('ref');
				if (referral) {
					this.subscription$.subscribe({
						next: (subscription) => {
							console.log(subscription);
							if (!subscription) {
								const sub: UserSubscription = {
									active: false,
									referral,
									referries: '',
									refsCount: 0,
									expiresAt: new Date(),
									method: 'none',
									purchaseDate: new Date(),
									refCode: '',
									uid: user.uid,
								} as any as UserSubscription;
								this.userSubscriptionService.subscribe(sub);
							}
							if (subscription && !subscription.referral) {
								// assign a referral
								subscription.referral = referral;
								// update subscription
								this.userSubscriptionService.updateSubscription(
									subscription,
								);
							}
						},
						error: (error) => {},
					});
				}
			} else {
				this.router.navigate(['/auth', 'login'], {
					queryParamsHandling: 'merge',
					queryParams: { next: window.location.pathname },
				});
			}
		});
	}

	logout() {
		signOut(this.auth).then(() => {
			this.router.navigate(['/auth', 'login']).then(() => {
				this.sb.open('Has cerrado sesión. Hasta luego!', 'Ok', {
					duration: 4000,
				});
			});
		});
	}

	openQuoteDialog() {
		this.dialog.open(QuoteDialogComponent, {});
	}
}
