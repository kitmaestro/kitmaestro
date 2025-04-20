import { Component, inject, OnInit } from '@angular/core';
import { ReadingActivityService } from '../services/reading-activity.service';
import { ReadingActivity } from '../interfaces/reading-activity';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PretifyPipe } from '../pipes/pretify.pipe';
import { ReadingActivityDetailComponent } from './reading-activity-detail.component';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-reading-activities',
    imports: [
        RouterLink,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatTableModule,
        MatSnackBarModule,
        DatePipe,
        PretifyPipe,
        MatDialogModule,
    ],
    templateUrl: './reading-activities.component.html'
})
export class ReadingActivitiesComponent implements OnInit {
  private activityService = inject(ReadingActivityService);
  private sb = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  printing = false;
  public activities: ReadingActivity[] = [];
  public displayedColumns = ['section', 'creationDate', 'level', 'title', 'questions', 'actions'];

  ngOnInit() {
    this.loadActivities();
  }

  loadActivities() {
    const sus = this.activityService.findAll().subscribe({
      next: activities => {
        sus.unsubscribe();
        if (activities.length) {
          this.activities = activities;
        }
      },
    })
  }

  openActivity(activity: ReadingActivity) {
    this.dialog.open(ReadingActivityDetailComponent, {
      data: activity,
      width: '90%',
      maxWidth: '1200px',
    });
  }

  pretify(str: string) {
    return (new PretifyPipe()).transform(str);
  }

  deleteActivity(id: string) {
    this.activityService.delete(id).subscribe(res => {
      if (res.deletedCount === 1) {
        this.sb.open('Se ha eliminado la actividad', 'Ok', { duration: 2500 });
        this.loadActivities();
      }
    })
  }

  async downloadActivity(activity: ReadingActivity) {
    this.printing = true;
    await this.activityService.download(activity);
    this.printing = false;
  }
}
