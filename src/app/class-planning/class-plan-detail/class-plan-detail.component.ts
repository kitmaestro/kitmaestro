import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ClassPlansService } from '../../services/class-plans.service';
import { IsPremiumComponent } from '../../ui/alerts/is-premium/is-premium.component';
import { UserSettingsService } from '../../services/user-settings.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PdfService } from '../../services/pdf.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { tap } from 'rxjs';

@Component({
  selector: 'app-class-plan-detail',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    IsPremiumComponent,
    MatSnackBarModule,
    MatCardModule,
    MatButtonModule,
  ],
  templateUrl: './class-plan-detail.component.html',
  styleUrl: './class-plan-detail.component.scss'
})
export class ClassPlanDetailComponent {
  route = inject(ActivatedRoute);
  router = inject(Router);
  planId = this.route.snapshot.paramMap.get('id') || '';
  classPlanService = inject(ClassPlansService);
  plan$ = this.classPlanService.find(this.planId).pipe(tap(_ => console.log(_)));
  userSettingsService = inject(UserSettingsService);
  settings$ = this.userSettingsService.getSettings();
  sb = inject(MatSnackBar);
  pdfService = inject(PdfService);

  pretify(str: string) {
    switch (str) {
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

  printPlan() {
    this.sb.open('La descarga empezara en un instante. No quites esta pantalla hasta que finalicen las descargas.', 'Ok', { duration: 3000 });
    this.plan$.subscribe(plan => {
      if (plan) {
        this.pdfService.createAndDownloadFromHTML('class-plan', `Plan de Clases ${plan.section.name} de ${plan.section.level} - ${this.pretify(plan.subject || '')}`, false);
      }
    })
  }

  deletePlan() {
    this.classPlanService.deletePlan(this.planId).subscribe(res => {
      if (res.deletedCount == 1) {
        this.router.navigate(['/class-plans']).then(() => {
          this.sb.open('Se ha eliminado el plan', 'Ok', { duration: 2500 });
        });
      }
    })
  }

  goBack() {
    window.history.back()
  }
}
