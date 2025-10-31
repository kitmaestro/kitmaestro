import { Component, inject, OnDestroy, signal } from '@angular/core'
import { ActivatedRoute, Router, RouterModule } from '@angular/router'
import { MatCardModule } from '@angular/material/card'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatDialog, MatDialogModule } from '@angular/material/dialog'
import { MatTabsModule } from '@angular/material/tabs'
import { MatListModule } from '@angular/material/list'
import { Store } from '@ngrx/store'
import { Subject, takeUntil } from 'rxjs'

import { DidacticSequence } from '../../../core'
import {
    loadSequence,
    deleteSequence,
    fromDidacticSequences,
	loadPlans
} from '../../../store'
import { ConfirmationDialogComponent, PretifyPipe } from '../../../shared'
import { selectAllPlans } from '../../../store/didactic-sequence-plans/didactic-sequence-plans.selectors'
const {
    selectCurrentSequence,
    selectIsLoadingOne,
    selectIsDeleting
} = fromDidacticSequences

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
    ],
    template: `
    <div class="container">
      @if (isLoading()) {
        <div class="spinner-container">
          <mat-spinner diameter="40"></mat-spinner>
        </div>
      } @else if (sequence()) {
        <mat-card>
          <mat-card-header>
            <mat-card-title>
              Secuencia Didáctica - {{ (sequence()!.level || '') | pretify }} - {{ (sequence()!.year || '') | pretify }} - {{ (sequence()!.subject || '') | pretify }}
            </mat-card-title>
            <div class="header-actions">
              <button
                mat-raised-button
                color="primary"
                [routerLink]="['/admin/didactic-sequences', sequence()!._id, 'edit']">
                <mat-icon>edit</mat-icon>
                Editar
              </button>
              <button
                mat-raised-button
                color="warn"
                (click)="onDelete()"
                [disabled]="isDeleting()">
                <mat-icon>delete</mat-icon>
                Eliminar
              </button>
              <button
                mat-button
                routerLink="/admin/didactic-sequences">
                <mat-icon>arrow_back</mat-icon>
                Volver
              </button>
            </div>
          </mat-card-header>

          <mat-card-content>
            <mat-tab-group>
              <!-- Tabla de Contenidos -->
              <mat-tab label="Tabla de Contenidos">
                <div class="tab-content">
                  @for (item of sequence()!.tableOfContents; track item.title; let i = $index) {
                    <mat-card class="content-item">
                      <mat-card-header>
                        <mat-card-title>{{ i + 1 }}. {{ item.title }}</mat-card-title>
                        <span class="page-info">Página {{ item.startingPage }}</span>
                      </mat-card-header>
                      <mat-card-content>
                        <mat-list dense>
                          @for (topic of item.topics; track topic.title) {
                            <mat-list-item>
                              <span matListItemTitle>{{ topic.title }}</span>
                              <span matListItemLine>Página {{ topic.startingPage }} • Orden {{ topic.order }}</span>
                            </mat-list-item>
                          }
                        </mat-list>
                      </mat-card-content>
                    </mat-card>
                  }
                </div>
              </mat-tab>

              <!-- Planes Didácticos -->
              <mat-tab label="Planes Didácticos">
                <div class="tab-content">
                  @for (plan of plans(); track plan.title; let i = $index) {
                    <mat-card class="plan-item">
                      <mat-card-header>
                        <mat-card-title>{{ i + 1 }}. {{ plan.title }}</mat-card-title>
                      </mat-card-header>
                      <mat-card-content>
                        <p><strong>Descripción:</strong> {{ plan.description }}</p>

                        <h4>Competencias Específicas:</h4>
                        <mat-list dense>
                          @for (competence of plan.specificCompetencies; track competence.name) {
                            <mat-list-item>
                              <span matListItemTitle>{{ competence.name }}</span>
                              <span matListItemLine>{{ competence.description }}</span>
                            </mat-list-item>
                          }
                        </mat-list>

                        <h4>Bloques:</h4>
                        @for (block of plan.blocks; track block.title; let j = $index) {
                          <mat-card class="block-item">
                            <mat-card-header>
                              <mat-card-title>Bloque {{ j + 1 }}: {{ block.title }}</mat-card-title>
                            </mat-card-header>
                            <mat-card-content>
                              <p><strong>Competencia:</strong> {{ block.competence }}</p>

                              <h5>Sesión Inicial:</h5>
                              <p>{{ block.initialSession.description }}</p>
                              <p><strong>Duración:</strong> {{ block.initialSession.durationInHours }} horas</p>
                              <p><strong>Páginas:</strong> {{ block.initialSession.startingPage }} - {{ block.initialSession.lastPage }}</p>

                              <h5>Actividades:</h5>
                              @for (activity of block.activities; track activity.order) {
                                <mat-card class="activity-item">
                                  <mat-card-header>
                                    <mat-card-title>Actividad {{ activity.order }}: {{ activity.name }}</mat-card-title>
                                  </mat-card-header>
                                  <mat-card-content>
                                    <p><strong>Descripción:</strong> {{ activity.description }}</p>
                                    <p><strong>Notas:</strong> {{ activity.notes }}</p>
                                    <p><strong>Duración:</strong> {{ activity.durationInHours }} horas</p>
                                    <p><strong>Páginas:</strong> {{ activity.startingPage }} - {{ activity.lastPage }}</p>
                                  </mat-card-content>
                                </mat-card>
                              }
                            </mat-card-content>
                          </mat-card>
                        }

                        <h4>Recursos Adicionales:</h4>
                        <mat-list dense>
                          @for (resource of plan.additionalResources; track resource.title) {
                            <mat-list-item>
                              <mat-icon matListItemIcon>{{ getResourceIcon(resource.resourceType) }}</mat-icon>
                              <span matListItemTitle>{{ resource.title }}</span>
                              <span matListItemLine>{{ resource.description }} • {{ resource.source }}</span>
                            </mat-list-item>
                          }
                        </mat-list>
                      </mat-card-content>
                    </mat-card>
                  }
                </div>
              </mat-tab>
            </mat-tab-group>
          </mat-card-content>
        </mat-card>
      } @else {
        <mat-card>
          <mat-card-content class="not-found">
            <mat-icon>error_outline</mat-icon>
            <h3>Secuencia no encontrada</h3>
            <button mat-raised-button routerLink="/admin/didactic-sequences">
              Volver al listado
            </button>
          </mat-card-content>
        </mat-card>
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

    .content-item, .plan-item, .block-item, .activity-item {
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

    h4, h5 {
      margin-top: 16px;
      margin-bottom: 8px;
      color: rgba(0, 0, 0, 0.87);
    }

    strong {
      color: rgba(0, 0, 0, 0.87);
    }
  `
})
export class DidacticSequenceDetailsComponent implements OnDestroy {
    #store = inject(Store)
    #route = inject(ActivatedRoute)
    #router = inject(Router)
    #dialog = inject(MatDialog)
    #destroy$ = new Subject<void>()
    #pretify = (new PretifyPipe()).transform

