import { Injectable, inject } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import { Firestore, collection, collectionData, query, where } from '@angular/fire/firestore';
import { Observable, concatAll, map, of } from 'rxjs';
import { UserSubscription } from '../interfaces/user-subscription';

@Injectable({
  providedIn: 'root'
})
export class UserSubscriptionService {

  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private subscriptionColRef = collection(this.firestore, 'user-subscriptions');
  private user$ = authState(this.auth);

  isPremium(): Observable<boolean> {
    return this.user$.pipe(
      map(user => {
        if (user) {
          return (collectionData(query(this.subscriptionColRef, where('uid', '==', user.uid))) as Observable<UserSubscription[]>).pipe(
            map(subs => subs[0] && subs[0].active)
          )
        }
        return of(false);
      }),
      concatAll()
    );
  }
}
