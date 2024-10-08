import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UserSettings } from '../../interfaces/user-settings';
import { EstimationScaleService } from '../../services/estimation-scale.service';
import { ClassSectionService } from '../../services/class-section.service';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ClassSection } from '../../interfaces/class-section';

@Component({
  selector: 'app-estimation-scale',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatSnackBarModule,
  ],
  templateUrl: './estimation-scale.component.html',
  styleUrl: './estimation-scale.component.scss'
})
export class EstimationScaleComponent implements OnInit {
  private estimationScaleService = inject(EstimationScaleService);
  private sectionService = inject(ClassSectionService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private sb = inject(MatSnackBar);
  private fb = inject(FormBuilder);

  public user: UserSettings | null = null;
  public sections: ClassSection[] = [];
  
  public scaleForm = this.fb.group({
    title: [''],
    section: [''],
    subject: [''],
    competence: [''],
    achievementIndicators: [''],
    activity: [''],
    criteria: [''],
    levels: [''],
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
}
