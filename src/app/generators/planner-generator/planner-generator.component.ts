import { Component, OnInit, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AiService } from '../../services/ai.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PdfService } from '../../services/pdf.service';
import { UserSettingsService } from '../../services/user-settings.service';
import { MatIconModule } from '@angular/material/icon';

interface PlannerTemplate {
  date: string,
  fullname: string,
  classroom: string,
  subject: string,
}

@Component({
  selector: 'app-planner-generator',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatIconModule,
    CommonModule,
  ],
  templateUrl: './planner-generator.component.html',
  styleUrl: './planner-generator.component.scss'
})
export class PlannerGeneratorComponent implements OnInit {
  fb = inject(FormBuilder);
  sb = inject(MatSnackBar);
  dialog = inject(MatDialog);
  aiService = inject(AiService);
  pdfService = inject(PdfService);
  settingsService = inject(UserSettingsService);

  underDevelopment = false;
  generating: boolean = false;
  imgSrc = '';
  m = new Date().getMonth();
  months = [
    { id: 7, name: 'Agosto' },
    { id: 8, name: 'Septiembre' },
    { id: 9, name: 'Octubre' },
    { id: 10, name: 'Noviembre' },
    { id: 11, name: 'Diciembre' },
    { id: 0, name: 'Enero' },
    { id: 1, name: 'Febrero' },
    { id: 2, name: 'Marzo' },
    { id: 3, name: 'Abril' },
    { id: 4, name: 'Mayo' },
    { id: 5, name: 'Junio' },
    { id: 6, name: 'Julio' },
  ];

  templateTypes = [
    'Plan Diario (Primaria)',
    // 'Unidad de Aprendizaje (Primaria)',
  ];

  colors: { color: string, spanish: string, hex: string }[] = [
    { color: 'red', spanish: 'Rojo', hex: '#F44336' },
    { color: 'pink', spanish: 'Rosa', hex: '#E91E63' },
    { color: 'purple', spanish: 'Morado', hex: '#9C27B0' },
    { color: 'deep purple', spanish: 'Morado oscuro', hex: '#673AB7' },
    { color: 'indigo', spanish: 'Añil', hex: '#3F51B5' },
    { color: 'blue', spanish: 'Azul', hex: '#2196F3' },
    { color: 'light blue', spanish: 'Azul claro', hex: '#03A9F4' },
    { color: 'cyan', spanish: 'Cian', hex: '#00BCD4' },
    { color: 'teal', spanish: 'Verde azulado', hex: '#009688' },
    { color: 'green', spanish: 'Verde', hex: '#4CAF50' },
    { color: 'light green', spanish: 'Verde claro', hex: '#8BC34A' },
    { color: 'lime', spanish: 'Lima', hex: '#CDDC39' },
    { color: 'yellow', spanish: 'Amarillo', hex: '#FFEB3B' },
    { color: 'amber', spanish: 'Ámbar', hex: '#FFC107' },
    { color: 'orange', spanish: 'Naranja', hex: '#FF9800' },
    { color: 'deep orange', spanish: 'Naranja oscuro', hex: '#FF5722' },
    { color: 'brown', spanish: 'Marrón', hex: '#795548' },
    { color: 'grey', spanish: 'Gris', hex: '#9E9E9E' },
    { color: 'blue grey', spanish: 'Gris azulado', hex: '#607D8B' },
    { color: 'Magenta', spanish: 'Magenta', hex: '#E91E63' },
    { color: 'Olive', spanish: 'Oliva', hex: '#4CAF50' },
    { color: 'Maroon', spanish: 'Granate', hex: '#673AB7' },
    { color: 'Navy', spanish: 'Azul marino', hex: '#001F3F' },
    { color: 'Aquamarine', spanish: 'Aguamarina', hex: '#7FFFD4' },
    { color: 'Turquoise', spanish: 'Turquesa', hex: '#40E0D0' },
    { color: 'Silver', spanish: 'Plata', hex: '#C0C0C0' },
    { color: 'Gold', spanish: 'Oro', hex: '#FFD700' },
    { color: 'Violet', spanish: 'Violeta', hex: '#8A2BE2' }
  ];

  flowers: { name: string, spanish: string }[] = [
    { name: 'Rose', spanish: 'Rosa' },
    { name: 'Daisy', spanish: 'Margarita' },
    { name: 'Sunflower', spanish: 'Girasol' },
    { name: 'Tulip', spanish: 'Tulipán' },
    { name: 'Lily', spanish: 'Lirio' },
    { name: 'Daffodil', spanish: 'Narciso' },
    { name: 'Orchid', spanish: 'Orquídea' },
    { name: 'Carnation', spanish: 'Clavel' },
    { name: 'Peony', spanish: 'Peonía' },
    { name: 'Dahlia', spanish: 'Dalia' },
    { name: 'Hydrangea', spanish: 'Hortensia' },
    { name: 'Chrysanthemum', spanish: 'Crisantemo' },
    { name: 'Poppy', spanish: 'Amapola' },
    { name: 'Lavender', spanish: 'Lavanda' },
    { name: 'Jasmine', spanish: 'Jazmín' },
    { name: 'Violet', spanish: 'Violeta' },
    { name: 'Peacock Flower', spanish: 'Flor de pavo real' },
    { name: 'Bougainvillea', spanish: 'Buganvilla' },
    { name: 'Azalea', spanish: 'Azalea' },
    { name: 'Camellia', spanish: 'Camelia' }
  ];

