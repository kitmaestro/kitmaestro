import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
	CdkDragDrop,
	CdkDropList,
	CdkDropListGroup,
	DragDropModule,
} from '@angular/cdk/drag-drop';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ClassSection } from '../../../core';
import { ClassScheduleService } from '../../../core/services/class-schedule.service';
import { ClassSectionService } from '../../../core/services/class-section.service';
import { Schedule } from '../../../core';
import { GRADE, JOURNEY, LEVEL } from '../../../core/enums';
import { ClassBlock } from '../../../core';
import { PretifyPipe } from '../../../shared/pipes/pretify.pipe';

@Component({
	selector: 'app-schedule-builder',
	standalone: true,
	imports: [
		CommonModule,
		DragDropModule,
		MatSelectModule,
		MatFormFieldModule,
		MatButtonModule,
		MatSnackBarModule,
		CdkDropList,
		CdkDropListGroup,
		PretifyPipe,
	],
	template: `
		<div class="schedule-builder-container">
			<!-- Main Content: Schedule Grid -->
			<div class="schedule-grid-wrapper">
				<div class="header">
					<mat-form-field
						appearance="outline"
						class="w-full md:w-1/3"
					>
						<mat-label>Selecciona una sección</mat-label>
						<mat-select
							(selectionChange)="onSectionChange($event.value)"
						>
							@for (
								section of classSections();
								track section._id
							) {
								<mat-option [value]="section._id">
									{{ section.name }}
								</mat-option>
							}
						</mat-select>
					</mat-form-field>
					<button
						mat-raised-button
						color="primary"
						(click)="saveSchedule()"
						[disabled]="!selectedSection()"
					>
						Guardar
					</button>
				</div>

				<div class="schedule-grid">
					<!-- Day Headers -->
					<div class="day-header">Bloques</div>
					<div *ngFor="let day of days" class="day-header">
						{{ day }}
					</div>

					<!-- Time Slots and Grid Cells -->
					<ng-container *ngFor="let time of timeSlots; let i = index">
						<div class="time-slot">{{ time }}</div>
						<div
							*ngFor="let day of days; let j = index"
							class="grid-cell"
							cdkDropList
							[id]="getDropListId(j, i)"
							[cdkDropListData]="getBlocksForCell(j, i)"
							(cdkDropListDropped)="drop($event)"
						>
							<div
								*ngFor="let block of getBlocksForCell(j, i)"
								class="class-block"
								[ngClass]="getBlockClass(block)"
								[style.height.%]="getBlockHeight(block)"
								cdkDrag
							>
								<div class="block-content">
									<strong>{{ block.subject }}</strong>
									<small>{{ block.duration }} min</small>
								</div>
							</div>
						</div>
					</ng-container>
				</div>
			</div>

			<!-- Sidebar: Draggable Subjects -->
			<div class="subjects-sidebar" [class.disabled]="!selectedSection()">
				<h3>Asignaturas</h3>
				@if (selectedSection()) {
					<div cdkDropListGroup>
						@for (subject of availableSubjects(); track $index) {
							<div class="subject-drag-list">
								<h4>{{ subject | pretify }}</h4>
								<div
									class="subject-variation-list"
									cdkDropList
									[cdkDropListData]="[
										{
											subject: subject,
											duration: 45,
											id: subject + '_45',
										},
									]"
									[id]="subject + '_45_list'"
								>
									<div class="class-block type-45" cdkDrag>
										<div class="block-content">
											<strong>{{
												subject | pretify
											}}</strong>
											<small>45 min</small>
										</div>
									</div>
								</div>
								<div
									class="subject-variation-list"
									cdkDropList
									[cdkDropListData]="[
										{
											subject: subject,
											duration: 90,
											id: subject + '_90',
										},
									]"
									[id]="subject + '_90_list'"
								>
									<div class="class-block type-90" cdkDrag>
										<div class="block-content">
											<strong>{{
												subject | pretify
											}}</strong>
											<small>90 min</small>
										</div>
									</div>
								</div>
							</div>
						}
					</div>
				} @else {
					<p>Selecciona un grado para ver las asignaturas.</p>
				}
			</div>
		</div>
	`,
	styles: [
		`
			:host {
				display: block;
				font-family: Roboto, 'Helvetica Neue', sans-serif;
			}
			.schedule-builder-container {
				display: flex;
				width: 100%;
				//   height: calc(100vh - 80px); /* Adjust based on your header height */
			}
			.schedule-grid-wrapper {
				flex: 3;
				padding: 20px;
				overflow-y: auto;
				background-color: #f9f9f9;
			}
			.subjects-sidebar {
				flex: 1;
				padding: 20px;
				border-left: 1px solid #ccc;
				background-color: #fff;
				overflow-y: auto;
				transition: opacity 0.3s ease;
			}
			.subjects-sidebar.disabled {
				opacity: 0.5;
				pointer-events: none;
			}
			.header {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 20px;
			}
			.schedule-grid {
				display: grid;
				grid-template-columns: 60px repeat(7, 1fr);
				grid-template-rows: 30px repeat(14, 60px);
				gap: 2px;
				background-color: #e0e0e0;
				border: 1px solid #ccc;
			}
			.day-header,
			.time-slot {
				background-color: #f0f0f0;
				font-weight: bold;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 0.8em;
				padding: 5px;
			}
			.time-slot {
				font-size: 0.7em;
			}
			.grid-cell {
				background-color: #ffffff;
				min-height: 60px;
				position: relative;
			}
			.class-block {
				width: 100%;
				box-sizing: border-box;
				border-radius: 4px;
				padding: 8px;
				color: white;
				cursor: move;
				font-size: 0.8em;
				overflow: hidden;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
				transition: box-shadow 0.2s ease;
			}
			.class-block:hover {
				box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
			}
			.block-content {
				text-align: center;
			}
			.block-content small {
				display: block;
				opacity: 0.8;
			}
			.cdk-drag-placeholder {
				opacity: 0.3;
			}
			.cdk-drag-animating {
				transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
			}
			.grid-cell.cdk-drop-list-dragging
				.class-block:not(.cdk-drag-placeholder) {
				transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
			}
			.subject-drag-list h4 {
				margin-top: 15px;
				margin-bottom: 5px;
				font-size: 1em;
				font-weight: 500;
			}
			.subject-variation-list {
				padding: 5px;
				border: 1px dashed #ccc;
				border-radius: 4px;
				margin-bottom: 5px;
				min-height: 50px;
			}
			/* Subject-specific colors for better visualization */
			.type-45 {
				height: 100%;
			}
			.type-90 {
				height: 200%;
			}
			.subject-Lengua-Española {
				background-color: #4285f4;
			}
			.subject-Matemática {
				background-color: #db4437;
			}
			.subject-Ciencias-Sociales {
				background-color: #f4b400;
			}
			.subject-Ciencias-Naturales {
				background-color: #0f9d58;
			}
			.subject-Inglés {
				background-color: #9c27b0;
			}
			.subject-Francés {
				background-color: #673ab7;
			}
			.subject-Educación-Artística {
				background-color: #e91e63;
			}
			.subject-Educación-Física {
				background-color: #ff9800;
			}
			.subject-Formación-Humana {
				background-color: #795548;
			}
			.subject-Talleres-Optativos {
				background-color: #607d8b;
			}
		`,
	],
})
export class ScheduleBuilderComponent implements OnInit {
	// Services injection
	private classSectionService = inject(ClassSectionService);
	private scheduleService = inject(ClassScheduleService);
	private snackBar = inject(MatSnackBar);
	private router = inject(Router);

