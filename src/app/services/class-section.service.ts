import { Injectable, inject } from '@angular/core';
import { Auth, User, authState } from '@angular/fire/auth';
import { Firestore, addDoc, collection, collectionData, doc, query, updateDoc, where } from '@angular/fire/firestore';
import { Observable, concatAll, map, of } from 'rxjs';
import { ClassSection } from '../datacenter/datacenter.component';

@Injectable({
  providedIn: 'root'
})
export class ClassSectionService {

  private auth = inject(Auth);
  private firestore = inject(Firestore);

  private user$: Observable<User|null> = authState(this.auth);
  private classSectionsRef = collection(this.firestore, 'class-sections');
  
  classSections$: Observable<ClassSection[]> = this.user$.pipe(
    map(user => {
      if (user) {
        return collectionData(query(this.classSectionsRef, where('uid', '==', user.uid)), { idField: 'id' }) as Observable<ClassSection[]>
      }
      return of([]);
    }),
    concatAll()
  )
  
  constructor() { }

  addSection(section: ClassSection) {
    return addDoc(this.classSectionsRef, section);
  }

  updateSection(id: string, section: any) {
    return updateDoc(doc(this.firestore, 'class-sections', id), section);
  }
}
