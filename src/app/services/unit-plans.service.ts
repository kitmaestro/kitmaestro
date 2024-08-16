import { inject, Injectable } from '@angular/core';
import { Auth, authState, User } from '@angular/fire/auth';
import { addDoc, collection, collectionData, deleteDoc, doc, docData, Firestore, query, updateDoc, where } from '@angular/fire/firestore';
import { concatAll, map, Observable, of } from 'rxjs';
import { UnitPlan } from '../interfaces/unit-plan';

@Injectable({
  providedIn: 'root'
})
export class UnitPlansService {

  private auth = inject(Auth);
  private firestore = inject(Firestore);

  private user$: Observable<User | null> = authState(this.auth);
  private unitPlansRef = collection(this.firestore, 'unit-plans');

  unitPlans$: Observable<UnitPlan[]> = this.user$.pipe(
    map(user => {
      if (user) {
        return collectionData(query(this.unitPlansRef, where('uid', '==', user.uid)), { idField: 'id' }) as Observable<UnitPlan[]>
      }
      return of([]);
    }),
    concatAll()
  )

  constructor() { }

  find(id: string) {
    return docData(doc(this.firestore, 'unit-plans', id)) as Observable<UnitPlan>;
  }

  addPlan(plan: UnitPlan) {
    return addDoc(this.unitPlansRef, plan);
  }

  updatePlan(id: string, plan: any) {
    return updateDoc(doc(this.firestore, 'unit-plans', id), plan);
  }

  deletePlan(id: string) {
    return deleteDoc(doc(this.firestore, 'unit-plans', id));
  }
}
