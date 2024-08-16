import { Component, inject } from '@angular/core';
import { UnitPlansService } from '../../services/unit-plans.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { IsPremiumComponent } from '../../ui/alerts/is-premium/is-premium.component';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { AsyncPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-unit-plan-list',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    IsPremiumComponent,
    MatListModule,
    AsyncPipe,
    RouterModule,
    MatIconModule,
  ],
  templateUrl: './unit-plan-list.component.html',
  styleUrl: './unit-plan-list.component.scss'
})
export class UnitPlanListComponent {

  unitPlansService = inject(UnitPlansService);
  unitPlans$ = this.unitPlansService.unitPlans$;
  sb = inject(MatSnackBar);

  deletePlan(id: string) {
    this.unitPlansService.deletePlan(id).then(() => {
      this.sb.open('El Plan fue eliminado!');
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

}
