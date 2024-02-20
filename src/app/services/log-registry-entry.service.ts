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

  getLog(category: string, students: Student[], extra?: any): Observable<EntryDetails | null> {
    if (category == 'behavior') {
      return this.behaviorLog(students);
    }
    if (category == 'writing') {
      return this.writingLog(students);
    }
    if (category == 'reading') {
      return this.readingLog(students);
    }
    if (category == 'comprehension') {
      return this.comprehensionLog(students);
    }
    if (category == 'math') {
      return this.mathLog(students);
    }
    if (category == 'irruption') {
      return this.irruptionLog(students);
    }
    if (category == 'leave') {
      return this.leaveLog(students, extra);
    }
    if (category == 'misbehavior') {
      return this.misbehaviorLog(students, extra);
    }
    if (category == 'fight') {
      return this.fightLog(students, extra);
    }
    if (category == 'broken_agreement') {
      return this.brokenAgreementLog(students, extra);
    }
    if (category == 'pending_homework') {
      return this.pendingHomeworkLog(students, extra);
    }
    if (category == 'failed_assesment') {
      return this.failedAssesmentLog(students, extra);
    }
    return of(null);
  }

  writingLog(students: Student[]): Observable<EntryDetails | null> {
    return of(null);
  }

  readingLog(students: Student[]): Observable<EntryDetails | null> {
    return of(null);
  }

  comprehensionLog(students: Student[]): Observable<EntryDetails | null> {
    return of(null);
  }

  mathLog(students: Student[]): Observable<EntryDetails | null> {
    return of(null);
  }

  irruptionLog(students: Student[]): Observable<EntryDetails | null> {
    return of(null);
  }

  leaveLog(students: Student[], hour: string): Observable<EntryDetails> {
    const size = students.length;
    return this.getCollectionData('fight', size == 1 ? 'singular' : 'plural').pipe(map(boilerplates => {
      const student = students[0];
      const randomIndex = Math.round(Math.random() * (boilerplates.length - 1));
      const logEntry = boilerplates[randomIndex];
      const lastStudent = students.pop();
      const fullname = size == 1 ? `${student.firstname} ${student.lastname}` : (students.slice(0, size).map(s => `${s.firstname} ${s.lastname}`).join(', ') + ` y ${lastStudent?.firstname} ${lastStudent?.lastname}`);
      const firstname = size == 1 ? student.firstname : (students.slice(0, size).map(s => s.firstname).join(', ') + ' y ' + lastStudent?.firstname);
      logEntry.comments = logEntry.comments
        .replaceAll('FULL_NAME', fullname)
        .replaceAll('FIRST_NAME', firstname)
        .replaceAll('HOUR', hour);
      logEntry.description = logEntry.description
        .replaceAll('FULL_NAME1', fullname)
        .replaceAll('FIRST_NAME1', firstname)
        .replaceAll('HOUR', hour);

      return logEntry;
    })) as Observable<EntryDetails>;
  }

  misbehaviorLog(students: Student[], extra: { behavior: string, decision: string }): Observable<EntryDetails> {
    const size = students.length;
    return this.getCollectionData('fight', size == 1 ? 'singular' : 'plural').pipe(map(boilerplates => {
      const student = students[0];
      const randomIndex = Math.round(Math.random() * (boilerplates.length - 1));
      const logEntry = boilerplates[randomIndex];
      const lastStudent = students.pop();
      const fullname = size == 1 ? `${student.firstname} ${student.lastname}` : (students.slice(0, size).map(s => `${s.firstname} ${s.lastname}`).join(', ') + ` y ${lastStudent?.firstname} ${lastStudent?.lastname}`);
      const firstname = size == 1 ? student.firstname : (students.slice(0, size).map(s => s.firstname).join(', ') + ' y ' + lastStudent?.firstname);
      logEntry.comments = logEntry.comments
        .replaceAll('FULL_NAME', fullname)
        .replaceAll('FIRST_NAME', firstname)
        .replaceAll('BEHAVIOR', extra.behavior)
        .replaceAll('DECISION', extra.decision);
      logEntry.description = logEntry.description
        .replaceAll('FULL_NAME', fullname)
        .replaceAll('FIRST_NAME', firstname)
        .replaceAll('BEHAVIOR', extra.behavior)
        .replaceAll('DECISION', extra.decision);

      return logEntry;
    })) as Observable<EntryDetails>;
  }

  fightLog(students: Student[], extra: { place: string, notes: string }): Observable<EntryDetails> {
    const size = students.length;
    return this.getCollectionData('fight', size == 1 ? 'singular' : 'plural').pipe(map(boilerplates => {
      const student = students[0];
      const randomIndex = Math.round(Math.random() * (boilerplates.length - 1));
      const logEntry = boilerplates[randomIndex];
      const lastStudent = students.pop();
      logEntry.comments = logEntry.comments
        .replaceAll('FULL_NAME1', `${student.firstname} ${student.lastname}`)
        .replaceAll('FULL_NAME2', `${lastStudent?.firstname} ${lastStudent?.lastname}`)
        .replaceAll('FIRST_NAME1', student.firstname)
        .replaceAll('FIRST_NAME2', lastStudent?.firstname || '')
        .replaceAll('PLACE', extra.place)
        .replaceAll('NOTES', extra.notes);
      logEntry.description = logEntry.description
        .replaceAll('FULL_NAME1', `${student.firstname} ${student.lastname}`)
        .replaceAll('FULL_NAME2', `${lastStudent?.firstname} ${lastStudent?.lastname}`)
        .replaceAll('FIRST_NAME1', student.firstname)
        .replaceAll('FIRST_NAME2', lastStudent?.firstname || '')
        .replaceAll('PLACE', extra.place)
        .replaceAll('NOTES', extra.notes);

      return logEntry;
    })) as Observable<EntryDetails>;
  }

  brokenAgreementLog(students: Student[], agreement: string): Observable<EntryDetails> {
    const size = students.length;
    return this.getCollectionData('broken_agreement', size == 1 ? 'singular' : 'plural').pipe(map(boilerplates => {
      const student = students[0];
      const randomIndex = Math.round(Math.random() * (boilerplates.length - 1));
      const logEntry = boilerplates[randomIndex];
      const lastStudent = students.pop();
      const fullname = size == 1 ? `${student.firstname} ${student.lastname}` : (students.slice(0, size).map(s => `${s.firstname} ${s.lastname}`).join(', ') + ` y ${lastStudent?.firstname} ${lastStudent?.lastname}`);
      const firstname = size == 1 ? student.firstname : (students.slice(0, size).map(s => s.firstname).join(', ') + ' y ' + lastStudent?.firstname);
      logEntry.comments = logEntry.comments.replaceAll('FULL_NAME', fullname).replaceAll('FIRST_NAME', firstname).replaceAll('AGREEMENT', agreement);
      logEntry.description = logEntry.description.replaceAll('FULL_NAME', fullname).replaceAll('FIRST_NAME', firstname).replaceAll('AGREEMENT', agreement);
  
      return logEntry;
    })) as Observable<EntryDetails>;
  }

  pendingHomeworkLog(students: Student[], homework: string): Observable<EntryDetails> {
    const size = students.length;
    return this.getCollectionData('pending_homework', size == 1 ? 'singular' : 'plural').pipe(map(boilerplates => {
      const student = students[0];
      const randomIndex = Math.round(Math.random() * (boilerplates.length - 1));
      const logEntry = boilerplates[randomIndex];
      const lastStudent = students.pop();
      const fullname = size == 1 ? `${student.firstname} ${student.lastname}` : (students.slice(0, size).map(s => `${s.firstname} ${s.lastname}`).join(', ') + ` y ${lastStudent?.firstname} ${lastStudent?.lastname}`);
      const firstname = size == 1 ? student.firstname : (students.slice(0, size).map(s => s.firstname).join(', ') + ' y ' + lastStudent?.firstname);
      logEntry.comments = logEntry.comments.replaceAll('FULL_NAME', fullname).replaceAll('FIRST_NAME', firstname).replaceAll('HOMEWORK', homework);
      logEntry.description = logEntry.description.replaceAll('FULL_NAME', fullname).replaceAll('FIRST_NAME', firstname).replaceAll('HOMEWORK', homework);
  
      return logEntry;
    })) as Observable<EntryDetails>;
  }

  failedAssesmentLog(students: Student[], assestment: string): Observable<EntryDetails> {
    const size = students.length;
    return this.getCollectionData('failed_assesment', size == 1 ? 'singular' : 'plural').pipe(map(boilerplates => {
      const student = students[0];
      const randomIndex = Math.round(Math.random() * (boilerplates.length - 1));
      const logEntry = boilerplates[randomIndex];
      const lastStudent = students.pop();
      const fullname = size == 1 ? `${student.firstname} ${student.lastname}` : (students.slice(0, size).map(s => `${s.firstname} ${s.lastname}`).join(', ') + ` y ${lastStudent?.firstname} ${lastStudent?.lastname}`);
      const firstname = size == 1 ? student.firstname : (students.slice(0, size).map(s => s.firstname).join(', ') + ' y ' + lastStudent?.firstname);
      logEntry.comments = logEntry.comments.replaceAll('FULL_NAME', fullname).replaceAll('FIRST_NAME', firstname).replaceAll('ASSESTMENT', assestment);
      logEntry.description = logEntry.description.replaceAll('FULL_NAME', fullname).replaceAll('FIRST_NAME', firstname).replaceAll('ASSESTMENT', assestment);

      return logEntry;
    })) as Observable<EntryDetails>;
  }


  private behaviorLog(students: Student[]): Observable<EntryDetails> {
    const size = students.length;
    return this.getCollectionData('behavior-improvement', size == 1 ? 'singular' : 'plural').pipe(map(boilerplates => {
      const student = students[0];
      const randomIndex = Math.round(Math.random() * (boilerplates.length - 1));
      const logEntry = boilerplates[randomIndex];
      const lastStudent = students.pop();
      const fullname = size == 1 ? `${student.firstname} ${student.lastname}` : (students.slice(0, size).map(s => `${s.firstname} ${s.lastname}`).join(', ') + ` y ${lastStudent?.firstname} ${lastStudent?.lastname}`);
      const firstname = size == 1 ? student.firstname : (students.slice(0, size).map(s => s.firstname).join(', ') + ' y ' + lastStudent?.firstname);
      logEntry.comments = logEntry.comments.replaceAll('FULL_NAME', fullname).replaceAll('FIRST_NAME', firstname);
      logEntry.description = logEntry.description.replaceAll('FULL_NAME', fullname).replaceAll('FIRST_NAME', firstname);

      return logEntry;
    })) as Observable<EntryDetails>;
  }
}
