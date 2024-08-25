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
import { Firestore, collection, collectionData, query, where } from '@angular/fire/firestore';
import { EMPTY, Observable, map, tap } from 'rxjs';
import { UserSubscription } from '../interfaces/user-subscription';
import { UserSettingsService } from '../services/user-settings.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatBadgeModule } from '@angular/material/badge';
import { QuoteDialogComponent } from '../ui/quote-dialog/quote-dialog.component';
import { UserSubscriptionService } from '../services/user-subscription.service';

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
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  auth = inject(Auth);
  sb = inject(MatSnackBar);
  router = inject(Router);
  route = inject(ActivatedRoute);
  private firestore = inject(Firestore);
  activatedRoute = '';
  userSettingsService = inject(UserSettingsService);
  userSubscriptionService = inject(UserSubscriptionService);
  userSettings$ = this.userSettingsService.getSettings();
  subscription$: Observable<UserSubscription | undefined> = this.userSubscriptionService.subscription$.pipe(tap(_ => this.loading = false));
  loading = true;
  dialog = inject(MatDialog);

  ngOnInit() {
    this.activatedRoute = location.pathname;
    this.router.events.subscribe({
      next: () => {
        this.activatedRoute = location.pathname;
      }
    })
    authState(this.auth).subscribe(user => {
      if (user) {
        const referrer = localStorage.getItem('referrer');
        if (referrer) {
          this.subscription$.subscribe({
            next: (subscription) => {
              console.log(subscription)
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
                  uid: user.uid
                } as any as UserSubscription;
                this.userSubscriptionService.subscribe(sub);
              }
              if (subscription && !subscription.referral) {
                // assign a referral
                subscription.referral = referrer;
                // update subscription
                this.userSubscriptionService.updateSubscription(subscription)
                localStorage.removeItem('referrer');
              }
            },
            error: (error) => {
            }
          })
        }
        this.route.queryParamMap.subscribe(params => {
          const referral = params.get('ref');
          if (referral) {
            this.subscription$.subscribe({
              next: (subscription) => {
                console.log(subscription)
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
                    uid: user.uid
                  } as any as UserSubscription;
                  this.userSubscriptionService.subscribe(sub);
                }
                if (subscription && !subscription.referral) {
                  // assign a referral
                  subscription.referral = referral;
                  // update subscription
                  this.userSubscriptionService.updateSubscription(subscription)
                }
              },
              error: (error) => {
              }
            })
          }
        });
      } else {
        console.log('No user!!!')
      }
    })
  }

  logout() {
    signOut(this.auth).then(() => this.sb.open('Haz cerrado sesión. Hasta luego!', 'Ok', { duration: 4000 }));
  }

  openQuoteDialog() {
    this.dialog.open(QuoteDialogComponent, { })
  }
}
