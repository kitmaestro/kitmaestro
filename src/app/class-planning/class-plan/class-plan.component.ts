import { Component, inject, Input } from '@angular/core';
import { ClassPlan } from '../../interfaces/class-plan';
import { DatePipe } from '@angular/common';
import { UserSettings } from '../../interfaces/user-settings';
import { AuthService } from '../../services/auth.service';
import { ClassSection } from '../../interfaces/class-section';

@Component({
    selector: 'app-class-plan',
    imports: [
        DatePipe,
    ],
    templateUrl: './class-plan.component.html',
    styleUrl: './class-plan.component.scss'
})
export class ClassPlanComponent {
  @Input() classPlan: ClassPlan | null = null;
  @Input() section: ClassSection | null = null;
  userService = inject(AuthService);
  user: UserSettings | null = null;

  pretify(str: string) {
    switch(str) {
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

  ngOnInit() {
    this.userService.profile().subscribe(user => {
      if (user._id) {
        this.user = user;
      }
    });
  }
}
