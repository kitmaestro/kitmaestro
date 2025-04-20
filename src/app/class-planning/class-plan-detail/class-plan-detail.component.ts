import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ClassPlansService } from '../../services/class-plans.service';
import { UserSettingsService } from '../../services/user-settings.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PdfService } from '../../services/pdf.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { tap } from 'rxjs';
import { ClassPlan } from '../../interfaces/class-plan';
import { PretifyPipe } from '../../pipes/pretify.pipe';

@Component({
    selector: 'app-class-plan-detail',
    imports: [
        RouterModule,
        CommonModule,
        MatSnackBarModule,
        MatCardModule,
        MatButtonModule,
        PretifyPipe,
    ],
    templateUrl: './class-plan-detail.component.html',
    styleUrl: './class-plan-detail.component.scss'
})
export class ClassPlanDetailComponent {
  route = inject(ActivatedRoute);
  router = inject(Router);
  planId = this.route.snapshot.paramMap.get('id') || '';
  classPlanService = inject(ClassPlansService);
  plan$ = this.classPlanService.find(this.planId).pipe(tap(_ => {this.plan = _; console.log(_)}));
  userSettingsService = inject(UserSettingsService);
  settings$ = this.userSettingsService.getSettings();
  sb = inject(MatSnackBar);
  pdfService = inject(PdfService);
  plan: ClassPlan | null = null;
  printing = false;

  pretify = (new PretifyPipe()).transform

  printPlan() {
    this.sb.open('La descarga empezara en un instante. No quites esta pantalla hasta que finalicen las descargas.', 'Ok', { duration: 3000 });
    this.plan$.subscribe(plan => {
      if (plan) {
        this.pdfService.createAndDownloadFromHTML('class-plan', `Plan de Clases ${plan.section.name} de ${plan.section.level.toLowerCase()} - ${this.pretify(plan.subject || '')}`, false);
      }
    });
  }

  async downloadPlan() {
    if (!this.plan) {
      this.sb.open('El plan no ha sido encontrado o cargado todavia', 'Ok', { duration: 2500 })
      return;
    }
    this.printing = true;
    await this.classPlanService.download(this.plan);
    this.printing = false;
  }

  deletePlan() {
    this.classPlanService.deletePlan(this.planId).subscribe(res => {
      if (res.deletedCount === 1) {
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
