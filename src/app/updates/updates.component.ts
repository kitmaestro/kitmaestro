import { Component, inject, OnInit } from '@angular/core';
import { Update } from '../interfaces/update';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AsyncPipe, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UpdateService } from '../services/update.service';

@Component({
  selector: 'app-updates',
  standalone: true,
  imports: [
    MatCardModule,
    MatExpansionModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    HttpClientModule,
    DatePipe,
    AsyncPipe,
  ],
  templateUrl: './updates.component.html',
  styleUrl: './updates.component.scss'
})
export class UpdatesComponent implements OnInit {
  private updateService = inject(UpdateService);
  public updates$: Observable<Update[]> = this.updateService.findAll();

  ngOnInit() {
  }
}
