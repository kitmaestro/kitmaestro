import { Component, inject } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClassScheduleService } from '../../services/class-schedule.service';
import { AuthService } from '../../services/auth.service';
import { ClassSectionService } from '../../services/class-section.service';
import { ClassSection } from '../../interfaces/class-section';
import { IsPremiumComponent } from '../../ui/alerts/is-premium/is-premium.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ClassPeriod } from '../../interfaces/class-schedule';

@Component({
    selector: 'app-schedule-builder',
    imports: [
        IsPremiumComponent,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        RouterModule,
        DatePipe,
    ],
    templateUrl: './schedule-builder.component.html',
    styleUrl: './schedule-builder.component.scss'
})
export class ScheduleBuilderComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private scheduleService = inject(ClassScheduleService);
  private sectionService = inject(ClassSectionService);
  private router = inject(Router);
  private sb = inject(MatSnackBar);

  sections: ClassSection[] = [];

  formats = [
    { id: 'JEE', label: 'Jornada Extendida' },
    { id: 'MATUTINA', label: 'Matutina' },
    { id: 'VESPERTINA', label: 'Vespertina' },
    { id: 'NOCTURNA', label: 'Nocturna' },
    { id: 'SABATINA', label: 'Sabatina' },
  ]

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
    'TALLERES_OPTATIVOS'
  ]

  hours = [
    {
      classSession: false,
      startTime: '08:00',
      endTime: '08:15',
      label: 'Acto Cívico'
    },
    {
      classSession: true,
      startTime: '08:15',
      endTime: '09:00'
    },
    {
      classSession: true,
      startTime: '09:00',
      endTime: '09:45'
    },
    {
      classSession: false,
      startTime: '09:45',
      endTime: '10:15',
      label: 'Recreo'
    },
    {
      classSession: true,
      startTime: '10:15',
      endTime: '11:00'
    },
    {
      classSession: true,
      startTime: '11:00',
      endTime: '11:45'
    },
    {
      classSession: false,
      startTime: '11:45',
      endTime: '12:45',
      label: 'Almuerzo'
    },
    {
      classSession: true,
      startTime: '12:45',
      endTime: '13:30'
    },
    {
      classSession: true,
      startTime: '13:30',
      endTime: '14:15'
    },
    {
      classSession: false,
      startTime: '14:15',
      endTime: '14:30',
      label: 'Receso'
    },
    {
      classSession: true,
      startTime: '14:30',
      endTime: '15:15'
    },
    {
      classSession: true,
      startTime: '15:15',
      endTime: '16:00'
    },
  ]

  daysOfWeek = [1, 2, 3, 4, 5];
  classPeriods = [null, 0, 1, null, 2, 3, null, 4, 5, null, 6, 7];

  scheduleForm = this.fb.group({
    user: [''],
    section: ['', Validators.required],
    format: ['JEE', Validators.required],
    periods: this.fb.array(
      this.hours.map(block => {
        if (block.classSession) {
          return this.daysOfWeek.map(dayOfWeek => {
            return this.fb.group({
              subject: ['Hora Libre'],
              dayOfWeek: [dayOfWeek],
              startTime: [block.startTime],
              endTime: [block.endTime],
            })
          })
        } else {
          return this.daysOfWeek.map(() => null);
        }
      }).flat()
    )
  });

  ngOnInit() {
    this.authService.profile().subscribe(user => {
      if (user._id) {
        this.scheduleForm.get('user')?.setValue(user._id);
      }
    });
    this.sectionService.findSections().subscribe({
      next: sections => {
        if (sections.length) {
          this.sections = sections;
          this.scheduleForm.get('section')?.setValue(sections[0]._id);
        }
      }
    });
  }

  stringToDate(str?: string) {
    if (str) {
      const [hours, minutes] = str.split(':');
      const date = new Date();
      date.setHours(+hours);
      date.setMinutes(+minutes);
      return date;
    }
    return new Date();
  }

  onSubmit() {
    const schedule: any = this.scheduleForm.value;
    schedule.periods = schedule.periods.filter((period: ClassPeriod | null) => period != null);
    this.scheduleService.create(schedule).subscribe({
      next: result => {
        if (result._id) {
          this.router.navigate(['/schedules']).then(() => {
            this.sb.open('Se ha guardado tu horario', 'Ok', { duration: 2500 });
          });
        }
      },
      error: err => {
        this.sb.open('Ha ocurrido un error al guardar', 'Ok', { duration: 2500 });
        console.log(err.message);
      }
    });
  }

  get periods() {
    return this.scheduleForm.get('periods') as FormArray;
  }

  addEntry(day: number, startTime: string, endTime: string) {
    const entry = this.fb.group({
      subject: ['Hora Libre'],
      dayOfWeek: [day],
      startTime: [startTime],
      endTime: [endTime]
    });
    this.periods.push(entry);
  }

  removeEntry(index: number) {
    this.periods.removeAt(index);
  }

  pretify(str: string) {
    switch(str) {
      case 'LENGUA_ESPANOLA':
        return 'Lengua Española';
      case 'MATEMATICA':
        return 'Matemática';
      case 'CIENCIAS_SOCIALES':
        return 'Ciencias Sociales';
      case 'CIENCIAS_NATURALES':
        return 'Ciencias de la Naturaleza';
      case 'INGLES':
        return 'Inglés';
      case 'FRANCES':
        return 'Francés';
      case 'FORMACION_HUMANA':
        return 'Formación Integral Humana y Religiosa';
      case 'EDUCACION_FISICA':
        return 'Educación Física';
      case 'EDUCACION_ARTISTICA':
        return 'Educación Artística';
      default:
        return 'Talleres Optativos';
    }
  }
}
