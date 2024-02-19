import { Injectable, inject } from '@angular/core';
import { Student } from '../interfaces/student';
import { Firestore, addDoc, collection, collectionData, query, where } from '@angular/fire/firestore';
import { LogEntryBoilerplate } from '../interfaces/log-entry-boilerplate';
import { EMPTY, Observable, map, of } from 'rxjs';

interface EntryDetails { description: string, comments: string };

@Injectable({
  providedIn: 'root'
})
export class LogRegistryEntryService {
  private firestore = inject(Firestore);
  private logEntryBoilerplatesRef = collection(this.firestore, 'log-entry-boilerplates');

  private getCollectionData(category: string, noun: 'singular' | 'plural') {
    return collectionData(query(this.logEntryBoilerplatesRef, where('category', '==', category), where('noun', '==', noun))) as Observable<LogEntryBoilerplate[]>;
  }

  constructor() {
    // this.populate()
  }

  populate(logEntryBoilerplates: any[]) {
    logEntryBoilerplates.forEach((boilerplate, i) => {
      const entry = {
        category: 'behavior-improvement',
        noun: 'plural',
        comments: boilerplate.comments,
        description: boilerplate.description,
      }

      addDoc(this.logEntryBoilerplatesRef, entry).then(() => console.log('Saved: %d', i));
    })
  }

  getLog(category: string, students: Student[]): Observable<EntryDetails | null> {
    if (category == 'behavior') {
      return this.behaviorImprovementLog(students);
    }
    return of(null);
  }

  private behaviorImprovementLog(students: Student[]): Observable<EntryDetails> {
    const size = students.length;
    return this.getCollectionData('behavior-improvement', size == 1 ? 'singular' : 'plural').pipe(map(boilerplates => {
      const student = students[0];
      const randomIndex = Math.round(Math.random() * (boilerplates.length - 1));
      const logEntry = boilerplates[randomIndex];
      const lastStudent = students.pop();
      const fullname = size == 1 ? `${student.firstname} ${student.lastname}` : (students.slice(0, size).map((s, i) => `${s.firstname} ${s.lastname}`).join(', ') + ` y ${lastStudent?.firstname} ${lastStudent?.lastname}`);
      const firstname = size == 1 ? student.firstname : (students.slice(0, size).map((s, i) => s.firstname).join(', ') + ' y ' + lastStudent?.firstname);
      logEntry.comments = logEntry.comments.replaceAll('FULL_NAME', fullname).replaceAll('FIRST_NAME', firstname);
      logEntry.description = logEntry.description.replaceAll('FULL_NAME', fullname).replaceAll('FIRST_NAME', firstname);

      return logEntry;
    })) as Observable<EntryDetails>;
  }
}
