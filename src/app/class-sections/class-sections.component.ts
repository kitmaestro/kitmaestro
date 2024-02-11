import { Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { EMPTY, Observable } from 'rxjs';
import { ClassSection } from '../datacenter/datacenter.component';
import { collection, collectionData, CollectionReference, Firestore, query, Query, where } from '@angular/fire/firestore';
import { CommonModule } from '@angular/common';
import { Auth, authState } from '@angular/fire/auth';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { ClassSectionFormComponent } from '../class-section-form/class-section-form.component';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-class-sections',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatSnackBarModule,
    MatIconModule,
    CommonModule,
    MatDialogModule,
    MatTableModule,
    MatListModule,
    MatExpansionModule,
    RouterModule,
  ],
  templateUrl: './class-sections.component.html',
  styleUrl: './class-sections.component.scss'
})
export class ClassSectionsComponent implements OnInit {
  sections$: Observable<ClassSection[]> = EMPTY;
  sectionColRef: CollectionReference<ClassSection> | null = null;
  sectionQuery: Query<CollectionReference<ClassSection>> | null = null;
  auth = inject(Auth);
  firestore = inject(Firestore);
  dialog = inject(MatDialog);

  ngOnInit() {
    authState(this.auth).subscribe(user => {
      if (user) {
        this.sectionColRef = collection(this.firestore, 'class-sections') as CollectionReference<ClassSection>;
        this.sectionQuery = query(this.sectionColRef, where('uid', '==', user.uid)) as Query<CollectionReference<ClassSection>>;
        this.sections$ = collectionData(this.sectionQuery, { idField: 'id' }) as unknown as Observable<ClassSection[]>;
      }
    })
  }

  openSectionFormDialog() {
    this.dialog.open(ClassSectionFormComponent, {
      width: '75%',
      maxWidth: '640px'
    });
  }

  formatValue(value: string) {
    return value.split('_').map(s => s[0] + s.slice(1).toLowerCase().split('').join('')).join(' ');
  }
}
