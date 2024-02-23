import { Injectable, inject } from '@angular/core';
import { Student } from '../interfaces/student';
import { Firestore, addDoc, collection, collectionData, doc, query, updateDoc, where } from '@angular/fire/firestore';
import { LogEntryBoilerplate } from '../interfaces/log-entry-boilerplate';
import { EMPTY, Observable, map, of } from 'rxjs';
import { LOG_REGISTRY_ENTRY_SINGULAR_MOCKS } from '../mocks/log-registry-entry-mocks';

export interface EntryDetails { description: string, comments: string };

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
    // this.populate(LOG_REGISTRY_ENTRY_SINGULAR_MOCKS, true)
    // (collectionData(this.logEntryBoilerplatesRef, { idField: 'id' }) as Observable<LogEntryBoilerplate[]>).subscribe({
    //   next: (boilerplates) => {
    //     boilerplates.forEach(boilerplate => {
    //       if (boilerplate.comments.includes('quinto grado') || boilerplate.description.includes('quinto grado')) {
    //         boilerplate.comments = boilerplate.comments.replaceAll('quinto grado', 'SECTION_NAME');
    //         boilerplate.description = boilerplate.description.replaceAll('quinto grado', 'SECTION_NAME');
    //         updateDoc(doc(this.firestore, 'log-entry-boilerplates/' + boilerplate.id), { comments: boilerplate.comments.replaceAll('quinto grado', 'SECTION_NAME'), description: boilerplate.description.replaceAll('quinto grado', 'SECTION_NAME') }).then(() => {
    //           console.log('Updated boilerplace with id %s!', boilerplate.id);
    //         })
    //       }
    //     })
    //   }
    // })
  }

  populate(logEntryBoilerplates: any[], singular: boolean = true) {
    logEntryBoilerplates.forEach((boilerplate, i) => {
      const entry = {
        category: 'writing',
        noun: singular ? 'singular' : 'plural',
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

  private behaviorLog(students: Student[]): Observable<EntryDetails> {
    const size = students.length;
    return this.getCollectionData('behavior-improvement', size == 1 ? 'singular' : 'plural').pipe(map(boilerplates => {
      const student = students[0];
      const randomIndex = Math.round(Math.random() * (boilerplates.length - 1));
      const logEntry = boilerplates[randomIndex];
      const lastStudent = students.pop();
      const fullname = size == 1 ? `${student.firstname} ${student.lastname}` : (students.slice(0, size).map(s => `${s.firstname} ${s.lastname}`).join(', ') + ` y ${lastStudent?.firstname} ${lastStudent?.lastname}`);
      const firstname = size == 1 ? student.firstname : (students.slice(0, size).map(s => s.firstname).join(', ') + ' y ' + lastStudent?.firstname);
      logEntry.comments = logEntry.comments
        .replaceAll('FULL_NAME', fullname)
        .replaceAll('FIRST_NAME', firstname)
        .replaceAll('SECTION_NAME', student.section);
      logEntry.description = logEntry.description
        .replaceAll('FULL_NAME', fullname)
        .replaceAll('FIRST_NAME', firstname)
        .replaceAll('SECTION_NAME', student.section);

      return logEntry;
    })) as Observable<EntryDetails>;
  }

  private writingLog(students: Student[]): Observable<EntryDetails> {
    const size = students.length;
    return this.getCollectionData('writing', size == 1 ? 'singular' : 'plural').pipe(map(boilerplates => {
      const student = students[0];
      const randomIndex = Math.round(Math.random() * (boilerplates.length - 1));
      const logEntry = boilerplates[randomIndex];
      const lastStudent = students.pop();
      const fullname = size == 1 ? `${student.firstname} ${student.lastname}` : (students.slice(0, size).map(s => `${s.firstname} ${s.lastname}`).join(', ') + ` y ${lastStudent?.firstname} ${lastStudent?.lastname}`);
      const firstname = size == 1 ? student.firstname : (students.slice(0, size).map(s => s.firstname).join(', ') + ' y ' + lastStudent?.firstname);
      logEntry.comments = logEntry.comments
        .replaceAll('FULL_NAME', fullname)
        .replaceAll('FIRST_NAME', firstname)
        .replaceAll('SECTION_NAME', student.section);
      logEntry.description = logEntry.description
        .replaceAll('FULL_NAME', fullname)
        .replaceAll('FIRST_NAME', firstname)
        .replaceAll('SECTION_NAME', student.section);

      return logEntry;
    })) as Observable<EntryDetails>;
  }

  private readingLog(students: Student[]): Observable<EntryDetails> {
    const size = students.length;
    return this.getCollectionData('reading', size == 1 ? 'singular' : 'plural').pipe(map(boilerplates => {
      const student = students[0];
      const randomIndex = Math.round(Math.random() * (boilerplates.length - 1));
      const logEntry = boilerplates[randomIndex];
      const lastStudent = students.pop();
      const fullname = size == 1 ? `${student.firstname} ${student.lastname}` : (students.slice(0, size).map(s => `${s.firstname} ${s.lastname}`).join(', ') + ` y ${lastStudent?.firstname} ${lastStudent?.lastname}`);
      const firstname = size == 1 ? student.firstname : (students.slice(0, size).map(s => s.firstname).join(', ') + ' y ' + lastStudent?.firstname);
      logEntry.comments = logEntry.comments
        .replaceAll('FULL_NAME', fullname)
        .replaceAll('FIRST_NAME', firstname)
        .replaceAll('SECTION_NAME', student.section);
      logEntry.description = logEntry.description
        .replaceAll('FULL_NAME', fullname)
        .replaceAll('FIRST_NAME', firstname)
        .replaceAll('SECTION_NAME', student.section);

      return logEntry;
    })) as Observable<EntryDetails>;
  }

  private comprehensionLog(students: Student[]): Observable<EntryDetails> {
    const size = students.length;
    return this.getCollectionData('comprehension', size == 1 ? 'singular' : 'plural').pipe(map(boilerplates => {
      const student = students[0];
      const randomIndex = Math.round(Math.random() * (boilerplates.length - 1));
      const logEntry = boilerplates[randomIndex];
      const lastStudent = students.pop();
      const fullname = size == 1 ? `${student.firstname} ${student.lastname}` : (students.slice(0, size).map(s => `${s.firstname} ${s.lastname}`).join(', ') + ` y ${lastStudent?.firstname} ${lastStudent?.lastname}`);
      const firstname = size == 1 ? student.firstname : (students.slice(0, size).map(s => s.firstname).join(', ') + ' y ' + lastStudent?.firstname);
      logEntry.comments = logEntry.comments
        .replaceAll('FULL_NAME', fullname)
        .replaceAll('FIRST_NAME', firstname)
        .replaceAll('SECTION_NAME', student.section);
      logEntry.description = logEntry.description
        .replaceAll('FULL_NAME', fullname)
        .replaceAll('FIRST_NAME', firstname)
        .replaceAll('SECTION_NAME', student.section);

      return logEntry;
    })) as Observable<EntryDetails>;
  }

  private mathLog(students: Student[]): Observable<EntryDetails> {
    const size = students.length;
    return this.getCollectionData('math', size == 1 ? 'singular' : 'plural').pipe(map(boilerplates => {
      const student = students[0];
      const randomIndex = Math.round(Math.random() * (boilerplates.length - 1));
      const logEntry = boilerplates[randomIndex];
      const lastStudent = students.pop();
      const fullname = size == 1 ? `${student.firstname} ${student.lastname}` : (students.slice(0, size).map(s => `${s.firstname} ${s.lastname}`).join(', ') + ` y ${lastStudent?.firstname} ${lastStudent?.lastname}`);
      const firstname = size == 1 ? student.firstname : (students.slice(0, size).map(s => s.firstname).join(', ') + ' y ' + lastStudent?.firstname);
      logEntry.comments = logEntry.comments
        .replaceAll('FULL_NAME', fullname)
        .replaceAll('FIRST_NAME', firstname)
        .replaceAll('SECTION_NAME', student.section);
      logEntry.description = logEntry.description
        .replaceAll('FULL_NAME', fullname)
        .replaceAll('FIRST_NAME', firstname)
        .replaceAll('SECTION_NAME', student.section);

      return logEntry;
    })) as Observable<EntryDetails>;
  }

  private irruptionLog(students: Student[]): Observable<EntryDetails> {
    const size = students.length;
    return this.getCollectionData('irruption', size == 1 ? 'singular' : 'plural').pipe(map(boilerplates => {
      const student = students[0];
      const randomIndex = Math.round(Math.random() * (boilerplates.length - 1));
      const logEntry = boilerplates[randomIndex];
      const lastStudent = students.pop();
      const fullname = size == 1 ? `${student.firstname} ${student.lastname}` : (students.slice(0, size).map(s => `${s.firstname} ${s.lastname}`).join(', ') + ` y ${lastStudent?.firstname} ${lastStudent?.lastname}`);
      const firstname = size == 1 ? student.firstname : (students.slice(0, size).map(s => s.firstname).join(', ') + ' y ' + lastStudent?.firstname);
      logEntry.comments = logEntry.comments
        .replaceAll('FULL_NAME', fullname)
        .replaceAll('FIRST_NAME', firstname)
        .replaceAll('SECTION_NAME', student.section);
      logEntry.description = logEntry.description
        .replaceAll('FULL_NAME', fullname)
        .replaceAll('FIRST_NAME', firstname)
        .replaceAll('SECTION_NAME', student.section);

      return logEntry;
    })) as Observable<EntryDetails>;
  }

  private leaveLog(students: Student[], hour: string): Observable<EntryDetails> {
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
        .replaceAll('HOUR', hour)
        .replaceAll('SECTION_NAME', student.section);
      logEntry.description = logEntry.description
        .replaceAll('FULL_NAME1', fullname)
        .replaceAll('FIRST_NAME1', firstname)
        .replaceAll('HOUR', hour)
        .replaceAll('SECTION_NAME', student.section);

      return logEntry;
    })) as Observable<EntryDetails>;
  }

  private misbehaviorLog(students: Student[], extra: { behavior: string, decision: string }): Observable<EntryDetails> {
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
        .replaceAll('DECISION', extra.decision)
        .replaceAll('SECTION_NAME', student.section);
      logEntry.description = logEntry.description
        .replaceAll('FULL_NAME', fullname)
        .replaceAll('FIRST_NAME', firstname)
        .replaceAll('BEHAVIOR', extra.behavior)
        .replaceAll('DECISION', extra.decision)
        .replaceAll('SECTION_NAME', student.section);

      return logEntry;
    })) as Observable<EntryDetails>;
  }

  private fightLog(students: Student[], extra: { place: string, notes: string }): Observable<EntryDetails> {
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
        .replaceAll('NOTES', extra.notes)
        .replaceAll('SECTION_NAME', student.section);
      logEntry.description = logEntry.description
        .replaceAll('FULL_NAME1', `${student.firstname} ${student.lastname}`)
        .replaceAll('FULL_NAME2', `${lastStudent?.firstname} ${lastStudent?.lastname}`)
        .replaceAll('FIRST_NAME1', student.firstname)
        .replaceAll('FIRST_NAME2', lastStudent?.firstname || '')
        .replaceAll('PLACE', extra.place)
        .replaceAll('NOTES', extra.notes)
        .replaceAll('SECTION_NAME', student.section);

      return logEntry;
    })) as Observable<EntryDetails>;
  }

  private brokenAgreementLog(students: Student[], agreement: string): Observable<EntryDetails> {
    const size = students.length;
    return this.getCollectionData('broken_agreement', size == 1 ? 'singular' : 'plural').pipe(map(boilerplates => {
      const student = students[0];
      const randomIndex = Math.round(Math.random() * (boilerplates.length - 1));
      const logEntry = boilerplates[randomIndex];
      const lastStudent = students.pop();
      const fullname = size == 1 ? `${student.firstname} ${student.lastname}` : (students.slice(0, size).map(s => `${s.firstname} ${s.lastname}`).join(', ') + ` y ${lastStudent?.firstname} ${lastStudent?.lastname}`);
      const firstname = size == 1 ? student.firstname : (students.slice(0, size).map(s => s.firstname).join(', ') + ' y ' + lastStudent?.firstname);
      logEntry.comments = logEntry.comments
        .replaceAll('FULL_NAME', fullname)
        .replaceAll('FIRST_NAME', firstname)
        .replaceAll('AGREEMENT', agreement)
        .replaceAll('SECTION_NAME', student.section);
      logEntry.description = logEntry.description
        .replaceAll('FULL_NAME', fullname)
        .replaceAll('FIRST_NAME', firstname)
        .replaceAll('AGREEMENT', agreement)
        .replaceAll('SECTION_NAME', student.section);
  
      return logEntry;
    })) as Observable<EntryDetails>;
  }

  private pendingHomeworkLog(students: Student[], homework: string): Observable<EntryDetails> {
    const size = students.length;
    return this.getCollectionData('pending_homework', size == 1 ? 'singular' : 'plural').pipe(map(boilerplates => {
      const student = students[0];
      const randomIndex = Math.round(Math.random() * (boilerplates.length - 1));
      const logEntry = boilerplates[randomIndex];
      const lastStudent = students.pop();
      const fullname = size == 1 ? `${student.firstname} ${student.lastname}` : (students.slice(0, size).map(s => `${s.firstname} ${s.lastname}`).join(', ') + ` y ${lastStudent?.firstname} ${lastStudent?.lastname}`);
      const firstname = size == 1 ? student.firstname : (students.slice(0, size).map(s => s.firstname).join(', ') + ' y ' + lastStudent?.firstname);
      logEntry.comments = logEntry.comments
        .replaceAll('FULL_NAME', fullname)
        .replaceAll('FIRST_NAME', firstname)
        .replaceAll('HOMEWORK', homework)
        .replaceAll('SECTION_NAME', student.section);
      logEntry.description = logEntry.description
        .replaceAll('FULL_NAME', fullname)
        .replaceAll('FIRST_NAME', firstname)
        .replaceAll('HOMEWORK', homework)
        .replaceAll('SECTION_NAME', student.section);
  
      return logEntry;
    })) as Observable<EntryDetails>;
  }

  private failedAssesmentLog(students: Student[], assestment: string): Observable<EntryDetails> {
    const size = students.length;
    return this.getCollectionData('failed_assesment', size == 1 ? 'singular' : 'plural').pipe(map(boilerplates => {
      const student = students[0];
      const randomIndex = Math.round(Math.random() * (boilerplates.length - 1));
      const logEntry = boilerplates[randomIndex];
      const lastStudent = students.pop();
      const fullname = size == 1 ? `${student.firstname} ${student.lastname}` : (students.slice(0, size).map(s => `${s.firstname} ${s.lastname}`).join(', ') + ` y ${lastStudent?.firstname} ${lastStudent?.lastname}`);
      const firstname = size == 1 ? student.firstname : (students.slice(0, size).map(s => s.firstname).join(', ') + ' y ' + lastStudent?.firstname);
      logEntry.comments = logEntry.comments
        .replaceAll('FULL_NAME', fullname)
        .replaceAll('FIRST_NAME', firstname)
        .replaceAll('ASSESTMENT', assestment)
        .replaceAll('SECTION_NAME', student.section);
      logEntry.description = logEntry.description
        .replaceAll('FULL_NAME', fullname)
        .replaceAll('FIRST_NAME', firstname)
        .replaceAll('ASSESTMENT', assestment)
        .replaceAll('SECTION_NAME', student.section);

      return logEntry;
    })) as Observable<EntryDetails>;
  }
}
