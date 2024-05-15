import { Injectable, inject } from '@angular/core';
import { DocumentReference, Firestore, addDoc, collection, collectionData, doc, docData, query, where } from '@angular/fire/firestore';
import { CompetenceEntry } from '../interfaces/competence-entry';
import { Observable, concatAll, from, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompetenceService {

  private firestore = inject(Firestore);
  private competenceColRef = collection(this.firestore, 'competence');

  createCompetence(data: CompetenceEntry): Observable<CompetenceEntry> {
    return from(addDoc(this.competenceColRef, data) as Promise<DocumentReference<CompetenceEntry>>).pipe(
      map(ref => docData(doc(this.firestore, 'competence', ref.id), { idField: 'id' }) as Observable<CompetenceEntry>),
      concatAll(),
    );
  }

  findAll(): Observable<CompetenceEntry[]> {
    return collectionData(this.competenceColRef, { idField: 'id' }) as Observable<CompetenceEntry[]>;
  }

  findByGrade(grade: string): Observable<CompetenceEntry[]> {
    return collectionData(
      query(
        this.competenceColRef,
        where(
          'grade',
          '==',
          grade
        )
      ),
      { idField: 'id' }
    ) as Observable<CompetenceEntry[]>;
  }

  findBySubject(subject: string): Observable<CompetenceEntry[]> {
    return collectionData(
      query(
        this.competenceColRef,
        where(
          'subject',
          '==',
          subject
        )
      ),
      { idField: 'id' }
    ) as Observable<CompetenceEntry[]>;
  }

  findOne(id: string): Observable<CompetenceEntry> {
    return docData(
      doc(this.firestore, 'competence', id),
      { idField: 'id' }
    ) as Observable<CompetenceEntry>;
  }
}
