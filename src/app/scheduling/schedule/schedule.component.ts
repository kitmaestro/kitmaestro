import { Component, Input } from '@angular/core';
import { ClassSchedule } from '../../interfaces/class-schedule';
import { MatCardModule } from '@angular/material/card';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-schedule',
    imports: [
        MatCardModule,
        DatePipe,
    ],
    templateUrl: './schedule.component.html',
    styleUrl: './schedule.component.scss'
})
export class ScheduleComponent {
  @Input() schedule: ClassSchedule | null = null;

  classPeriods = [null, 0, 1, null, 2, 3, null, 4, 5, null, 6, 7];
  daysOfWeek = [1, 2, 3, 4, 5];
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
  ];

  stringToDate(str: string) {
    const date = new Date();
    const [hours, minutes] = str.split(':');
    if (hours && minutes) {
      date.setHours(+hours);
      date.setMinutes(+minutes);
    }
    return date;
  }

  findSubject(day: number, hour: string) {
    if (this.schedule) {
      const period = this.schedule.periods.find(p => p.startTime == hour && p.dayOfWeek == day);
      if (period) {
        return this.pretify(period.subject);
      }
    }
    return '';
  }

  pretifyFormat(str: string) {
    if (str == 'JEE') return 'Jornada Extendida';
    if (str == 'MATUTINA') return 'Matutina';
    if (str == 'VESPERTINA') return 'Vespertina';
    if (str == 'NOCTURNA') return 'Nocturna';
    if (str == 'SABATINA') return 'Sabatina';
    return 'error';
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
      case 'TALLERES_OPTATIVOS':
        return 'Talleres Optativos';
      default:
        return str;
    }
  }
}