  decorations: { option: string, spanish: string }[] = [
    { option: 'Floral patterns', spanish: 'Patrones florales' },
    { option: 'Geometric designs', spanish: 'Diseños geométricos' },
    { option: 'Cute illustrations', spanish: 'Ilustraciones bonitas' },
    { option: 'Autumn', spanish: 'Otoño' },
    { option: 'Winter', spanish: 'Invierno' },
    { option: 'Spring', spanish: 'Primavera' },
    { option: 'Summer', spanish: 'Verano' },
    { option: 'Icons and symbols', spanish: 'Iconos y símbolos' },
    { option: 'Watercolor paintings', spanish: 'Pinturas acuarelas' },
    { option: 'Scenic landscapes', spanish: 'Paisajes escénicos' },
    { option: 'Cartoon characters', spanish: 'Personajes de caricaturas' },
    { option: 'Abstract art', spanish: 'Arte abstracto' },
    { option: 'Whimsical drawings', spanish: 'Dibujos caprichosos' },
    { option: 'Vintage imagery', spanish: 'Imágenes vintage' },
    { option: 'Typographic elements', spanish: 'Elementos tipográficos' },
    { option: 'Animal illustrations', spanish: 'Ilustraciones de animales' },
    { option: 'Food and drink illustrations', spanish: 'Ilustraciones de comida y bebida' },
    { option: 'Celestial themes', spanish: 'Temas celestiales' },
    { option: 'Travel and adventure motifs', spanish: 'Motivos de viaje y aventura' },
    { option: 'Botanical illustrations', spanish: 'Ilustraciones botánicas' },
    { option: 'Nautical and oceanic themes', spanish: 'Temas náuticos y oceánicos' },
    { option: 'Fairytale and fantasy elements', spanish: 'Elementos de cuento de hadas y fantasía' }
  ];

  subjects: string[] = [];
  school: string = '';
  fullname: string = '';
  visible = false;
  queue = 0;

  templates: PlannerTemplate[] = [];

  plannerForm = this.fb.group({
    templateType: [0],
    color: ['red'],
    decoration: ['Floral patterns'],
    fullName: ['', Validators.required],
    classroom: [''],
    subjects: ['', Validators.required],
    date: [this.m],
  });

  ngOnInit() {
    setTimeout(() => {
      this.settingsService.getSettings().subscribe(user => {
        const fullname = `${user.title}. ${user.firstname} ${user.lastname}`;
        this.fullname = fullname;
        this.plannerForm.get('fullName')?.setValue(fullname);
        this.plannerForm.get('fullName')?.disable();
        this.subjects = [] as string[];
        this.school = user.schoolName;
      })
    }, 500);
  }

  onSubmit() {
    this.generating = true;
    const { color, decoration, classroom, subjects, date } = this.plannerForm.value;
    if (!subjects) {
      this.generating = false;
      return;
    }

    const templates: PlannerTemplate[] = [];
    const d = typeof(date) !== 'number' ? `${new Date().getMonth() + 1}/2025` : date < 6 ? `${date + 1}/2025` : `${date + 1}/2024`;

    const classrooms = classroom ? classroom.split(',') : [];

    if (classrooms.length) {
      for (let cr of classrooms) {
        for (let subject of subjects as any as string[]) {
          const template: PlannerTemplate = {
            date: d,
            subject,
            classroom: cr,
            fullname: this.fullname,
          }
          templates.push(template);
        }
      }
    } else {
      for (let subject of subjects as any as string[]) {
        const template: PlannerTemplate = {
          date: d,
          subject,
          classroom: '',
          fullname: this.fullname,
        }
        templates.push(template);
      }
    }

    this.templates = templates;

    this.aiService.generateImage(`a ${color} ${decoration}`).subscribe((res) => {
      this.sb.open('Generacion completa!', 'Ok', { duration: 2500 });
      this.imgSrc = res.result;
      this.generating = false;
    });
  }

  printTemplates() {
    if (this.queue > 0) {
      this.sb.open('Las descargas ya estan en progreso, espera a que terminen.');
      return;
    }

    this.queue = this.templates.length;
    this.sb.open('La descarga empezara en unos instantes. No quites esta pantalla hasta que finalicen las descargas.');
    this.templates.forEach((t, i) => {
      setTimeout(() => {
        this.pdfService.createAndDownloadFromHTML('template-' + i, 'Plan Diario de Primaria - ' + t.subject, false).then(() => {
          this.queue--;
          if (this.queue == 0) {
            this.sb.open('Todas las descargas han finalizado. Ya puedes salir de esta pantalla.')
          }
        }).catch(() => {
          this.queue--;
          if (this.queue == 0) {
            this.sb.open('Todas las descargas han finalizado. Ya puedes salir de esta pantalla.')
          }
        });
      }, 1500);
    });
  }
}
