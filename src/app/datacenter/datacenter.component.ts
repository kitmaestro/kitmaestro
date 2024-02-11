import { Component, OnInit, inject } from '@angular/core';
import { Auth, User, authState } from '@angular/fire/auth';
import { Firestore, Query, collection, collectionData, collectionGroup, query, where } from '@angular/fire/firestore';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { EMPTY, Observable } from 'rxjs';

export interface ClassSection {
  level: string;
  grade: string;
  name: string;
  subjects: string;
  uid: string;
  id: string;
}

@Component({
  selector: 'app-datacenter',
  standalone: true,
  imports: [
    MatCardModule,
    MatTableModule,
    RouterModule,
  ],
  templateUrl: './datacenter.component.html',
  styleUrl: './datacenter.component.scss'
})
export class DatacenterComponent implements OnInit {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private user: User | null = null;

  sectionsQuery: Query | null = null;
  sections: Observable<ClassSection[]> = EMPTY;

  sectionsColumns = ['name', 'level', 'grade', 'subjects'];

  constructor() {
    authState(this.auth).subscribe(user => {
      if (user) {
        this.user = user;
        this.sectionsQuery = query(collection(this.firestore, 'class-sections'), where('uid', '==', user.uid));
        this.sections = collectionData(this.sectionsQuery, { idField: 'id' }) as Observable<ClassSection[]>;
      }
    })
  }

  ngOnInit(): void {
  }

  addSection(section: ClassSection) {
  }

  removeSection(section: ClassSection) {
  }

  updateSection(section: ClassSection, updated: any) {
  }
}
