import { Component, inject } from '@angular/core';
import { SliderComponent } from '../../ui/slider/slider.component';
import { ActivatedRoute } from '@angular/router';
import { DidacticResource } from '../../interfaces/didactic-resource';
import { CommonModule } from '@angular/common';
import { EMPTY, Observable, map, tap } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { UserSettings } from '../../interfaces/user-settings';
import { MatButtonModule } from '@angular/material/button';
import { DidacticResourceService } from '../../services/didactic-resource.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UserSettingsService } from '../../services/user-settings.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-resource-details',
  standalone: true,
  imports: [
    SliderComponent,
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatSnackBarModule,
    MatIconModule,
  ],
  templateUrl: './resource-details.component.html',
  styleUrl: './resource-details.component.scss'
})
export class ResourceDetailsComponent {
  route = inject(ActivatedRoute);
  sb = inject(MatSnackBar);
  didacticResourceService = inject(DidacticResourceService);
  settingsService =inject(UserSettingsService);

  id = this.route.snapshot.paramMap.get('id');
  bookmarked$: Observable<boolean> = EMPTY;
  author$: Observable<UserSettings> = EMPTY;
  downloading = false;
  resource$: Observable<DidacticResource> = this.didacticResourceService.findOne('' + this.id).pipe(
    tap(resource => this.author$ = this.settingsService.getSettings(resource.author)),
    tap(resource => this.bookmarked$ = this.settingsService.getSettings().pipe(map(settings => settings && settings.bookmarks.includes(resource.id) ? true : false)))
  );

  slides: string[] = [
    '//picsum.photos/seed/ken/400',
    '//picsum.photos/seed/kenl/400',
    '//picsum.photos/seed/kenli/400',
    '//picsum.photos/seed/kenlit/400',
    '//picsum.photos/seed/kenlite/400',
    '//picsum.photos/seed/kenliten/400',
  ];

  getInteger(n?: number) {
    return n ? `${n}`.split('.')[0] : '0';
  }

  getDecimals(n?: number) {
    return n ? `${n}`.split('.').reverse()[0].padStart(2, '0') : '00';
  }

  downloadOrBuy(link: string, download: boolean = false) {
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
      this.didacticResourceService.download(this.id);
      this.downloading = false;
    } else {
      this.downloading = false;
    }
  }

  bookmark() {
    if (!this.id)
      return;

    this.didacticResourceService.bookmark(this.id);
    this.sb.open('El recurso ha sido guardado en tu biblioteca!', 'Ok', { duration: 2500 });
  }
}
