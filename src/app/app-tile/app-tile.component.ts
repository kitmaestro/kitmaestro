import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { AppEntry } from '../interfaces/app-entry';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-tile',
  imports: [
    NgIf,
    RouterLink,
    MatCardModule,
  ],
  template: `
    <a *ngIf="app() as entry" [routerLink]="entry.link" class="app-card">
        <mat-card class="card">
          <mat-card-content>
            <div class="inner-grid">
              <img [src]="entry.icon" [alt]="entry.name">
              <div style="text-align: center;">
                <p style="font-weight: bold;">{{entry.name}}</p>
                <p>{{entry.description}}</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
    </a>
  `,
  styles: `
    @media screen and (max-width: 720px) {
        h2 {
            font-size: 16px;
        }
    }

.app-card {
  cursor: pointer;
  margin-bottom: 16px;
  display: block;
  color: #263238;
  height: 100%;
  text-decoration: none;
}

p {
    font-size: 14px;
    color: gray;
    font-family: Roboto, sans-serif;
    line-height: 1.5;
}

.inner-grid {
  display: grid;
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
}
