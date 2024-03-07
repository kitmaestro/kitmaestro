import { Injectable, inject } from '@angular/core';
import { Auth, User, authState } from '@angular/fire/auth';
import { Firestore, collection, collectionData, doc, query, updateDoc, where } from '@angular/fire/firestore';
import { EMPTY, Observable, map } from 'rxjs';
import { UserSettings } from '../interfaces/user-settings';

@Injectable({
  providedIn: 'root'
})
export class UserSettingsService {

  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private settingsColRef = collection(this.firestore, 'user-settings');
  private user$ = authState(this.auth);
  private user: User | null = null;

  constructor() {
    const sus = this.user$.subscribe(user => {this.user = user; sus.unsubscribe();});
  }

  getSettings(): Observable<UserSettings> {
    if (this.user) {
      return (collectionData(query(this.settingsColRef, where('uid', '==', this.user.uid)), { idField: 'id' }) as Observable<UserSettings[]>).pipe(
        map(subs => {
          const settings = subs[0];
          return settings;
        })
      )
    }
    return EMPTY;
  }

  setPhotoUrl(photoURL: string): Observable<Promise<boolean>> {
    return this.getSettings().pipe(
      map(async settings => {
        try {
          await updateDoc(doc(this.firestore, 'user-settings/' + settings.id), { photoURL });
          return true;
        } catch (err) {
          return false;
        }
      })
    );
  }
}
