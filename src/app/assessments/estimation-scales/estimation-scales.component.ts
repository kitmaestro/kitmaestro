import { Component, inject, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { EstimationScaleService } from '../../services/estimation-scale.service';
import { EstimationScale } from '../../interfaces/estimation-scale';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-estimation-scales',
    imports: [
        MatTableModule,
        MatSnackBarModule,
        MatButtonModule,
        MatIconModule,
        RouterLink,
        DatePipe,
        MatCardModule,
    ],
    templateUrl: './estimation-scales.component.html',
    styleUrl: './estimation-scales.component.scss'
})
export class EstimationScalesComponent implements OnInit {
  private scaleService = inject(EstimationScaleService);
  private sb = inject(MatSnackBar);

  displayedColumns = ['title', 'section', 'subject', 'activity', 'actions'];

  assessments: EstimationScale[] = [];

  ngOnInit(): void {
    this.loadInstruments();
  }

  loadInstruments() {
    this.scaleService.findAll().subscribe(scales => {
      if (scales.length) {
        this.assessments = scales;
      }
    });
  }

  deleteAssessment(id: string) {
    this.scaleService.delete(id).subscribe(() => {
      this.sb.open('Se ha eliminado el intrumento', 'Ok', { duration: 2500 });
      this.loadInstruments();
    });
  }
}
