import { Component, OnInit, inject } from '@angular/core';
import { UserSubscription } from '../interfaces/user-subscription';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { EMPTY, Observable, map, tap } from 'rxjs';
import { Auth, authState } from '@angular/fire/auth';
import { Firestore, collection, collectionData, where, query } from '@angular/fire/firestore';

@Component({
  selector: 'app-premium-wrapper',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    MatCardModule,
    MatListModule,
    MatButtonModule,
  ],
  templateUrl: './premium-wrapper.component.html',
  styleUrl: './premium-wrapper.component.scss'
})
export class PremiumWrapperComponent implements OnInit {
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
