import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-confirmation-dialog',
    standalone: true,
    imports: [MatDialogModule, MatButtonModule],
    template: `
    <div class="confirmation-dialog">
      <h2 mat-dialog-title>{{ data.title }}</h2>
      <mat-dialog-content>
        <p>{{ data.message }}</p>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button (click)="onCancel()">Cancelar</button>
        <button mat-raised-button color="warn" (click)="onConfirm()">Confirmar</button>
      </mat-dialog-actions>
    </div>
  `,
    styles: `
    .confirmation-dialog {
      min-width: 300px;
    }
    
    mat-dialog-content p {
      margin: 0;
      line-height: 1.5;
    }
    
    mat-dialog-actions {
      gap: 8px;
      margin-top: 16px;
    }
  `
})
export class ConfirmationDialogComponent {
    #dialogRef = inject(MatDialogRef<ConfirmationDialogComponent>);

    data = inject<{ title: string; message: string }>(MAT_DIALOG_DATA);

    onConfirm(): void {
        this.#dialogRef.close(true);
    }

    onCancel(): void {
        this.#dialogRef.close(false);
    }
}
