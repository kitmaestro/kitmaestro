import { inject, Injectable } from '@angular/core';
import { addDoc, collection, collectionData, deleteDoc, doc, docData, Firestore, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { UnitPlan } from '../interfaces/unit-plan';

@Injectable({
  providedIn: 'root'
})
export class UnitPlansService {
  private firestore = inject(Firestore);

  private unitPlansRef = collection(this.firestore, 'unit-plans');

  unitPlans$: Observable<UnitPlan[]> = collectionData(this.unitPlansRef, { idField: 'id' }) as Observable<UnitPlan[]>;

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
