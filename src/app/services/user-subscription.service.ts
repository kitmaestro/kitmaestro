import { Injectable, inject } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import { Firestore, addDoc, collection, collectionData, doc, query, updateDoc, where } from '@angular/fire/firestore';
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
  
  public subscription$: Observable<UserSubscription | undefined> = this.user$.pipe(
    map(user => {
      if (user) {
        return (collectionData(query(this.subscriptionColRef, where('uid', '==', user.uid)), { idField: 'id' }) as Observable<UserSubscription[]>).pipe(
          map(subs => subs[0])
        );
      }
      return of(undefined);
    }),
    concatAll()
  );

  public isPremium(): Observable<boolean> {
    return this.subscription$.pipe(
      map(subscription => {
        if (subscription) {
          return subscription.active;
        } else {
          return false;
        }
      })
    );
  }

  public updateSubscription(subscription: UserSubscription) {
    return updateDoc(doc(this.firestore, 'user-subscriptions', subscription.id), { ...subscription })
  }

  public subscribe(subscription: UserSubscription) {
    return addDoc(this.subscriptionColRef, subscription);
  }
}
