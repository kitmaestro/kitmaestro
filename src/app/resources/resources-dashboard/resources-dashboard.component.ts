import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Store } from '@ngrx/store';
import { IsEmptyComponent } from '../../ui/alerts/is-empty/is-empty.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ResourceFormComponent } from '../../ui/forms/resource-form/resource-form.component';
import { loadMyResources } from '../../state/actions/didactic-resources.actions';
import { map, Observable } from 'rxjs';
import { DidacticResource } from '../../interfaces/didactic-resource';

@Component({
  selector: 'app-resources-dashboard',
  templateUrl: './resources-dashboard.component.html',
  styleUrl: './resources-dashboard.component.scss',
  standalone: true,
  imports: [
    AsyncPipe,
    MatGridListModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    IsEmptyComponent
  ]
})
export class ResourcesDashboardComponent {
  private store = inject(Store);
  private dialog = inject(MatDialog);
  public resources$: Observable<DidacticResource[]> = this.store.select((store) => store.didacticResources).pipe(map(store => store.didacticResources));

  constructor() {
    this.store.dispatch(loadMyResources())
  }

  createResource() {
    this.dialog.open(ResourceFormComponent);
  }
}
