import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import { Firestore, collection, collectionData, query, where } from '@angular/fire/firestore';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { Observable, EMPTY, map, tap } from 'rxjs';
import { UserSubscription } from '../../interfaces/user-subscription';

@Component({
  selector: 'app-is-premium',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    MatCardModule,
    MatListModule,
    MatButtonModule,
  ],
  templateUrl: './is-premium.component.html',
  styleUrl: './is-premium.component.scss'
})
export class IsPremiumComponent {

  private auth = inject(Auth);
  private firestore = inject(Firestore);
  uid: string = '';
  subscription$: Observable<UserSubscription | undefined> = EMPTY;
  loading = true;

  ngOnInit(): void {
    authState(this.auth).subscribe(user => {
      if (user) {
        this.uid = user.uid;
        const suscriptionRef = collection(this.firestore, 'user-subscriptions');
        const suscriptionsQuery = query(suscriptionRef, where('uid', '==', user.uid));
        this.subscription$ = (collectionData(suscriptionsQuery, { idField: 'id' }) as Observable<UserSubscription[]>).pipe(
          map(col => col[0]),
          tap(_ => this.loading = false)
        );
      }
    })
  }
}
