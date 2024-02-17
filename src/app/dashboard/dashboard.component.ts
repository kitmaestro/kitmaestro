import { Component, OnInit, inject } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { UserSettingsComponent } from '../user-settings/user-settings.component';
import { UserProfileComponent } from '../user-profile/user-profile.component';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { Auth, authState, signOut } from '@angular/fire/auth';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { Firestore, collection, collectionData, query, where } from '@angular/fire/firestore';
import { EMPTY, Observable, map, tap } from 'rxjs';
import { UserSubscription } from '../interfaces/user-subscription';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    MatTabsModule,
    UserSettingsComponent,
    UserProfileComponent,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
    MatMenuModule,
    MatSidenavModule,
    MatListModule,
    CommonModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  auth = inject(Auth);
  sb = inject(MatSnackBar);
  router = inject(Router);
  private firestore = inject(Firestore);
  activatedRoute = '';
  subscription$: Observable<UserSubscription> = EMPTY;
  loading = true;

  ngOnInit() {
    this.activatedRoute = location.pathname;
    this.router.events.subscribe({
      next: () => {
        this.activatedRoute = location.pathname;
      }
    })
    authState(this.auth).subscribe(user => {
      if (user) {
        const suscriptionRef = collection(this.firestore, 'user-subscriptions');
        const suscriptionsQuery = query(suscriptionRef, where('uid', '==', user.uid));
        this.subscription$ = (collectionData(suscriptionsQuery, { idField: 'id' }) as Observable<UserSubscription[]>).pipe(
          map(col => col[0]),
          tap(_ => this.loading = false),
        );
      }
    })
  }

  logout() {
    signOut(this.auth).then(() => this.sb.open('Haz cerrado sesión. Hasta luego!', 'Ok', { duration: 4000 }));
  }
}
