import { Component, inject, OnInit } from '@angular/core';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { UnitPlanService } from '../../services/unit-plan.service';
import { catchError, map, Observable, tap } from 'rxjs';
import { UnitPlan } from '../../interfaces/unit-plan';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { IsPremiumComponent } from '../../ui/alerts/is-premium/is-premium.component';
import { UserSettingsService } from '../../services/user-settings.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PdfService } from '../../services/pdf.service';
import { UnitPlanComponent } from '../unit-plan/unit-plan.component';

@Component({
  selector: 'app-unit-plan-detail',
  standalone: true,
  imports: [
    RouterModule,
    AsyncPipe,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    IsPremiumComponent,
    CommonModule,
    MatSnackBarModule,
    UnitPlanComponent,
  ],
  templateUrl: './unit-plan-detail.component.html',
  styleUrl: './unit-plan-detail.component.scss'
})
export class UnitPlanDetailComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private unitPlanService = inject(UnitPlanService);
  private userSettingsService = inject(UserSettingsService);
  private sb = inject(MatSnackBar);
  private pdfService = inject(PdfService);
  planId = this.route.snapshot.paramMap.get('id') || '';

  plan$: Observable<UnitPlan> = this.unitPlanService.findOne(this.planId).pipe(tap(_ => {
    if (!_) {
      this.router.navigate(['/unit-plans/list']).then(() => {
        this.sb.open('Este plan no ha sido encontrado', 'Ok', { duration: 2500 });
      });
    }
  }));
  userSettings$ = this.userSettingsService.getSettings();

  isPrintView = window.location.href.includes('print');

  ngOnInit() {
    if (this.isPrintView) {
      setTimeout(() => {
        window.print()
      }, 2000);
    }
  }

  indicators(plan: UnitPlan) {
    return plan.contents.map(c => ({achievement_indicators: c.achievement_indicators, subject: c.subject}))
  }

  goBack() {
    window.history.back();
  }

  pretifySubject(subject: string) {
    if (subject == 'LENGUA_ESPANOLA') {
      return 'Lengua Española';
    }

    if (subject == 'MATEMATICA') {
      return 'Matemática';
    }

    if (subject == 'CIENCIAS_SOCIALES') {
      return 'Ciencias Sociales';
    }

    if (subject == 'CIENCIAS_NATURALES') {
      return 'Ciencias de la Naturaleza';
    }

    if (subject == 'INGLES') {
      return 'Inglés';
    }

    if (subject == 'FRANCES') {
      return 'Francés';
    }

    if (subject == 'FORMACION_HUMANA') {
      return 'Formación Integral Humana y Religiosa';
    }

    if (subject == 'EDUCACION_FISICA') {
      return 'Educación Física';
    }

    if (subject == 'EDUCACION_ARTISTICA') {
      return 'Educación Artística';
    }

    return 'Talleres Optativos';
  }

  printPlan() {
    this.sb.open('Estamos exportando tu plan. No te muevas!', undefined, { duration: 2500 })
    this.pdfService.exportToPdf('table', 'Unidad de Aprendizaje ' + this.route.snapshot.paramMap.get('id'), false);
  }

  deletePlan() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.unitPlanService.delete(id).subscribe((result) => {
        if (result.deletedCount == 1) {
          this.router.navigate(['/unit-plans']).then(() => {
            this.sb.open('El plan ha sido eliminado.', undefined, { duration: 2500 });
          })
        }
      });
    } else {
      this.sb.open('No se puede eliminar el plan. Se produjo un error.', undefined, { duration: 2500 });
    }
  }
}
