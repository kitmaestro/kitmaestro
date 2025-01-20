import { DialogRef } from '@angular/cdk/dialog';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { DidacticResourceService } from '../../../services/didactic-resource.service';
import { DidacticResource } from '../../../interfaces/didactic-resource';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule, JsonPipe } from '@angular/common';
import { Storage, getDownloadURL, ref, uploadBytesResumable } from '@angular/fire/storage';
import { AuthService } from '../../../services/auth.service';
import { PretifyPipe } from '../../../pipes/pretify.pipe';
import { MatCheckboxModule } from '@angular/material/checkbox';

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
        MatCheckboxModule,
        MatSelectModule,
        CommonModule,
        PretifyPipe,
        JsonPipe,
    ],
    templateUrl: './resource-form.component.html',
    styleUrl: './resource-form.component.scss'
})
export class ResourceFormComponent implements OnInit {
  fb = inject(FormBuilder);
  private readonly storage: Storage = inject(Storage);
  private dialogRef = inject(DialogRef<ResourceFormComponent>);
  private didacticResourceService = inject(DidacticResourceService);
  private sb = inject(MatSnackBar);
  private data: DidacticResource = inject(MAT_DIALOG_DATA);
  private authService = inject(AuthService);

  loading = true;
  uploading = false;

  resource: DidacticResource | null = null;
  preview = '';
  previewTemplate = '/assets/Plantilla Ejemplo KM.svg';
  grades = [
    'PRIMERO',
    'SEGUNDO',
    'TERCERO',
    'CUARTO',
    'QUINTO',
    'SEXTO',
  ];
  levels = [
    'PRE_PRIMARIA',
    'PRIMARIA',
    'SECUNDARIA'
  ];
  subjects = [
    'LENGUA_ESPANOLA',
    'MATEMATICA',
    'CIENCIAS_SOCIALES',
    'CIENCIAS_NATURALES',
    'INGLES',
    'FRANCES',
    'FORMACION_HUMANA',
    'EDUCACION_FISICA',
    'EDUCACION_ARTISTICA',
    'TALLERES_OPTATIVOS',
    'MANUALES',
    'FASCICULOS',
  ];

  resourceForm = this.fb.group({
    author: ['', Validators.required],
    title: ['', Validators.required],
    description: ['', Validators.required],
    grade: [[] as string[]],
    level: [[] as string[]],
    subject: [[] as string[]],
    downloadLink: ['', Validators.required],
    status: ['draft'],
    preview: ['', Validators.required],
    price: [0],
  });

  concent = this.fb.control(false);
  
  ngOnInit(): void {
    if (this.data) {
      this.resource = this.data;
    }
    this.authService.profile().subscribe(user => {
      this.resourceForm.get('author')?.setValue(user._id);
      this.loading = false;
    });
  }

  onSubmit() {
    const resource: DidacticResource = this.resourceForm.value as any;

    resource.keywords = [...resource.grade, ...resource.subject, ...resource.level];

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

    const file = files.item(0);
    if (!file)
      return;

    const docRef = ref(this.storage, Date.now().toString() + file.name);
    this.uploading = true;
    uploadBytesResumable(docRef, file).then(() => {
      getDownloadURL(docRef).then(preview => {
        this.preview = preview;
        this.resourceForm.get('preview')?.setValue(preview);
        this.sb.open('El archivo ha sido cargado de manera exitosa.', 'Ok', { duration: 2500 });
        this.uploading = false;
      }).catch((err) => {
        this.uploading = false;
        console.log(err)
        this.sb.open('Ha ocurrido un error al cargar el archivo. Intentalo de nuevo, por favor.', 'Ok', { duration: 2500 });
      });
    }).catch((err) => {
      this.uploading = false;
      console.log(err)
      this.sb.open('Ha ocurrido un error al cargar el archivo. Intentalo de nuevo, por favor.', 'Ok', { duration: 2500 });
    });
  }

  processFile(files: FileList | null) {
    if (!files)
      return;

    const file = files.item(0);
    if (!file)
      return;

    const docRef = ref(this.storage, Date.now().toString() + file.name);
    this.uploading = true;
    uploadBytesResumable(docRef, file).then(() => {
      getDownloadURL(docRef).then(downloadLink => {
        this.resourceForm.get('downloadLink')?.setValue(downloadLink);
        this.sb.open('El archivo ha sido cargado de manera exitosa.', 'Ok', { duration: 2500 });
        this.uploading = false;
      }).catch((err) => {
        this.uploading = false;
        console.log(err)
        this.sb.open('Ha ocurrido un error al cargar el archivo. Intentalo de nuevo, por favor.', 'Ok', { duration: 2500 });
      });
    }).catch((err) => {
      this.uploading = false;
      console.log(err)
      this.sb.open('Ha ocurrido un error al cargar el archivo. Intentalo de nuevo, por favor.', 'Ok', { duration: 2500 });
    });
  }
}
