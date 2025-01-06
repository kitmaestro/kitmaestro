import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
    selector: 'app-is-empty',
    imports: [
        MatButtonModule,
        MatCardModule,
    ],
    template: `
    <mat-card>
      <mat-card-content>
        <div class="no-data-container">
          <h2>No hay datos todavía</h2>
          <p>¡Empieza ahora!</p>
          <button mat-raised-button (click)="createRequest()" color="primary">Crear {{resourceName}}</button>
        </div>
      </mat-card-content>
    </mat-card>
  `,
    styles: [`
    mat-card {
      margin-top: 16px;
    }

    .no-data-container {
      text-align: center;
      padding: 20px;

      p {
        padding-top: 12px;
        padding-bottom: 12px;
        font-size: 16px;
      }
    }

    h2 {
      margin-bottom: 12px;
    }

    button {
      margin: 12px 0;
    }
  `]
})
export class IsEmptyComponent {
  @Input('resource') resourceName: string = 'Recurso';
  @Output() onCreateRequest: EventEmitter<void> = new EventEmitter();

  createRequest() {
    this.onCreateRequest.emit();
  }
}
