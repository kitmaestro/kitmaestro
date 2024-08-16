import { inject, Injectable } from '@angular/core';
import { Auth, authState, User } from '@angular/fire/auth';
import { addDoc, collection, collectionData, doc, Firestore, query, updateDoc, where } from '@angular/fire/firestore';
import { concatAll, map, Observable, of } from 'rxjs';
import { UnitPlan } from '../interfaces/unit-plan';

@Injectable({
  providedIn: 'root'
})
export class UnitPlansService {

  private auth = inject(Auth);
  private firestore = inject(Firestore);

  private user$: Observable<User | null> = authState(this.auth);
  private classPlansRef = collection(this.firestore, 'class-plans');

  classPlans$: Observable<UnitPlan[]> = this.user$.pipe(
    map(user => {
      if (user) {
        return collectionData(query(this.classPlansRef, where('uid', '==', user.uid)), { idField: 'id' }) as Observable<UnitPlan[]>
      }
      return of([]);
    }),
    concatAll()
  )

  constructor() { }

  addPlan(plan: UnitPlan) {
    return addDoc(this.classPlansRef, plan);
  }

  updatePlan(id: string, plan: any) {
    return updateDoc(doc(this.firestore, 'class-sections', id), plan);
  }
}
