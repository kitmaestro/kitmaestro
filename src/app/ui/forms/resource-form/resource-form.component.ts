import { DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, inject } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DidacticResourceService } from '../../../services/didactic-resource.service';
import { DidacticResource, ResourceType } from '../../../interfaces/didactic-resource';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FORMATS } from '../../../data/formats';
import { GRADES } from '../../../data/grades';
import { LEVELS } from '../../../data/levels';
import { SUBJECTS } from '../../../data/subjects';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { Storage, getDownloadURL, ref, uploadBytesResumable } from '@angular/fire/storage';
import { BASE_TOPICS } from '../../../data/base-topics';
const WORKSHOP_TOPICS: any = [];
const SPANISH_TOPICS: any = [];
const ART_TOPICS: any = [];
const ENGLISH_TOPICS: any = [];
const FRENCH_TOPICS: any = [];
const MATH_TOPICS: any = [];
const RELIGION_TOPICS: any = [];
const SCIENCE_TOPICS: any = [];
const SOCIETY_TOPICS: any = [];
const SPORTS_TOPICS: any = [];

@Component({
    selector: 'app-resource-form',
    imports: [
        MatDialogModule,
        MatButtonModule,
        MatIconModule,
        MatSnackBarModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        CommonModule,
    ],
    templateUrl: './resource-form.component.html',
    styleUrl: './resource-form.component.scss'
})
export class ResourceFormComponent {
  auth = inject(Auth);
  fb = inject(FormBuilder);
  storage = inject(Storage);
  private dialogRef = inject(DialogRef<ResourceFormComponent>);
  private didacticResourceService = inject(DidacticResourceService);
  private sb = inject(MatSnackBar);
  private data: DidacticResource = inject(MAT_DIALOG_DATA);

  user$ = authState(this.auth);
  loading = false;

  resource: DidacticResource | null = null;
  _preview = '';
  formats = FORMATS;
  grades = GRADES;
  levels = LEVELS;
  subjects = SUBJECTS;
  baseTopics = BASE_TOPICS;
  workshopTopics = WORKSHOP_TOPICS;
  topics: string[] = [];

  resourceForm = this.fb.group({
    author: [''],
    title: [''],
    description: [''],
    format: [''],
    grade: [''],
    level: [''],
    subject: [''],
    topic: [''],
    downloadLink: ['', Validators.required],
    status: ['draft'],
    preview: [''],
    type: ['FREE'],
    price: [0],
    likes: [0],
    dislikes: [0],
    downloads: [0],
    bookmarks: [0],
    categories: [''],
  });

  constructor(
  ) {
    this.topics = [...this.baseTopics];

    if (this.data) {
      this.resource = this.data;
    }

    this.user$.subscribe(user => {
      if (user) {
        this.resourceForm.get('author')?.setValue(user.uid)
      }
    })
  }

  setGrades(event: string) {
    if (event == 'Pre Primaria') {
      this.grades = ['Casita', 'Prescolar'];
    } else {
      this.grades = GRADES;
    }
  }

  setTopics(event: string[]) {
    const topics = BASE_TOPICS;

    if (event.includes('Lengua Española')) {
      topics.push(...this.spanishTopics);
    }
    if (event.includes('Matemática')) {
      topics.push(...this.mathTopics);
    }
    if (event.includes("Ciencias Sociales")) {
      topics.push(...this.societyTopics);
    }
    if (event.includes("Ciencias de la Naturaleza")) {
      topics.push(...this.scienceTopics);
    }
    if (event.includes("Inglés")) {
      topics.push(...this.englishTopics);
    }
    if (event.includes("Francés")) {
      topics.push(...this.frenchTopics);
    }
    if (event.includes("Educación Artística")) {
      topics.push(...this.artTopics);
    }
    if (event.includes("Educación Física")) {
      topics.push(...this.sportsTopics);
    }
    if (event.includes("Formación Integral Humana y Religiosa")) {
      topics.push(...this.religionTopics);
    }
    if (event.includes("Talleres Optativos")) {
      topics.push(...this.workshopTopics);
    }

    this.topics = topics;
  }

