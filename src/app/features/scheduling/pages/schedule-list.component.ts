import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ClassScheduleService } from '../../../core/services/class-schedule.service';
import { ClassSchedule } from '../../../core/interfaces/class-schedule';
import { ScheduleComponent } from '../components/schedule.component';
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
	template: `
		<mat-card>
			<mat-card-header>
				<mat-card-title>Mi Horario</mat-card-title>
				<a
					routerLink="/schedules/create"
					mat-mini-fab
					style="margin-left: auto"
				>
					<mat-icon>add</mat-icon>
				</a>
			</mat-card-header>
			<mat-card-content></mat-card-content>
		</mat-card>

		<div style="margin-top: 24px">
			@for (schedule of schedules; track schedule._id) {
				<app-schedule [schedule]="schedule"></app-schedule>
			}
		</div>
	`,
})
export class ScheduleListComponent implements OnInit {
	private scheduleService = inject(ClassScheduleService);
	public schedules: ClassSchedule[] = [];

	ngOnInit(): void {
		this.scheduleService.findAll().subscribe((schedules) => {
			this.schedules = schedules;
		});
	}
}
