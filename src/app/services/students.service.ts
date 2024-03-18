import { Injectable, inject } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import { Firestore, collection, collectionData, query, where } from '@angular/fire/firestore';
import { Student } from '../interfaces/student';
import { Observable, concatAll, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudentsService {

  auth = inject(Auth);
  firestore = inject(Firestore);

  user$ = authState(this.auth);
  studentsRef = collection(this.firestore, 'students');
  classSections$: Observable<Student[]> = this.user$.pipe(
    map(user => {
      if (user) {
        return collectionData(query(this.studentsRef, where('uid', '==', user.uid)), { idField: 'id' }) as Observable<Student[]>
      }
      return of([]);
    }),
    concatAll()
  )

  constructor() { }

  bySection(section: string): Observable<Student[]> {
    return this.user$.pipe(
      map(user => {
        if (user) {
          return collectionData(query(this.studentsRef, where('section', '==', section)), { idField: 'id' }) as Observable<Student[]>;
        }
        return of([]);
      }),
      concatAll(),
    )
  }
}
