import { Injectable, inject } from '@angular/core';
import { Auth, User, authState } from '@angular/fire/auth';
import { Firestore, collection, collectionData, query, where } from '@angular/fire/firestore';
import { Observable, map, of } from 'rxjs';
import { UserSubscription } from '../interfaces/user-subscription';

@Injectable({
  providedIn: 'root'
})
export class UserSubscriptionService {

  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private subscriptionColRef = collection(this.firestore, 'user-subscriptions');
  private user$ = authState(this.auth);
  private user: User | null = null;

  constructor() {
    this.user$.subscribe(user => this.user = user);
  }

  isPremium(): Observable<boolean> {
    if (this.user) {
      return (collectionData(query(this.subscriptionColRef, where('uid', '==', this.user.uid))) as Observable<UserSubscription[]>).pipe(
        map(subs => {
          const userSub = subs[0];
          if (!userSub) {
            return false;
          }
          return userSub.active;
        })
      )
    }
    return of(false);
  }
}
