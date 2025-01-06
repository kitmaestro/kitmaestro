import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ClassScheduleService } from '../../services/class-schedule.service';
import { ClassSchedule } from '../../interfaces/class-schedule';
import { ScheduleComponent } from '../schedule/schedule.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-schedule-list',
    imports: [
        ScheduleComponent,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        RouterLink,
    ],
    templateUrl: './schedule-list.component.html',
    styleUrl: './schedule-list.component.scss'
})
export class ScheduleListComponent implements OnInit {
  private scheduleService = inject(ClassScheduleService);
  public schedules: ClassSchedule[] = [];

  ngOnInit(): void {
    this.scheduleService.findAll().subscribe(schedules => {
      this.schedules = schedules;
    });
  }
}
