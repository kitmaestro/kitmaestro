import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { DidacticResourceService } from '../../services/didactic-resource.service';
import { CommonModule } from '@angular/common';
import { IsEmptyComponent } from '../../ui/alerts/is-empty/is-empty.component';
import { ResourceCardComponent } from '../resource-card/resource-card.component';
import { ResourceFormComponent } from '../../ui/forms/resource-form/resource-form.component';
import { MatIconModule } from '@angular/material/icon';
import { SUBJECTS } from '../../data/subjects';
import { GRADES } from '../../data/grades';
import { LEVELS } from '../../data/levels';
import { RESOURCE_TYPES } from '../../data/resource-types';
import { FORMATS } from '../../data/formats';
import { BASE_TOPICS } from '../../data/base-topics';
import { Auth, authState } from '@angular/fire/auth';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { UserSettings } from '../../interfaces/user-settings';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-resource-gallery',
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatSnackBarModule,
    MatDialogModule,
    MatIconModule,
    ReactiveFormsModule,
    CommonModule,
    IsEmptyComponent,
    ResourceCardComponent,
  ],
  templateUrl: './resource-gallery.component.html',
  styleUrl: './resource-gallery.component.scss'
})
export class ResourceGalleryComponent {
  private fb = inject(FormBuilder);
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private resourcesService = inject(DidacticResourceService);
  private dialog = inject(MatDialog);

  uid = '';
  authors: UserSettings[] = [];
  loading = true;

  public readonly resources$ = this.resourcesService.findMyResources();

  levels = LEVELS;

  grades = GRADES;

  subjects = SUBJECTS;

  resourceTypes = RESOURCE_TYPES;

  formats = FORMATS;

  baseTopics = BASE_TOPICS;

  topics: string[] = [];

  filterForm = this.fb.group({
    format: [''],
    topics: [''],
    resourceType: [''],
    subjects: [''],
    level: [''],
    grades: [''],
    orderBy: [''],
  });

  constructor() {
    this.topics = this.baseTopics;
    authState(this.auth).subscribe(user => {
      if (user) {
        this.uid = user.uid;
        (collectionData(collection(this.firestore, 'user-settings'), { idField: 'id' }) as Observable<UserSettings[]>).subscribe(settings => {
          this.authors = settings;
          this.loading = false;
        });
      }
    });
  }

  openCreateResourceDialog() {
    this.dialog.open(ResourceFormComponent, { width: '100%', maxWidth: '960px' });
  }

  findAuthor(id: string) {
    return this.authors.find(a => a._id == id);
  }
}
