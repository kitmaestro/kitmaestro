import { Component, inject } from '@angular/core';
import { ClassPlansService } from '../../services/class-plans.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { IsPremiumComponent } from '../../ui/alerts/is-premium/is-premium.component';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { AsyncPipe, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClassPlan } from '../../interfaces/class-plan';

@Component({
    selector: 'app-class-plan-list',
    imports: [
        MatButtonModule,
        MatCardModule,
        IsPremiumComponent,
        MatListModule,
        AsyncPipe,
        DatePipe,
        RouterModule,
        MatIconModule,
        MatTableModule,
    ],
    templateUrl: './class-plan-list.component.html',
    styleUrl: './class-plan-list.component.scss'
})
export class ClassPlanListComponent {
  classPlansService = inject(ClassPlansService);
  classPlans$ = this.classPlansService.findAll();
  sb = inject(MatSnackBar);

  displayedColumns = ['section', 'subject', 'date', 'actions'];

  deletePlan(id: string) {
    this.classPlansService.deletePlan(id).subscribe((res) => {
      if (res.deletedCount == 1) {
        this.classPlans$ = this.classPlansService.findAll();
        this.sb.open('El Plan fue eliminado!', 'Ok', { duration: 2500 });
      }
    });
  }

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

  async download(plan: ClassPlan) {
    this.sb.open('Estamos descargando tu plan.', 'Ok', { duration: 2500 });
    await this.classPlansService.download(plan);
  }

}