	// Component state signals
	classSections = signal<ClassSection[]>([]);
	selectedSection = signal<ClassSection | null>(null);
	schedule = signal<Schedule | null>(null);

	// UI related properties
	days = [
		'Domingo',
		'Lunes',
		'Martes',
		'Miercoles',
		'Jueves',
		'Viernes',
		'Sabado',
	];
	timeSlots = this.generateTimeSlots();

	// Computes the subjects available for the selected class section
	availableSubjects = computed(() => {
		const section = this.selectedSection();
		return section ? section.subjects : [];
	});

	ngOnInit() {
		this.loadClassSections();
	}

	async loadClassSections() {
		this.classSectionService.findSections().subscribe({
			next: (sections) => {
				this.classSections.set(sections);
			},
			error: (error) => {
				console.log(error);
				this.showError('Could not load class sections.');
			},
		});
	}

	onSectionChange(sectionId: string) {
		const section = this.classSections().find(
			(section) => section._id === sectionId,
		);
		if (!section) {
			this.showError('Section not found.');
			return;
		}
		this.selectedSection.set(section);
		this.initializeSchedule(section);
	}

	initializeSchedule(section: ClassSection) {
		// A simple mapping, you might need a more complex logic
		const gradeMap: Record<string, GRADE> = {};

		const newSchedule: Schedule = {
			grade: gradeMap[section.name] || GRADE.PRIMERO,
			level: section.level as any as LEVEL,
			journey: JOURNEY.JEE,
			dailySchedule: this.days.map((_, i) => ({ day: i, blocks: [] })),
		};
		this.schedule.set(newSchedule);
	}

	generateTimeSlots(): string[] {
		const slots: string[] = [];
		for (let i = 0; i < 8; i++) {
			// const hour = 7 + Math.floor((i * 45) / 60);
			// const minute = (i * 45) % 60;
			// const nextHour = 7 + Math.floor(((i + 1) * 45) / 60);
			// const nextMinute = ((i + 1) * 45) % 60;
			// slots.push(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} - ${nextHour.toString().padStart(2, '0')}:${nextMinute.toString().padStart(2, '0')}`);
			slots.push('Bloque ' + (i + 1));
		}
		return slots;
	}

