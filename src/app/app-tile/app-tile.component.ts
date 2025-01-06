import { Component, input, output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { AppEntry } from '../interfaces/app-entry';
import { NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-tile',
  imports: [
    NgIf,
    RouterLink,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
  ],
  template: `
    <mat-card class="card" *ngIf="app() as entry">
      @if (entry.link.length) {
        <button mat-icon-button [class.active]="isFav()" (click)="mark()"><mat-icon>star</mat-icon></button>
      }
      <mat-card-content>
        <a [routerLink]="entry.link" class="app-card">
          <div class="inner-grid">
            <img [src]="entry.icon" [alt]="entry.name">
            <div style="text-align: center;">
              <p style="font-weight: bold;">{{entry.name}}</p>
              <p>{{entry.description}}</p>
            </div>
          </div>
        </a>
      </mat-card-content>
    </mat-card>
  `,
  styles: `
.app-card {
  cursor: pointer;
  margin-bottom: 16px;
  display: block;
  color: #263238;
  height: 100%;
  text-decoration: none;
}

.active {
  color: #005cbb;
}

p {
    font-size: 14px;
    color: gray;
    font-family: Roboto, sans-serif;
    line-height: 1.5;
}

.inner-grid {
  display: grid;
  margin-top: 12px;
  grid-template-rows: 1fr 1fr;
  gap: 12px;
  height: 100%;
  align-items: center;

  img {
    width: 50%;
    display: block;
    aspect-ratio: 4/3;
    margin: 0 auto 12px;
  }
}

.card {
  height: 100%;
  position: relative;
}

button {
  position: absolute;
  top: 12px;
  right: 12px;
}

.card:hover {
  background-color: #d7e3ff;

  & p {
    color: #005cbb;
  }
}`
})
export class AppTileComponent {
  app = input.required<AppEntry>();
  isFav = input<boolean>(false);
  markFavorite = output<AppEntry>();

  mark() {
    this.markFavorite.emit(this.app());
  }
}