    sequence = signal<DidacticSequence | null>(null)
    isLoading = signal(false)
    isDeleting = signal(false)
    plans = this.#store.selectSignal(selectAllPlans)

    constructor() {
		this.#store.dispatch(loadPlans({ filters:  {} }))
        this.#store.select(selectCurrentSequence)
            .pipe(takeUntil(this.#destroy$))
            .subscribe(sequence => this.sequence.set(sequence))

        this.#store.select(selectIsLoadingOne)
            .pipe(takeUntil(this.#destroy$))
            .subscribe(isLoading => this.isLoading.set(isLoading))

        this.#store.select(selectIsDeleting)
            .pipe(takeUntil(this.#destroy$))
            .subscribe(isDeleting => this.isDeleting.set(isDeleting))

        this.#route.params
            .pipe(takeUntil(this.#destroy$))
            .subscribe(params => {
                const id = params['id']
                if (id) {
                    this.#store.dispatch(loadSequence({ id }))
                }
            })
    }

    onDelete() {
        const sequence = this.sequence()
        if (!sequence) return

        const dialogRef = this.#dialog.open(ConfirmationDialogComponent, {
            data: {
                title: 'Eliminar Secuencia',
                message: `¿Estás seguro de que deseas eliminar la secuencia "${this.#pretify(sequence.level)} - ${this.#pretify(sequence.year)} - ${this.#pretify(sequence.subject)}"? Esta acción no se puede deshacer.`
            }
        })

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.#store.dispatch(deleteSequence({ id: sequence._id }))
                this.#router.navigate(['/admin/didactic-sequences'])
            }
        })
    }

    getResourceIcon(resourceType: string): string {
        const icons: Record<string, string> = {
            VIDEO: 'ondemand_video',
            ARTICLE: 'article',
            BOOK: 'menu_book',
            WEBSITE: 'public',
            OTHER: 'link'
        }
        return icons[resourceType] || 'link'
    }

    ngOnDestroy() {
        this.#destroy$.next()
        this.#destroy$.complete()
    }
}
