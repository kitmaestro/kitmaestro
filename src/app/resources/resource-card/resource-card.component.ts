import { Component, Input, inject } from '@angular/core';
import { DidacticResource } from '../../interfaces/didactic-resource';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ElipsisPipe } from '../../pipes/elipsis.pipe';
import { MatIconModule } from '@angular/material/icon';
import { UserSettings } from '../../interfaces/user-settings';
import { DidacticResourceService } from '../../services/didactic-resource.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { map } from 'rxjs';
import { UserSettingsService } from '../../services/user-settings.service';

@Component({
  selector: 'app-resource-card',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatDialogModule,
    MatSnackBarModule,
    RouterLink,
    CommonModule,
    RouterLink,
    ElipsisPipe,
    MatIconModule,
  ],
  templateUrl: './resource-card.component.html',
  styleUrl: './resource-card.component.scss'
})
export class ResourceCardComponent {
  settingsService = inject(UserSettingsService);
  @Input() resource: DidacticResource | null = null;
  @Input() owned: boolean = false;
  @Input() author: UserSettings | undefined | null = null;

  didacticResourceService = inject(DidacticResourceService);
  sb = inject(MatSnackBar);

  bookmarked = this.settingsService.getSettings().pipe(map(settings => this.resource && settings && settings.bookmarks.includes(this.resource.id)))

  bookmark() {
    if (this.resource) {
      this.didacticResourceService.bookmarkResource(this.resource.id);
      this.sb.open('El recurso ha sido guardado en tu biblioteca!', 'Ok', { duration: 2500 });
    }
  }

  getInteger(n?: number) {
    return n ? `${n}`.split('.')[0] : '0';
  }

  getDecimals(n?: number) {
    return n ? `${n}`.split('.').reverse()[0].padStart(2, '0') : '00';
  }
}
