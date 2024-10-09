import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UserSettings } from '../../interfaces/user-settings';
import { EstimationScaleService } from '../../services/estimation-scale.service';
import { ClassSectionService } from '../../services/class-section.service';
import { CompetenceService } from '../../services/competence.service';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ClassSection } from '../../interfaces/class-section';

@Component({
  selector: 'app-estimation-scale',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatSnackBarModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './estimation-scale.component.html',
  styleUrl: './estimation-scale.component.scss'
})
export class EstimationScaleComponent implements OnInit {
  private estimationScaleService = inject(EstimationScaleService);
  private competenceService = inject(CompetenceService);
  private sectionService = inject(ClassSectionService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private sb = inject(MatSnackBar);
  private fb = inject(FormBuilder);

  public user: UserSettings | null = null;
  public sections: ClassSection[] = [];
  public subjects: string[] = [];
  
  public scaleForm = this.fb.group({
    title: [''],
    section: [''],
    subject: [''],
    competence: [''],
    achievementIndicators: [''],
    activity: [''],
    criteria: [''],
    levels: this.fb.array([
      this.fb.control('Iniciado'),
      this.fb.control('En Proceso'),
      this.fb.control('Logrado'),
    ]),
  });

  ngOnInit(): void {
    this.sectionService.findSections().subscribe(sections => {
      if (sections.length) {
        this.sections = sections;
      }
    });
    this.authService.profile().subscribe(user => {
      if (user) {
        this.user = user;
      }
    });
  }

  onSubmit() {
    // generate the estimation scale
  }

  save() {
    const scale: any = this.scaleForm.value;
    scale.user = this.user?._id;
    this.estimationScaleService.create(scale).subscribe(res => {
      if (res._id) {
        this.router.navigate(['/assessments/estimation-scales/', res._id]).then(() => {
          this.sb.open('Se ha guardado el instrumento', 'Ok', { duration: 2500 });
        });
      }
    });
  }

  pretifySubject(name: string) {
    switch (name) {
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

  onSectionSelect(event: any) {
    const { value } = event;
    if (!value) {
      this.subjects = [];
      return;
    }
    const section = this.sections.find(s => s._id == value);
    if (section) {
      this.subjects = (section.subjects as any);
      return;
    }
    return [];
  }
}
