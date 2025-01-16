import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ClassSectionService } from '../services/class-section.service';
import { ClassSection } from '../interfaces/class-section';
import { PretifyPipe } from '../pipes/pretify.pipe';
import { StudentsService } from '../services/students.service';
import { Student } from '../interfaces/student';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';

export interface AttendanceWeek {
    week: number,
    days: {
        dayOfTheWeek: string, // lun,mar,mie,jue,vie,sab,dom
        date: Date,
    }[]
}

export interface AttendanceCalendar {
    daysPerWeek: number,
    weeks: AttendanceWeek[]
}

@Component({
    selector: 'app-attendance-dashboard',
    imports: [
        MatCardModule,
        MatInputModule,
        MatSelectModule,
        MatFormFieldModule,
        MatSnackBarModule,
        PretifyPipe,
        ReactiveFormsModule,
        RouterLink,
    ],
    templateUrl: './attendance-dashboard.component.html',
    styleUrl: './attendance-dashboard.component.scss'
})
export class AttendanceDashboardComponent {
    private sectionService = inject(ClassSectionService);
    private studentService = inject(StudentsService);
    private sb = inject(MatSnackBar);
    private route = inject(ActivatedRoute);
    private id = this.route.snapshot.queryParamMap.get('section');
    
    sections: ClassSection[] = [];
    students: Student[] = [];
    section: FormControl = new FormControl<string>('');
    month: FormControl = new FormControl<number>(new Date().getMonth() + 1);
    year: FormControl = new FormControl<number>(new Date().getFullYear());

    mode = 'Jornada Extendida';
    calendar: AttendanceCalendar = {
        daysPerWeek: 5,
        weeks: []
    };

    loadSections() {
        this.sectionService.findSections().subscribe({
            next: sections => {
                if (sections.length) {
                    this.sections = sections;
                    if (this.id) {
                        const section = sections.find(s => s._id == this.id);
                        if (section) {
                            this.section.setValue(section._id);
                            this.onSectionSelect({ value: section._id })
                        }
                    }
                } else {
                    this.sb.open('Necesitas crear al menos una sesion para usar esta herramienta.', 'Ok', { duration: 2500 });
                }
            },
            error: err => {
                console.log(err.message)
            },
            complete: () => {}
        });
    }

    getWeekCount(year: number, month: number): number {
        const date = new Date(year, month, 0);
        const daysInMonth = date.getDate();
        const firstDay = new Date(year, month, 1).getDay();
        const lastDay = new Date(year, month, daysInMonth).getDay();

        let weekCount = Math.ceil((daysInMonth + firstDay) / 7);
        if (lastDay !== 0 && lastDay < 6) {
            weekCount++;
        }
        return weekCount;
    }

    makeCalendar() {
        switch (this.mode) {
            case 'Matutina':
            case 'Vespertina':
            case 'Nocturna':
            case 'Jornada Extendida': {
                this.calendar.daysPerWeek = 5;
                const date = new Date(this.year.value, this.month.value - 1, 1);
                const lastDayOfMonth = new Date(this.year.value, this.month.value, 0);
                const dayOfTheWeek = (d: Date) => ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'][d.getDay()];
                const beforeStart = date.getDay() - 1;
                const weeksInMonth = this.getWeekCount(this.year.value, this.month.value);
                const weeks: AttendanceWeek[] = [];
                const week: AttendanceWeek = {
                    week: 0,
                    days: []
                };
                for (let i = beforeStart; i > 0; i--) {
                    const d = new Date(+date - (1000 * 60 * 60 * 24 * i));
                    week.days.push({
                        date: d,
                        dayOfTheWeek: dayOfTheWeek(d)
                    });
                }
                for (let i = 5 - beforeStart; i < 5; i++) {
                    week.days.push({
                        date: date,
                        dayOfTheWeek: dayOfTheWeek(date),
                    });
                    date.setDate(date.getDate() + 1);
                }
                weeks.push(week);
                while (date.getMonth() === (this.month.value - 1)) {
                    const week: AttendanceWeek = {
                        week: weeks.length,
                        days: []
                    };
                    if (date.getDay() >= 1 && date.getDay() <= 5) {
                        week.days.push({
                            date,
                            dayOfTheWeek: dayOfTheWeek(date)
                        });
                    }
                    if (date.getDay() > 5) {
                        weeks.push(week);
                        week.week = weeks.length;
                        week.days = [];
                    }
                    date.setDate(date.getDate() + 1);
                }
                console.log(weeks)
                break;
            }
            case 'Sabatina': {
                this.calendar.daysPerWeek = 1;
                break;
            }
            case 'Dominical': {
                this.calendar.daysPerWeek = 1;
                break;
            }
            default: {
                return;
            }
        }
    }

    onSectionSelect(event: any) {
        const section = this.sections.find(s => s._id == event.value);
        if (section) {
            this.mode == section.school.journey;
        }
        this.makeCalendar();
        this.studentService.findBySection(event.value).subscribe({
            next: students => {
                if (students.length) {
                    this.students = students;
                } else {
                    this.sb.open('Necesitas registrar tus estudiantes primero.', 'Ok', { duration: 2500 });
                }
            },
            error: err => {
                console.log(err.message)
            },
            complete: () => {}
        });
    }

    onMonthSelect(event: any) {
        this.makeCalendar();
    }

    onYearSelect(event: any) {
        this.makeCalendar();
    }

    ngOnInit() {
        this.loadSections();
    }
}
