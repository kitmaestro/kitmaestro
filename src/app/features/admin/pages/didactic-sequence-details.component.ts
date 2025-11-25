import { Component, inject, OnDestroy, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';

import {
	loadSequence,
	deleteSequence,
	fromDidacticSequences,
	loadSequencePlans,
} from '../../../store';
import { ConfirmationDialogComponent, PretifyPipe } from '../../../shared';
import { selectAllPlans } from '../../../store/didactic-sequence-plans/didactic-sequence-plans.selectors';
import { DidacticPlanFormComponent } from '../components/didactic-sequence-plan-form.component';
const { selectCurrentSequence, selectIsLoadingOne, selectIsDeleting } =
	fromDidacticSequences;

@Component({
	selector: 'app-didactic-sequence-details',
	standalone: true,
	imports: [
		RouterModule,
		MatCardModule,
		MatButtonModule,
		MatIconModule,
		MatProgressSpinnerModule,
		MatDialogModule,
		MatTabsModule,
		MatListModule,
		PretifyPipe,
		DidacticPlanFormComponent,
	],
	template: `
		<div class="container">
			@if (isLoading()) {
				<div class="spinner-container">
					<mat-spinner diameter="40"></mat-spinner>
				</div>
			} @else if (sequence()) {
				<div>
					<div
						style="display: flex; justify-content: space-between; align-items: center;"
					>
						<h2>
							Secuencia Didáctica -
							{{ sequence()!.level || '' | pretify }} -
							{{ sequence()!.year || '' | pretify }} -
							{{ sequence()!.subject || '' | pretify }}
						</h2>
						<div class="header-actions">
							<button
								mat-button
								color="primary"
								[routerLink]="[
									'/admin/didactic-sequences',
									sequence()!._id,
									'edit',
								]"
							>
								<mat-icon>edit</mat-icon>
								Editar
							</button>
							<button
								mat-button
								color="warn"
								(click)="onDelete()"
								[disabled]="isDeleting()"
							>
								<mat-icon>delete</mat-icon>
								Eliminar
							</button>
							<button
								mat-button
								routerLink="/admin/didactic-sequences"
							>
								<mat-icon>arrow_back</mat-icon>
								Volver
							</button>
						</div>
					</div>

					<div>
						<div>
							<h3>Tabla de Contenidos</h3>
							<div class="tab-content">
								@for (
									item of sequence()!.tableOfContents;
									track item.title;
									let i = $index
								) {
									<div class="content-item">
										<h4>{{ i + 1 }}. {{ item.title }}</h4>
										<ul style="margin: 0; padding: 0;">
											@for (
												topic of item.topics;
												track topic.title
											) {
												<li
													style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px dashed #ddd; margin-bottom: 2px;"
												>
													<span>{{
														topic.title
													}}</span>
													<span
														>Página
														{{
															(
																'' +
																topic.startingPage
															).padStart(3, '000')
														}}</span
													>
												</li>
											}
										</ul>
									</div>
								}
							</div>
							<div>
								<h3>Planes Didácticos</h3>
								<div class="tab-content">
									@for (
										plan of plans();
										track plan.title;
										let i = $index
									) {
										<div class="plan-item">
											<div>
												<h4>
													<a [routerLink]="[
														'/admin/didactic-sequence-plans',
														plan._id,
													]">
														{{ i + 1 }}.
														{{ plan.title }}
													</a>
												</h4>
											</div>
											<div>
												<h4>Descripción:</h4>
												<p [innerHTML]="plan.description.replaceAll('\n', '<br><br>')"></p>

												<h4>
													Competencias Específicas:
												</h4>
												<mat-list dense>
													@for (
														competence of plan.specificCompetencies;
														track competence.name
													) {
														<mat-list-item>
															<span
																matListItemTitle
																>{{
																	competence.name
																}}</span
															>
															<span
																matListItemLine
																>{{
																	competence.description
																}}</span
															>
														</mat-list-item>
													}
												</mat-list>
											</div>
										</div>
									}
								</div>
								<div>
									<app-didactic-sequence-plan-form />
								</div>
							</div>
						</div>
					</div>
				</div>
			} @else {
				<div>
					<div class="not-found">
						<mat-icon>error_outline</mat-icon>
						<h3>Secuencia no encontrada</h3>
						<button
							mat-raised-button
							routerLink="/admin/didactic-sequences"
						>
							Volver al listado
						</button>
					</div>
				</div>
			}
		</div>
	`,
	styles: `
		.container {
			padding: 16px;
		}

		.spinner-container {
			display: flex;
			justify-content: center;
			padding: 40px;
		}

		.header-actions {
			display: flex;
			gap: 8px;
			margin-left: auto;
		}

		.tab-content {
			padding: 16px 0;
		}

		.content-item,
		.plan-item,
		.block-item,
		.activity-item {
			margin-bottom: 16px;
		}

		.page-info {
			color: rgba(0, 0, 0, 0.54);
			font-size: 14px;
		}

		.block-item {
			margin-left: 16px;
			border-left: 3px solid #3f51b5;
		}

		.activity-item {
			margin-left: 16px;
			border-left: 3px solid #ff9800;
		}

		.not-found {
			text-align: center;
			padding: 40px;
			color: rgba(0, 0, 0, 0.54);
		}

		.not-found mat-icon {
			font-size: 48px;
			width: 48px;
			height: 48px;
			margin-bottom: 16px;
		}

		h4,
		h5 {
			margin-top: 16px;
			margin-bottom: 8px;
			color: rgba(0, 0, 0, 0.87);
		}

		strong {
			color: rgba(0, 0, 0, 0.87);
		}
	`,
})
export class DidacticSequenceDetailsComponent implements OnDestroy {
	#store = inject(Store);
	#route = inject(ActivatedRoute);
	#router = inject(Router);
	#dialog = inject(MatDialog);
	#destroy$ = new Subject<void>();
	#pretify = new PretifyPipe().transform;

	sequence = this.#store.selectSignal(selectCurrentSequence);
	isLoading = this.#store.selectSignal(selectIsLoadingOne);
	isDeleting = this.#store.selectSignal(selectIsDeleting);

	plans = this.#store.selectSignal(selectAllPlans);

	constructor() {
		const id = this.#route.snapshot.paramMap.get('id');
		if (!id) {
			this.#router.navigateByUrl('/admin/didactic-sequences');
			return;
		}
		this.#store.dispatch(loadSequencePlans({ filters: { didacticSequence: id } }));
		this.#store.dispatch(loadSequence({ id }));
	}

	onDelete() {
		const sequence = this.sequence();
		if (!sequence) return;

		const dialogRef = this.#dialog.open(ConfirmationDialogComponent, {
			data: {
				title: 'Eliminar Secuencia',
				message: `¿Estás seguro de que deseas eliminar la secuencia "${this.#pretify(sequence.level)} - ${this.#pretify(sequence.year)} - ${this.#pretify(sequence.subject)}"? Esta acción no se puede deshacer.`,
			},
		});

		dialogRef.afterClosed().subscribe((result) => {
			if (result) {
				this.#store.dispatch(deleteSequence({ id: sequence._id }));
				this.#router.navigate(['/admin/didactic-sequences']);
			}
		});
	}

	getResourceIcon(resourceType: string): string {
		const icons: Record<string, string> = {
			VIDEO: 'ondemand_video',
			ARTICLE: 'article',
			BOOK: 'menu_book',
			WEBSITE: 'public',
			OTHER: 'link',
		};
		return icons[resourceType] || 'link';
	}

	ngOnDestroy() {
		this.#destroy$.next();
		this.#destroy$.complete();
	}
}
