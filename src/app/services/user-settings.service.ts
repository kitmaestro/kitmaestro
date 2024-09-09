import { Injectable, inject } from '@angular/core';
import { Auth, User, authState } from '@angular/fire/auth';
import { DocumentReference, Firestore, addDoc, collection, collectionData, deleteDoc, doc, docData, query, updateDoc, where } from '@angular/fire/firestore';
import { EMPTY, Observable, concatAll, from, map, of } from 'rxjs';
import { UserSettings } from '../interfaces/user-settings';

const defaultUserSettings: UserSettings = {
  uid: '',
  id: '',
  title: '',
  firstname: '',
  lastname: '',
  gender: '',
  phone: '',
  schoolName: '',
  district: '',
  regional: '',
  grades: '',
  subjects: '',
  photoURL: '',
  likedResources: [],
  dislikedResources: [],
  bookmarks: [],
};

@Injectable({
  providedIn: 'root'
})
export class UserSettingsService {

  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private settingsColRef = collection(this.firestore, 'user-settings');
  private user$: Observable<User | null> = authState(this.auth);

  createSettings(data: UserSettings = defaultUserSettings): Observable<UserSettings> {
    return this.user$.pipe(
      map(user => {
        if (user) {
          data.uid = user.uid;
          return from(addDoc(this.settingsColRef, data) as Promise<DocumentReference<UserSettings>>).pipe(
            map(ref => docData(doc(this.firestore, 'user-settings/' + ref.id), { idField: 'id' }) as Observable<UserSettings>),
            concatAll()
          );
        }
        return EMPTY;
      }),
      concatAll()
    )
  }

  getSettings(userId?: string): Observable<UserSettings> {
    if (userId) {
      return (collectionData(query(this.settingsColRef, where('uid', '==', userId)), { idField: 'id' }) as Observable<UserSettings[]>).pipe(
        map(subs => {
          const settings = subs[0];
          if (settings) {
            return of(settings);
          }
          return this.createSettings()
        }),
        concatAll()
      )
    }
    return this.user$.pipe(
      map(user => {
        if (user) {
          return (collectionData(query(this.settingsColRef, where('uid', '==', user.uid)), { idField: 'id' }) as Observable<UserSettings[]>).pipe(
            map(subs => {
              const settings = subs[0];
              if (settings) {
                return of(settings);
              }
              return this.createSettings()
            }),
            concatAll()
          )
        }
        return EMPTY;
      }),
      concatAll(),
    )
  }

  deleteSettings(id: string) {
    const userSettingsCollection = collectionData(query(this.settingsColRef, where('uid', '==', id)), { idField: 'id' }) as Observable<UserSettings[]>
    const subscription = userSettingsCollection.subscribe(col => {
      subscription.unsubscribe();
      col.forEach(element => {
        deleteDoc(doc(this.firestore, 'user-settings', element.id)).then(() => {
          console.log('Deleted %s', element.id);
        });
      })
    })
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