	getDropListId(dayIndex: number, timeIndex: number): string {
		return `day-${dayIndex}-time-${timeIndex}`;
	}

	getBlocksForCell(dayIndex: number, timeIndex: number): ClassBlock[] {
		const currentSchedule = this.schedule();
		if (!currentSchedule) return [];

		const daySchedule = currentSchedule.dailySchedule[dayIndex];
		return daySchedule.blocks.filter((b) => b.position === timeIndex + 1);
	}

	drop(event: CdkDragDrop<any[]>) {
		const item = event.item.data;

		// If moving from sidebar to grid
		if (event.previousContainer.id.includes('_list')) {
			const [_, dayIndexStr, __, timeIndexStr] =
				event.container.id.split('-');
			const dayIndex = parseInt(dayIndexStr, 10);
			const timeIndex = parseInt(timeIndexStr, 10);

			const newBlock: ClassBlock = {
				...item,
				position: timeIndex + 1,
				id: `${item.subject}_${Date.now()}`, // Ensure unique ID
			};

			if (this.isCollision(dayIndex, timeIndex, newBlock.duration)) {
				this.showError(
					'Cannot place block here, it overlaps with another.',
				);
				return;
			}

			this.schedule.update((currentSchedule) => {
				if (!currentSchedule) return null;
				const newDailySchedule = [...currentSchedule.dailySchedule];
				newDailySchedule[dayIndex].blocks.push(newBlock);
				return { ...currentSchedule, dailySchedule: newDailySchedule };
			});
		} else {
			// If moving within the grid
			const [prevDay, prevTime] = this.getIndicesFromId(
				event.previousContainer.id,
			);
			const [newDay, newTime] = this.getIndicesFromId(event.container.id);

			// Remove from old position
			let movedBlock: ClassBlock | undefined;
			this.schedule.update((currentSchedule) => {
				if (!currentSchedule) return null;
				const blockIndex = currentSchedule.dailySchedule[
					prevDay
				].blocks.findIndex((b) => b.id === item.id);
				if (blockIndex > -1) {
					movedBlock = currentSchedule.dailySchedule[
						prevDay
					].blocks.splice(blockIndex, 1)[0];
				}
				return { ...currentSchedule };
			});

			if (!movedBlock) return;

			// Check for collision at new position
			if (this.isCollision(newDay, newTime, movedBlock.duration)) {
				this.showError(
					'Cannot move block here, it overlaps with another.',
				);
				// Re-add to original position
				this.schedule.update((currentSchedule) => {
					if (!currentSchedule) return null;
					currentSchedule.dailySchedule[prevDay].blocks.push(
						movedBlock!,
					);
					return { ...currentSchedule };
				});
				return;
			}

			// Add to new position
			movedBlock.position = newTime + 1;
			this.schedule.update((currentSchedule) => {
				if (!currentSchedule) return null;
				currentSchedule.dailySchedule[newDay].blocks.push(movedBlock!);
				return { ...currentSchedule };
			});
		}
	}

	isCollision(
		dayIndex: number,
		timeIndex: number,
		duration: 45 | 90,
	): boolean {
		const blocksInDay =
			this.schedule()?.dailySchedule[dayIndex].blocks ?? [];
		const newBlockStart = timeIndex + 1;
		const newBlockEnd = newBlockStart + (duration === 90 ? 1 : 0);

		if (newBlockEnd > 14) return true; // Exceeds schedule bounds

		for (const block of blocksInDay) {
			const existingBlockStart = block.position;
			const existingBlockEnd =
				existingBlockStart + (block.duration === 90 ? 1 : 0);

			// Check for overlap
			if (
				newBlockStart <= existingBlockEnd &&
				newBlockEnd >= existingBlockStart
			) {
				return true;
			}
		}
		return false;
	}

	getIndicesFromId(id: string): [number, number] {
		const [_, dayIndexStr, __, timeIndexStr] = id.split('-');
		return [parseInt(dayIndexStr, 10), parseInt(timeIndexStr, 10)];
	}

	getBlockHeight(block: ClassBlock): number {
		return block.duration === 90 ? 200 : 100;
	}

	getBlockClass(block: ClassBlock): string {
		const subjectClass = `subject-${block.subject}`.replace(/\s|_/g, '-');
		return subjectClass;
	}

	async saveSchedule() {
		const currentSchedule = this.schedule();
		if (!currentSchedule) {
			this.showError('No schedule to save.');
			return;
		}

		this.scheduleService.create(currentSchedule).subscribe({
			next: (savedSchedule) => {
				this.snackBar.open('Schedule saved successfully!', 'Close', {
					duration: 3000,
				});
				this.router.navigate(['/user/schedules', savedSchedule._id]);
			},
			error: (error) => {
				this.showError(error.message || 'An unknown error occurred.');
			},
		});
	}

	private showError(message: string) {
		this.snackBar.open(message, 'Close', {
			duration: 3000,
			panelClass: ['error-snackbar'],
		});
	}
}