  onSubmit() {
    const resource: DidacticResource = this.resourceForm.value as any;

    resource.type = resource.price == 0 ? ResourceType.Free : ResourceType.Paid;
    resource.categories = [resource.format, ...resource.grade, ...resource.subject, resource.level, resource.topic];
    resource.preview = this.preview;
    resource.status = 'public';

    this.didacticResourceService.create(resource).subscribe({
      next: (res) => {
        if (res && res.title) {
          this.sb.open('El recurso ha sido publicado.', 'Ok', { duration: 2500 });
          this.dialogRef.close();
        }
      },
      error: (error) => {
        this.sb.open('Ha ocurrido un error al guardar. Intentalo nuevamente, por favor.', 'Ok', { duration: 2500 });
        console.log(error)
      }
    });
  }

  close() {
    this.dialogRef.close();
  }

  processPreview(files: FileList | null) {
    if (!files)
      return;

    const preview = files.item(0);
    if (!preview)
      return;

    const reader = new FileReader();

    reader.onloadend = () => {
      this._preview = reader.result as string;
      this.resourceForm.get('preview')?.setValue(this._preview);
      this.sb.open('Miniatura cargada!', 'Ok', { duration: 2500 });
    }

    reader.readAsDataURL(preview);
  }

  processFile(files: FileList | null) {
    if (!files)
      return;

    const file = files.item(0);
    if (!file)
      return;

    const docRef = ref(this.storage, file.name);
    uploadBytesResumable(docRef, file).then(() => {
      getDownloadURL(docRef).then(downloadLink => {
        this.resourceForm.get('downloadLink')?.setValue(downloadLink);
      }).catch(console.log);
    }).catch(console.log);
  }

  saveDraft() {
    const resource: DidacticResource = this.resourceForm.value as any;

    resource.type = resource.price == 0 ? ResourceType.Free : ResourceType.Paid;
    resource.categories = [resource.format, ...resource.grade, ...resource.subject, resource.level, resource.topic];
    resource.preview = this.preview;
    resource.status = 'preview';

    this.didacticResourceService.create(resource).subscribe({
      next: () => {
        this.sb.open('Recurso guardado como borrador.', 'Ok', { duration: 2500 });
        this.dialogRef.close();
      },
      error: error => {
        this.sb.open('Ha ocurrido un error al guardar. Intentalo nuevamente, por favor.', 'Ok', { duration: 2500 });
        console.log(error);
      }
    });
  }

  get preview(): string {
    return this._preview ? this._preview : '/assets/Plantilla Ejemplo KM.svg';
  }

  get spanishTopics(): string[] {
    if (this.resourceForm.get('level')?.value == 'Primaria') {
      return SPANISH_TOPICS.primary;
    } else {
      return SPANISH_TOPICS.highSchool;
    }
  }

  get mathTopics(): string[] {
    if (this.resourceForm.get('level')?.value == 'Primaria') {
      return MATH_TOPICS.primary;
    } else {
      return MATH_TOPICS.highSchool;
    }
  }

  get societyTopics(): string[] {
    if (this.resourceForm.get('level')?.value == 'Primaria') {
      return SOCIETY_TOPICS.primary;
    } else {
      return SOCIETY_TOPICS.highSchool;
    }
  }

  get scienceTopics(): string[] {
    if (this.resourceForm.get('level')?.value == 'Primaria') {
      return SCIENCE_TOPICS.primary;
    } else {
      return SCIENCE_TOPICS.highSchool;
    }
  }

  get englishTopics(): string[] {
    if (this.resourceForm.get('level')?.value == 'Primaria') {
      return ENGLISH_TOPICS.primary;
    } else {
      return ENGLISH_TOPICS.highSchool;
    }
  }

  get frenchTopics(): string[] {
    if (this.resourceForm.get('level')?.value == 'Primaria') {
      return FRENCH_TOPICS.primary;
    } else {
      return FRENCH_TOPICS.highSchool;
    }
  }

  get artTopics(): string[] {
    if (this.resourceForm.get('level')?.value == 'Primaria') {
      return ART_TOPICS.primary;
    } else {
      return ART_TOPICS.highSchool;
    }
  }

  get sportsTopics(): string[] {
    if (this.resourceForm.get('level')?.value == 'Primaria') {
      return SPORTS_TOPICS.primary;
    } else {
      return SPORTS_TOPICS.highSchool;
    }
  }

  get religionTopics(): string[] {
    if (this.resourceForm.get('level')?.value == 'Primaria') {
      return RELIGION_TOPICS.primary;
    } else {
      return RELIGION_TOPICS.highSchool;
    }
  }
}
