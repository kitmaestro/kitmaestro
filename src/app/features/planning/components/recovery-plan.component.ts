import { Component, inject, input } from '@angular/core';
import { RecoveryPlan } from '../../../core/models';
import { CommonModule, DatePipe, UpperCasePipe } from '@angular/common';
import { PretifyPipe, SimpleList } from '../../../shared';
import { Store } from '@ngrx/store';
import { selectAuthUser } from '../../../store';
import { MarkdownComponent } from 'ngx-markdown';

@Component({
  selector: 'app-recovery-plan',
  template: `
    @if (recoveryPlan(); as plan) {
      <div style="padding-bottom: 42px;">
        <h2>Plan de Recuperación del {{ ('' + plan.period) | uppercase }} - {{ plan.subject | pretify }}</h2>
        <div>
          <h3>Escuela</h3>
          <p>{{ user()?.schoolName }}</p>
          <h3>Sección</h3>
          <p>{{ plan.section.name }}</p>
          <h3>Asignatura</h3>
          <p>{{ plan.subject | pretify }}</p>
          <h3>Periodo</h3>
          <p>{{ ('' + plan.period) | uppercase }}</p>
          <h3>Fecha de aplicación</h3>
          <p>Desde {{ plan.startingDate | date : 'dd/MM/yyyy' }} hasta {{ plan.endingDate | date : 'dd/MM/yyyy' }}</p>
          <h3>Diagnóstico</h3>
          <p>{{ plan.diagnostic }}</p>
          <h3>Justificación</h3>
          <p>{{ plan.justification }}</p>
          <h3>Estudiantes</h3>
          <ul>
            @for(student of plan.students; track student) {
              <li>{{ student.firstname }} {{ student.lastname }}</li>
            }
          </ul>
          <h3>Objetivo General</h3>
          <p>{{ plan.generalObjective }}</p>
          <h3>Objetivos Específicos</h3>
          <app-simple-list [items]="plan.specificObjectives" />
          <h3>Competencias</h3>
          <ul>
            @for(competence of plan.competence; track competence) {
              @for(criterion of competence.criteria; track criterion) {
                <li>{{ criterion }}</li>
              }
            }
          </ul>
          <h3>Indicadores de Logro</h3>
          <app-simple-list [items]="plan.achievementIndicators" />
          <h3>Actividades</h3>
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Fecha</th>
                <th>Descripcion</th>
                <th>Estrategias</th>
                <th>Recursos</th>
                <th>Evaluación Formativa</th>
              </tr>
            </thead>
            <tbody>
              @for(activity of plan.activities; track activity) {
                <tr>
                  <td>{{ activity.title }}</td>
                  <td>{{ activity.date | date : 'dd/MM/yyyy' }}</td>
                  <td>
                    @for(el of activity.activities; track el) {
                      <markdown [data]="el" />
                    }
                  </td>
                  <td>
                    @for(el of activity.estrategies; track el) {
                      <p>- {{el}}</p>
                    }
                  </td>
                  <td>
                    @for(el of activity.resources; track el) {
                      <p>- {{el}}</p>
                    }
                  </td>
                  <td>{{ activity.formativeEvaluation }}</td>
                </tr>
              }
            </tbody>
          </table>
          <h3>Instrumentos de Evaluación</h3>
          @for (instrument of plan.evalutionInstruments; track instrument) {
            <markdown [data]="instrument" />
          }
          <h3>Criterios de Éxito</h3>
          <app-simple-list [items]="plan.successCriteria" />
          <h3>Actores Involucrados</h3>
          @for (actor of plan.actors; track actor) {
            <p>{{ actor }}</p>
          }
        </div>
      </div>
    }
  `,
  styles: `
    table {
      width: 100%;
      border-collapse: collapse;
    }
    
    th {
      background-color: #f2f2f2;
      padding: 8px;
    }
    
    td {
      padding: 8px;
    }
    
    tr {
      border-bottom: 1px solid #f2f2f2;
    }
  `,
  standalone: true,
  imports: [
    UpperCasePipe,
    PretifyPipe,
    SimpleList,
    DatePipe,
    MarkdownComponent,
  ],
})
export class RecoveryPlanComponent {
  #store = inject(Store);
  user = this.#store.selectSignal(selectAuthUser);
  recoveryPlan = input<RecoveryPlan | null>(null);
}
