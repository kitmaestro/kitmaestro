import { Component, inject, OnInit } from '@angular/core';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { UnitPlanService } from '../../services/unit-plan.service';
import { Observable, tap } from 'rxjs';
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
import { AlignmentType, Document, HeadingLevel, ImageRun, Packer, PageOrientation, Paragraph, Table, TableCell, TableRow, TextRun, TextWrappingSide, TextWrappingType, WidthType } from 'docx';
import { saveAs } from 'file-saver';
import { PretifyPipe } from '../../pipes/pretify.pipe';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-unit-plan-detail',
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
  printing = false;
  planId = this.route.snapshot.paramMap.get('id') || '';
  plan: UnitPlan | null = null;

  plan$: Observable<UnitPlan> = this.unitPlanService.findOne(this.planId).pipe(tap(_ => {
    if (!_) {
      this.router.navigate(['/unit-plans/list']).then(() => {
        this.sb.open('Este plan no ha sido encontrado', 'Ok', { duration: 2500 });
      });
    } else {
      this.plan = _;
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
  
  pretify(value: string): string {
    return new PretifyPipe().transform(value);
  }

  pretifyCompetence(value: string, level: string) {
    if (level == 'PRIMARIA') {
      if (value == 'Comunicativa') {
        return 'Comunicativa';
      }
      if (value.includes('Pensamiento')) {
        return 'Pensamiento Lógico Creativo y Crítico; Resolución de Problemas; Tecnológica y Científica';
      }
      if (value.includes('Ciudadana')) {
        return 'Ética Y Ciudadana; Desarrollo Personal y Espiritual; Ambiental y de la Salud';
      }
    } else {
      if (value == 'Comunicativa') {
        return 'Comunicativa';
      }
      if (value == 'Pensamiento Logico') {
        return 'Pensamiento Lógico, Creativo y Crítico';
      }
      if (value == 'Resolucion De Problemas') {
        return 'Resolución de Problemas';
      }
      if (value == 'Ciencia Y Tecnologia') {
        return 'Tecnológica y Científica';
      }
      if (value == 'Etica Y Ciudadana') {
        return 'Ética y Ciudadana';
      }
      if (value == 'Desarrollo Personal Y Espiritual') {
        return 'Desarrollo Personal y Espiritual';
      }
      if (value == 'Ambiental Y De La Salud') {
        return 'Ambiental y de la Salud';
      }
    }
    return value;
  }

  async download() {
    if (!this.plan)
      return;
    this.printing = true;
    this.sb.open('Tu descarga empezara en breve, espera un momento...', 'Ok', { duration: 2500 });
    // const response = await fetch(
    //   "https://api.algobook.info/v1/randomimage?category=education"
    // );
    // const img = await response.arrayBuffer();
    await this.unitPlanService.download(this.plan);
    this.printing = false;
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
    this.sb.open('Estamos exportando tu plan. No te muevas!', 'Ok', { duration: 2500 })
    this.pdfService.exportToPdf('table', 'Unidad de Aprendizaje ' + this.route.snapshot.paramMap.get('id'), false);
  }

  deletePlan() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.unitPlanService.delete(id).subscribe((result) => {
        if (result.deletedCount == 1) {
          this.router.navigate(['/unit-plans']).then(() => {
            this.sb.open('El plan ha sido eliminado.', 'Ok', { duration: 2500 });
          })
        }
      });
    } else {
      this.sb.open('No se puede eliminar el plan. Se produjo un error.', 'Ok', { duration: 2500 });
    }
  }
}
