import { Component, inject, OnInit } from '@angular/core';
import { SliderComponent } from '../../ui/slider/slider.component';
import { ActivatedRoute, Router } from '@angular/router';
import { DidacticResource } from '../../interfaces/didactic-resource';
import { CommonModule } from '@angular/common';
import { EMPTY, Observable, map, tap } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { DidacticResourceService } from '../../services/didactic-resource.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UserSettingsService } from '../../services/user-settings.service';
import { MatIconModule } from '@angular/material/icon';
import { GravatarPipe } from '../../pipes/gravatar.pipe';
import { PretifyPipe } from '../../pipes/pretify.pipe';
import { UserSettings } from '../../interfaces/user-settings';

@Component({
    selector: 'app-resource-details',
    imports: [
        SliderComponent,
        CommonModule,
        MatCardModule,
        MatButtonModule,
        MatSnackBarModule,
        GravatarPipe,
        PretifyPipe,
        MatIconModule,
    ],
    templateUrl: './resource-details.component.html',
    styleUrl: './resource-details.component.scss'
})
export class ResourceDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private sb = inject(MatSnackBar);
  private didacticResourceService = inject(DidacticResourceService);
  private settingsService = inject(UserSettingsService);

  id = this.route.snapshot.paramMap.get('id') || '';
  bookmarked = false;
  downloading = false;
  user: UserSettings | null = null;
  resource: DidacticResource | null = null;

  load() {
    this.settingsService.getSettings().subscribe(user => {
      this.user = user;
      this.bookmarked = user.bookmarks.includes(this.id);
    });
    this.didacticResourceService.findOne(this.id).subscribe({
      next: resource => {
        if (resource)
          this.resource = resource;
      },
      error: err => {
        console.log(err)
        this.router.navigateByUrl('/resources').then(() => {
          this.sb.open('No se encontro el recurso');
        });
      }
    });
  }

  ngOnInit() {
    this.load();
  }

  getInteger(n?: number) {
    return n ? `${n}`.split('.')[0] : '0';
  }

  getDecimals(n?: number) {
    return n ? `${n}`.split('.').reverse()[0].padStart(2, '0') : '00';
  }

  downloadOrBuy(link: string, download = false) {
    if (!this.id || this.downloading)
      return;

    this.downloading = true;

    if (download) {
      const a = document.createElement('a') as HTMLAnchorElement;
      document.body.appendChild(a);
      a.style.display = 'none';
      a.href = link;
      a.download = link.split('/').reverse()[0];
      a.target = '_blank';
      a.click();
      document.body.removeChild(a);
      this.didacticResourceService.download(this.id).subscribe(res => {
        this.load();
      });
      this.downloading = false;
    } else {
      this.downloading = false;
    }
  }

  bookmark() {
    if (!this.id)
      return;

    this.didacticResourceService.bookmark(this.id).subscribe((res) => {
      this.load();
      if (res.modifiedCount > 0)
        this.sb.open('El recurso ha sido guardado en tu biblioteca!', 'Ok', { duration: 2500 });
    });
  }
}
