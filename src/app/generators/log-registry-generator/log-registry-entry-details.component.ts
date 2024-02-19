import { Component, Inject, OnInit, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { LogRegistryEntry } from "../../interfaces/log-registry-entry";
import { CommonModule } from "@angular/common";

@Component({
    standalone: true,
    styles: '',
    templateUrl: './log-registry-entry-details.component.html',
    imports: [
        MatDialogModule,
        MatButtonModule,
        MatIconModule,
        CommonModule,
    ]
})
export class LogRegistryEntryDetailsComponent implements OnInit {
    dialogRef = inject(MatDialogRef<LogRegistryEntryDetailsComponent>);
    entry: LogRegistryEntry | null = null;
    loading = true;

    constructor(
        @Inject(MAT_DIALOG_DATA)
        private data: LogRegistryEntry,
    ) {}

    ngOnInit() {
        if (this.data) {
            this.entry = this.data;
        }
        this.loading = false;
    }

    closeAndEdit() {
        this.dialogRef.close(true);
    }

    close() {
        this.dialogRef.close(false);
    }

    timestampToDate(t: any) {
        return new Date(t.seconds * 1000);
    }
}