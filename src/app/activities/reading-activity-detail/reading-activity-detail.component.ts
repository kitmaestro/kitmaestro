import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ReadingActivityService } from '../../services/reading-activity.service';
import { ReadingActivity } from '../../interfaces/reading-activity';
import { IsPremiumComponent } from '../../ui/alerts/is-premium/is-premium.component';
import { MatIconModule } from '@angular/material/icon';
import { PdfService } from '../../services/pdf.service';
import { UserSettingsService } from '../../services/user-settings.service';
import { UserSettings } from '../../interfaces/user-settings';

@Component({
  selector: 'app-reading-activity-detail',
  standalone: true,
  imports: [
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    IsPremiumComponent,
  ],
  templateUrl: './reading-activity-detail.component.html',
  styleUrl: './reading-activity-detail.component.scss'
})
export class ReadingActivityDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private sb = inject(MatSnackBar);
  private activityService = inject(ReadingActivityService);
  private pdfService = inject(PdfService);
  private userSettingsService = inject(UserSettingsService);

  public id = this.route.snapshot.paramMap.get('id') || '';
  public activity: ReadingActivity | null = null;
  public user: UserSettings | null = null;

  loadActivity() {
    this.activityService.find(this.id).subscribe(activity => {
      if (activity._id) {
        this.activity = activity;
      }
    });
  }

  ngOnInit(): void {
    this.loadActivity();
    this.userSettingsService.getSettings().subscribe(user => {
      if (user) {
        this.user = user;
      }
    });
  }

  deleteActivity() {
    this.activityService.delete(this.id).subscribe(res => {
      if (res.deletedCount == 1) {
        this.router.navigate(['/activities', 'reading']).then(() => {
          this.sb.open('Actividad eliminada.', 'Ok', { duration: 2500 });
        });
      }
    });
  }

  download() {
    if (this.activity) {
      this.sb.open('Descargando la actividad...', 'Ok', { duration: 2500 });
      this.pdfService.exportTableToPDF('reading-activity', this.activity.title)
    }
  }

  get schoolYear(): string {
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    if (currentMonth > 7) {
      return `${currentYear} - ${currentYear + 1}`;
    }
    return `${currentYear - 1} - ${currentYear}`;
  }
}
