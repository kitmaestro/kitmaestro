import { Component, Input, inject } from '@angular/core';
import { DidacticResource } from '../../interfaces/didactic-resource';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { DidacticResourceService } from '../../services/didactic-resource.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UserSettingsService } from '../../services/user-settings.service';
import { sha512_256 } from 'js-sha512';
import { UserSettings } from '../../interfaces/user-settings';
import { PretifyPipe } from '../../pipes/pretify.pipe';

@Component({
    selector: 'app-resource-card',
    imports: [
        MatCardModule,
        MatButtonModule,
        MatDialogModule,
        MatSnackBarModule,
        RouterLink,
        CommonModule,
        PretifyPipe,
        MatIconModule,
    ],
    templateUrl: './resource-card.component.html',
    styleUrl: './resource-card.component.scss'
})
export class ResourceCardComponent {
  settingsService = inject(UserSettingsService);
  @Input() resource: DidacticResource | null = null;
  @Input() owned = false;

  didacticResourceService = inject(DidacticResourceService);
  sb = inject(MatSnackBar);
  user: UserSettings | null = null;

  bookmarked = false;

  load() {
    this.settingsService.getSettings().subscribe(user => {
      this.user = user;
      if (this.resource)
        this.bookmarked = user.bookmarks.includes(this.resource?._id);
    });
  }

  bookmark() {
    if (this.resource) {
      if (this.user) {
        if (this.user.bookmarks.includes(this.resource._id)) {
          return;
        }
      }
      const sus = this.didacticResourceService.bookmark(this.resource._id).subscribe({
        next: res => {
          sus.unsubscribe();
          if (res.modifiedCount > 0) {
            this.sb.open('El recurso ha sido guardado en tu biblioteca!', 'Ok', { duration: 2500 });
          }
          this.load();
        }
      });
    }
  }

  getInteger(n?: number) {
    return n ? `${n}`.split('.')[0] : '0';
  }

  getDecimals(n?: number) {
    return n ? `${n}`.split('.').reverse()[0].padStart(2, '0') : '00';
  }

  gravatar(email: string) {
    return sha512_256(email.trim().toLowerCase());
  }
}
