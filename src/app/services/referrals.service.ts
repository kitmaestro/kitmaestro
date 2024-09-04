import { Injectable, inject } from '@angular/core';
import { Auth, authState, User } from '@angular/fire/auth';
import { addDoc, collection, collectionData, deleteDoc, doc, docData, DocumentReference, Firestore, query, updateDoc, where } from '@angular/fire/firestore';
import { concatAll, map, Observable, of } from 'rxjs';
import { ClassPlan } from '../interfaces/class-plan';

@Injectable({
  providedIn: 'root'
})
export class ReferralsService {

  private auth = inject(Auth);
  private firestore = inject(Firestore);

  private user$: Observable<User | null> = authState(this.auth);
  private classPlansRef = collection(this.firestore, 'class-plans');

  classPlans$: Observable<ClassPlan[]> = this.user$.pipe(
    map(user => {
      if (user) {
        return collectionData(query(this.classPlansRef, where('uid', '==', user.uid)), { idField: 'id' }) as Observable<ClassPlan[]>
      }
      return of([]);
    }),
    concatAll()
  )

  constructor() { }

  find(id: string): Observable<ClassPlan | undefined> {
    return docData<ClassPlan>(doc(this.firestore, 'class-plans', id) as DocumentReference<ClassPlan>);
  }

  addPlan(plan: ClassPlan) {
    return addDoc(this.classPlansRef, plan);
  }

  updatePlan(id: string, plan: any) {
    return updateDoc(doc(this.firestore, 'class-plans', id), plan);
  }

  deletePlan(id: string) {
    return deleteDoc(doc(this.firestore, 'class-plans', id));
  }
}
